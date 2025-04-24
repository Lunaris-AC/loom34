
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface AlbumGridProps {
  albums: Tables<'gallery_albums'>[];
  onEdit: (album: Tables<'gallery_albums'>) => void;
  onDelete: (album: Tables<'gallery_albums'>) => void;
}

export function AlbumGrid({ albums, onEdit, onDelete }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <Card key={album.id} className="overflow-hidden">
          <div className="relative h-48">
            <img 
              src={album.cover_image} 
              alt={album.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button size="sm" variant="secondary" onClick={() => onEdit(album)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(album)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{album.title}</h3>
            {album.description && <p className="text-gray-500 text-sm mt-1">{album.description}</p>}
            <p className="text-gray-400 text-xs mt-2">{album.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
