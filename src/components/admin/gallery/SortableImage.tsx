import { useState } from 'react';
import { db } from '@/db/client';
import { Tables } from '@/db/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type GalleryImage = Tables<'gallery_images'>;

interface SortableImageProps {
  image: GalleryImage;
  onReorder: (newOrder: number) => void;
}

export default function SortableImage({ image, onReorder }: SortableImageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: image.title || '',
    description: image.description || ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await db
        .from('gallery_images')
        .update({
          title: formData.title,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', image.id);

      if (error) throw error;

      toast.success('Image mise à jour avec succès');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Erreur lors de la mise à jour de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    setLoading(true);

    try {
      const { error } = await db
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast.success('Image supprimée avec succès');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <img
          src={image.image_url}
          alt={image.title || 'Image'}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
  );
} 