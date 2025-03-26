
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      
      try {
        // Check for active session
        const { data: { session: activeSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          uiToast({
            title: "Session Error",
            description: "There was a problem with your session. Please try again.",
            variant: "destructive",
          });
        }
        
        setSession(activeSession);
        setUser(activeSession?.user || null);
        
        if (activeSession?.user) {
          await fetchProfile(activeSession.user.id);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    getInitialSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [uiToast]);
  
  async function fetchProfile(userId: string) {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
        setIsAdmin(false);
        return;
      }
      
      console.log("Profile data:", data);
      setProfile(data);
      setIsAdmin(data?.is_admin || false);
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
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      uiToast({
        title: "Login Successful",
        description: "Welcome back!",
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
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      uiToast({
        title: "Registration Successful",
        description: "Check your email for a confirmation link.",
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
      
      // Reset state directly
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success("You have been signed out");
      
      // Force a page refresh to clear any cached state
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
