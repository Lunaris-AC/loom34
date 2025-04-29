import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { UserActions } from "@/components/admin/UserActions";

export default function AdminUsers() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des utilisateurs">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Utilisateurs</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Créer un utilisateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <CreateUserForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Nom complet</TableHead>
              <TableHead>Statut admin</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.username || '-'}</TableCell>
                <TableCell>{profile.full_name || '-'}</TableCell>
                <TableCell>{profile.is_admin ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions profile={profile} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
