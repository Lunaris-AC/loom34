import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { db } from "@/db/client";
import { toast } from "sonner";

// Types
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: AuthError | null;
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialisation
  useEffect(() => {
    let mounted = true;
    async function init() {
      setIsLoading(true);
      const { data: { session } } = await db.auth.getSession();
      setSession(session);
      if (session?.user) {
        const { data, error: profileError } = await db
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (mounted) setProfile(data || null);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    }
    init();
    // Listener pour login/logout
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        db.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data || null));
      } else {
        setProfile(null);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      if (data.session?.user) {
        const { data: profileData } = await db
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        setProfile(profileData || null);
      }
      toast.success("Connexion réussie");
    } catch (error) {
      setError(error as AuthError);
      toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await db.auth.signOut();
      setSession(null);
      setProfile(null);
      toast.success("Déconnexion réussie");
    } catch (error) {
      setError(error as AuthError);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      profile,
      isLoading,
      isAuthenticated: !!session?.user,
      isAdmin: !!profile?.is_admin,
      signIn,
      signOut,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
