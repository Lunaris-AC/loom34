import { useState, useEffect } from 'react';
import { db } from '@/db/client';
import { Tables } from '@/db/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ContactTicket = Tables<'contact_tickets'> & {
  id: number;
  status: string;
};

export default function Tickets() {
  const [tickets, setTickets] = useState<ContactTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const { data, error } = await db
        .from('contact_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const { error } = await db
        .from('contact_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      setTickets(tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));

      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Tickets de contact">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Tickets de contact">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchTickets} className="mt-4">
            Réessayer
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tickets de contact">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Liste des tickets</h2>
        <Separator className="my-4" />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.message}</TableCell>
                <TableCell>{format(new Date(ticket.created_at), 'PPp', { locale: fr })}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-all duration-150 px-4 py-2 rounded"
                    onClick={async () => {
                      try {
                        const { error } = await db
                          .from('contact_tickets')
                          .delete()
                          .eq('id', ticket.id);
                        if (error) throw error;
                        setTickets(tickets.filter(t => t.id !== ticket.id));
                        toast.success('Ticket supprimé avec succès');
                      } catch (error) {
                        console.error('Erreur lors de la suppression du ticket:', error);
                        toast.error('Erreur lors de la suppression du ticket');
                      }
                    }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}