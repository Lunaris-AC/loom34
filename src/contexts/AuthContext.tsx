import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, retryOperation, checkConnection } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast: uiToast } = useToast();

  // Fonction pour réinitialiser l'état d'authentification
  const resetAuthState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  // Fonction pour mettre à jour l'état d'authentification
  const updateAuthState = async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user || null);
    
    if (currentSession?.user) {
      await fetchProfile(currentSession.user.id);
    } else {
      resetAuthState();
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const initAuth = async () => {
      if (!mounted) return;
      setIsLoading(true);
      
      try {
        // Vérifier la connexion avant de commencer
        const isConnected = await checkConnection();
        if (!isConnected) {
          console.error("Pas de connexion à la base de données");
          resetAuthState();
          setIsLoading(false);
          return;
        }

        // Récupérer la session avec retry
        const { data: { session: existingSession }, error: sessionError } = 
          await retryOperation(() => supabase.auth.getSession());
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          resetAuthState();
          setIsLoading(false);
          return;
        }
        
        if (existingSession) {
          await updateAuthState(existingSession);
        }
        
        // Configurer l'écouteur d'état d'authentification
        authSubscription = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", event, currentSession?.user?.id);
            await updateAuthState(currentSession);
          }
        );
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error in authentication initialization:", error);
        resetAuthState();
        setIsLoading(false);
      }
    };
    
    initAuth();

    // Nettoyage
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [uiToast]);
  
  async function fetchProfile(userId: string) {
    try {
      const isConnected = await checkConnection();
      if (!isConnected) {
        console.error("Pas de connexion à la base de données lors de la récupération du profil");
        setProfile(null);
        setIsAdmin(false);
        return;
      }

      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data;
      });
        
      setProfile(result);
      setIsAdmin(result?.is_admin || false);
    } catch (error) {
      console.error("Exception in fetchProfile:", error);
      setProfile(null);
      setIsAdmin(false);
    }
  }
  
  async function signIn(email: string, password: string) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        uiToast({
          title: "Échec de la connexion",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      uiToast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  async function signUp(email: string, password: string, userData: Partial<Profile>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });
      
      if (error) {
        uiToast({
          title: "Échec de l'inscription",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      uiToast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour le lien de confirmation.",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  async function signOut() {
    console.log("Attempting to sign out");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        uiToast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success("You have been signed out");
      
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
