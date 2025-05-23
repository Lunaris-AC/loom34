import { useState } from 'react';
import { db } from '@/db/client';
import { Tables } from '@/db/types';
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Users as UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/admin/DialogHeader";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { useQuery } from "@tanstack/react-query";

type Profile = Tables<'profiles'>;

export default function Users() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const { data: users, isLoading, refetch } = useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await db
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
      try {
      // Utilisation de la fonction RPC delete_user pour supprimer l'utilisateur côté Auth et profil
      // @ts-expect-error: Allow custom RPC function name
      const { error } = await db.rpc('delete_user' as any, { user_id: selectedUser.id });
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      toast.success("Utilisateur supprimé avec succès");
      refetch();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Erreur lors de la suppression de l'utilisateur");
    }
  };

  const confirmDelete = (user: Profile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Utilisateurs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
          <p className="text-gray-500 mt-1">Créez, modifiez et gérez les utilisateurs</p>
        </div>
        <Button 
          variant="brown"
          className="bg-brown hover:bg-brown/90" 
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      <Separator className="my-4" />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : users?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'utilisateurs.</p>
          <Button 
            variant="brown"
            className="bg-brown hover:bg-brown/90" 
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier utilisateur
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_admin
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.is_admin ? "Oui" : "Non"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => confirmDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader 
            title="Ajouter un utilisateur" 
            description="Créez un nouvel utilisateur en remplissant le formulaire ci-dessous."
          />
          <CreateUserForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              refetch();
              toast.success("Utilisateur créé avec succès");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader 
            title="Modifier l'utilisateur" 
            description="Modifiez les informations de l'utilisateur ci-dessous."
          />
          {selectedUser && (
            <EditUserForm
              profile={selectedUser}
              onSuccess={() => {
                setEditDialogOpen(false);
                refetch();
                toast.success("Utilisateur modifié avec succès");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader title="Confirmer la suppression" />
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.username}"? Cette action ne peut pas être annulée.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
