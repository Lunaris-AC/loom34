import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';

type TicketStatus = 'Nouveau' | 'En attente' | 'Répondu' | 'Fermé';

const Tickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: TicketStatus }) => {
      const { error } = await supabase
        .from('contact_tickets')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const handleStatusChange = (id: number, status: TicketStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AdminLayout title="Tickets de Contact">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {ticket.message}
                </TableCell>
                <TableCell>
                  <Select
                    value={ticket.status}
                    onValueChange={(value: TicketStatus) => handleStatusChange(ticket.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nouveau">Nouveau</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Répondu">Répondu</SelectItem>
                      <SelectItem value="Fermé">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Tickets; 