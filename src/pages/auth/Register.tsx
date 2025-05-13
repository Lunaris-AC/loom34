import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Registration form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        username: data.username,
      });
      
      toast.success('Account created! Please check your email to confirm your registration.');
      navigate('/auth/login', { 
        replace: true
      });
    } catch (error) {
      console.error('Registration error:', error);
      // Error toast is already shown in the auth context
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your information to create a new account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                disabled={isLoading}
                {...form.register('fullName')}
              />
              {form.formState.errors.fullName && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.fullName.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                disabled={isLoading}
                {...form.register('username')}
              />
              {form.formState.errors.username && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.username.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </span>
              )}
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
