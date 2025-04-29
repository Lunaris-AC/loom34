import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Pencil } from 'lucide-react';

interface SortableImageProps {
  image: Tables<'gallery_images'>;
  albums: Tables<'gallery_albums'>[];
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableImage({ image, albums, onEdit, onDelete }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square">
        <img
          src={image.image_url}
          alt={image.title || 'Image'}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{image.title || 'Sans titre'}</h3>
        {image.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {image.description}
          </p>
        )}
        {image.album_id && (
          <p className="text-gray-500 text-xs mt-1">
            Album: {albums.find(a => a.id === image.album_id)?.title || 'Inconnu'}
          </p>
        )}
        <div className="mt-1 inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full">
          {image.category}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 