
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ImageGridProps {
  images: Tables<'gallery_images'>[];
  albums: Tables<'gallery_albums'>[];
  onEdit: (image: Tables<'gallery_images'>) => void;
  onDelete: (image: Tables<'gallery_images'>) => void;
}

export function ImageGrid({ images, albums, onEdit, onDelete }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="relative h-40">
            <img 
              src={image.image_url} 
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button size="sm" variant="secondary" onClick={() => onEdit(image)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(image)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm truncate">{image.title}</h3>
            {image.album_id && (
              <p className="text-gray-500 text-xs mt-1">
                Album: {albums.find(a => a.id === image.album_id)?.title || 'Unknown'}
              </p>
            )}
            <div className="mt-1 inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full">
              {image.category}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
