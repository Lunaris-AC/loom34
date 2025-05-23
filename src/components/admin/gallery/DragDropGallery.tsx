import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, ImageIcon, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlbumForm } from './AlbumForm';
import { ImageForm } from './ImageForm';
import SortableAlbum from './SortableAlbum';
import { SortableImage } from './SortableImage';
import { Tables } from '@/db/types';
import { toast } from 'sonner';
import { db } from '@/db/client';
import ImageUpload from '@/components/admin/ImageUpload';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type GalleryAlbum = Tables<'gallery_albums'>;
type GalleryImage = Tables<'gallery_images'>;

interface DragDropGalleryProps {
  onSuccess: () => void;
}

export default function DragDropGallery({ onSuccess }: DragDropGalleryProps) {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await db
        .from('gallery_albums')
        .insert({
          id: uuidv4(),
          title: formData.title,
          description: formData.description,
          date: formData.date,
          cover_image: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Album créé avec succès');
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating album:', error);
      toast.error('Erreur lors de la création de l\'album');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (albumId: string, file: File) => {
    try {
      const filePath = `${albumId}/${file.name}`;
      const { error: uploadError } = await db.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = db.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: insertError } = await db
        .from('gallery_images')
        .insert({
          id: uuidv4(),
          album_id: albumId,
          image_url: publicUrl,
          title: file.name,
          description: '',
          order: images.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      toast.success('Image uploadée avec succès');
      onSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    }
  };

  const handleReorderImages = async (albumId: string, imageId: string, newOrder: number) => {
    try {
      const { error } = await db
        .from('gallery_images')
        .update({ order: newOrder })
        .eq('id', imageId);

      if (error) throw error;

      toast.success('Ordre des images mis à jour');
      onSuccess();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast.error('Erreur lors de la mise à jour de l\'ordre des images');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreateAlbum} className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer l\'album'}
        </Button>
      </form>

      <div className="space-y-4">
        {albums.map((album) => (
          <SortableAlbum
            key={album.id}
            album={album}
            images={images.filter(img => img.album_id === album.id)}
            onImageUpload={(file) => handleImageUpload(album.id, file)}
            onReorder={(imageId, newOrder) => handleReorderImages(album.id, imageId, newOrder)}
          />
        ))}
      </div>
    </div>
  );
} 