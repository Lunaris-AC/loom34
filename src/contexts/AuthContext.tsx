import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { db, isDbConnected, withRetry } from "@/db/client";
import { toast } from "sonner";

// Define user profile type
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

// Define authentication context interface
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create authentication provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Reset authentication state
  const resetAuthState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      // Check database connection
      const connected = await isDbConnected();
      if (!connected) {
        console.error("Database connection failed during profile fetch");
        return null;
      }

      // Fetch profile with retry logic
      const profileData = await withRetry(async () => {
        const { data, error } = await db
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data as Profile;
      });
      
      return profileData;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  };

  // Update authentication state
  const updateAuthState = async (currentSession: Session | null) => {
    setSession(currentSession);
    
    if (currentSession?.user) {
      setUser(currentSession.user);
      
      const profileData = await fetchProfile(currentSession.user.id);
      if (profileData) {
        setProfile(profileData);
        setIsAdmin(profileData.is_admin);
        setIsAuthenticated(true);
      } else {
        resetAuthState();
      }
    } else {
      resetAuthState();
    }
  };

  // Initialize authentication on component mount
  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const initAuth = async () => {
      if (!mounted) return;
      setIsLoading(true);
      
      try {
        // Check database connection
        const connected = await isDbConnected();
        if (!connected) {
          console.error("Database connection failed during initialization");
          resetAuthState();
          setIsLoading(false);
          return;
        }

        // Get current session
        const { data: { session: currentSession }, error } = await db.auth.getSession();
        
        if (error) {
          console.error("Failed to get session:", error);
          resetAuthState();
        } else if (currentSession) {
          await updateAuthState(currentSession);
        }
        
        // Set up auth state change listener
        authSubscription = db.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;
          
          console.log("Auth state changed:", event, newSession?.user?.id);
          await updateAuthState(newSession);
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        resetAuthState();
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profileData = await fetchProfile(user.id);
      
      if (profileData) {
        setProfile(profileData);
        setIsAdmin(profileData.is_admin);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign in user
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await db.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(`Sign in failed: ${error.message}`);
        throw error;
      }
      
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up new user
  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    setIsLoading(true);
    
    try {
      const { error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });
      
      if (error) {
        toast.error(`Sign up failed: ${error.message}`);
        throw error;
      }
      
      toast.success("Account created! Please check your email to confirm your registration.");
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out user
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await db.auth.signOut();
      
      if (error) {
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      resetAuthState();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value to be provided
  const contextValue: AuthContextType = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
