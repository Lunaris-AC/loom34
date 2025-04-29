import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  published: boolean;
  slug: string;
  description: string;
  image: string;
  registration_url: string | null;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { user } = useAuth();
  
  // Form state for new/edit event
  const [eventForm, setEventForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    image: "https://placehold.co/600x400?text=Event+Image",
    published: false,
    slug: "",
    registration_url: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, location, date, time, published, slug, description, image, registration_url')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
    
    // Auto-generate slug from title
    if (name === "title") {
      setEventForm(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setEventForm({ ...eventForm, published: checked });
  };

  const resetForm = () => {
    setEventForm({
      title: "",
      location: "",
      date: "",
      time: "",
      description: "",
      image: "https://placehold.co/600x400?text=Event+Image",
      published: false,
      slug: "",
      registration_url: ""
    });
    setIsCreating(true);
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleCreateEvent = async () => {
    try {
      const { title, location, date, time, description, image, published, slug, registration_url } = eventForm;
      
      if (!title || !location || !date || !time || !description || !slug) {
        toast.error("Please fill all required fields");
        return;
      }
      
      const newEvent = {
        title,
        location,
        date,
        time,
        description,
        image,
        published,
        slug,
        registration_url: registration_url || null,
        author_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Event created successfully");
      fetchEvents();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event: " + error.message);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { title, location, date, time, description, image, published, slug, registration_url } = eventForm;
      
      if (!title || !location || !date || !time || !description || !slug) {
        toast.error("Please fill all required fields");
        return;
      }
      
      const updatedEvent = {
        title,
        location,
        date,
        time,
        description,
        image,
        published,
        slug,
        registration_url: registration_url || null,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', selectedEvent.id);
        
      if (error) throw error;
      
      toast.success("Event updated successfully");
      fetchEvents();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event: " + error.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id);
        
      if (error) throw error;
      
      toast.success("Event deleted successfully");
      fetchEvents();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event: " + error.message);
    }
  };

  const editEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      location: event.location,
      date: event.date,
      time: event.time,
      description: event.description,
      image: event.image,
      published: event.published,
      slug: event.slug,
      registration_url: event.registration_url || ""
    });
    setIsCreating(false);
    setDialogOpen(true);
  };

  const confirmDelete = (event: Event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Événements">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des événements</h2>
          <p className="text-gray-500 mt-1">Créez, modifiez et gérez vos événements</p>
        </div>
        <Button 
          className="bg-brown hover:bg-brown/90" 
          onClick={resetForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      <Separator className="my-4" />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun événement trouvé</h3>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'événements.</p>
          <Button 
            className="bg-brown hover:bg-brown/90" 
            onClick={resetForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier événement
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {event.published ? "Publié" : "Brouillon"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/events/${event.slug}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => editEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => confirmDelete(event)}
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

      {/* Event Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create New Event" : "Edit Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={eventForm.slug}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="event-slug"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventForm.location}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event location"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input
                id="date"
                name="date"
                value={eventForm.date}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event date (YYYY-MM-DD)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <Input
                id="time"
                name="time"
                value={eventForm.time}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event time (e.g. 7:00 PM)"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event description"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={eventForm.image}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="URL to event image"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registration_url" className="text-right">Registration URL</Label>
              <Input
                id="registration_url"
                name="registration_url"
                value={eventForm.registration_url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Event registration URL (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="published" className="text-right">Published</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={eventForm.published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="published">
                  {eventForm.published ? "Published" : "Draft"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={isCreating ? handleCreateEvent : handleUpdateEvent}>
              {isCreating ? "Create Event" : "Update Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
