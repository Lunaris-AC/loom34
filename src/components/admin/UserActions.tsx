import { useState } from 'react';
import { db } from '@/db/client';
import { Tables } from '@/db/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { EditUserForm } from './EditUserForm';

type Profile = Tables<'profiles'>;

interface UserActionsProps {
  user: Profile;
  onUserUpdated: () => void;
}

export default function UserActions({ user, onUserUpdated }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    setLoading(true);
    try {
      const { error } = await db
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Utilisateur supprimé avec succès');
      onUserUpdated();
    } catch (error) {
      console.error('', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <EditUserForm
            profile={user}
            onSuccess={() => {
              setOpen(false);
              onUserUpdated();
            }}
          />
        </DialogContent>
      </Dialog>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Suppression...' : 'Supprimer'}
      </Button>
    </div>
  );
}
