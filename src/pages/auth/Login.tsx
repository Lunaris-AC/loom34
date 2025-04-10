
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Check if user is already logged in
  useEffect(() => {
    if (user && initialLoad) {
      // If the user is already logged in, redirect to the previous page or home
      navigate(from, { replace: true });
    }
    setInitialLoad(false);
  }, [user, navigate, from, initialLoad]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Successfully signed in");
      // Use a short timeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Don't render the login form if still checking authentication status
  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tan/10">
        <div className="w-16 h-16 border-4 border-brown/20 border-t-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render the login form if user is already logged in
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tan/10">
        <div className="container max-w-md px-4 text-center">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Already Signed In</CardTitle>
              <CardDescription>
                You are already signed in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate(from, { replace: true })}
              >
                Continue to {from === "/" ? "Home" : from}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-tan/10">
      <div className="container max-w-md px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-brown hover:underline">
                  Create one
                </Link>
              </div>
              <div className="text-center text-sm">
                <Link to="/" className="text-gray-500 hover:underline">
                  Back to home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
