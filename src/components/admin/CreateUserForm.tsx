import { useState } from 'react';
import { db } from '@/db/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface CreateUserFormProps {
  onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    is_admin: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.full_name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);

    try {
      // Création de l'utilisateur dans Supabase Auth
      const { error: signUpError, data: signUpData } = await db.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name,
            is_admin: formData.is_admin
          }
        }
      });
      if (signUpError) throw signUpError;

      // Ajout dans la table profiles (optionnel si trigger automatique, sinon nécessaire)
      const { error } = await db
        .from('profiles')
        .insert({
          id: signUpData.user?.id || uuidv4(),
          username: formData.username,
          full_name: formData.full_name,
          email: formData.email,
          is_admin: formData.is_admin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      if (error) throw error;

      toast.success('Utilisateur créé avec succès');
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nom complet</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_admin"
          checked={formData.is_admin}
          onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
          disabled={loading}
        />
        <Label htmlFor="is_admin">Administrateur</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer l\'utilisateur'}
      </Button>
    </form>
  );
}
