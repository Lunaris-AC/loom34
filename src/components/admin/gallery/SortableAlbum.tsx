import { useState } from 'react';
import { db } from '@/db/client';
import { Tables } from '@/db/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUpload from '@/components/admin/ImageUpload';
import SortableImage from './SortableImage';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from 'uuid';

type GalleryAlbum = Tables<'gallery_albums'>;
type GalleryImage = Tables<'gallery_images'>;

interface SortableAlbumProps {
  album: GalleryAlbum;
  images: GalleryImage[];
  onImageUpload: (file: File) => void;
  onReorder: (imageId: string, newOrder: number) => void;
}

export default function SortableAlbum({ album, images, onImageUpload, onReorder }: SortableAlbumProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: album.title,
    description: album.description || ''
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await db
        .from('gallery_albums')
        .update({
          title: formData.title,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', album.id);

      if (error) throw error;

      toast.success('Album mis à jour avec succès');
    } catch (error) {
      console.error('Error updating album:', error);
      toast.error('Erreur lors de la mise à jour de l\'album');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) return;
    setLoading(true);

    try {
      // D'abord, supprimer toutes les images de l'album
      const { error: deleteImagesError } = await db
        .from('gallery_images')
        .delete()
        .eq('album_id', album.id);

      if (deleteImagesError) throw deleteImagesError;

      // Ensuite, supprimer l'album
      const { error: deleteAlbumError } = await db
        .from('gallery_albums')
        .delete()
        .eq('id', album.id);

      if (deleteAlbumError) throw deleteAlbumError;

      toast.success('Album supprimé avec succès');
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('Erreur lors de la suppression de l\'album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative group"
      {...attributes}
      {...listeners}
    >
      <CardHeader>
        <CardTitle>{album.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label>Images</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <SortableImage
                key={image.id}
                image={image}
                onReorder={(newOrder) => onReorder(image.id, newOrder)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 