import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/db/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Profile form validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      username: '',
      avatarUrl: '',
    },
  });
  
  // Load user profile data into the form
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.full_name || '',
        username: profile.username || '',
        avatarUrl: profile.avatar_url || '',
      });
    }
  }, [profile, form]);
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const result = await updateUserProfile(user.id, {
        full_name: data.fullName,
        username: data.username,
        avatar_url: data.avatarUrl || null,
      });
      
      if (result) {
        toast.success('Profile updated successfully');
        await refreshProfile();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create initials for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return 'U';
    return profile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{profile?.full_name}</h2>
            <p className="text-muted-foreground">@{profile?.username}</p>
            <p className="mt-2">{user?.email}</p>
            
            <div className="mt-4 w-full">
              {profile?.is_admin && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Administrateur
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => signOut()}
              >
                Déconnexion
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Modifier le profil</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
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
                <Label htmlFor="username">Nom d'utilisateur</Label>
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
                <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isLoading}
                  {...form.register('avatarUrl')}
                />
                {form.formState.errors.avatarUrl && (
                  <span className="text-sm text-red-500">
                    {form.formState.errors.avatarUrl.message}
                  </span>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 