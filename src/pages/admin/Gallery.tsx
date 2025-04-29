import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ImageIcon, FolderOpen, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryAlbum extends Tables<'gallery_albums'> {
  image_count?: number;
}

interface DraggedImage {
  id: string;
  albumId: string | null;
}

export default function Gallery() {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [showUnclassified, setShowUnclassified] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch albums from database
  const { data: albums = [], isLoading: isLoadingAlbums } = useQuery({
    queryKey: ['galleryAlbums'],
    queryFn: async () => {
      const { data: albumsData, error: albumsError } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (albumsError) {
        console.error('Error fetching albums:', albumsError);
        throw albumsError;
      }

      // For each album, get the count of images
      const albumsWithCount: GalleryAlbum[] = await Promise.all(
        (albumsData || []).map(async (album) => {
          const { count, error: countError } = await supabase
            .from('gallery_images')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);

          if (countError) {
            console.error('Error fetching image count:', countError);
          }

          return {
            ...album,
            image_count: count || 0
          };
        })
      );

      return albumsWithCount;
    },
  });

  // Fetch images
  const { data: images = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['galleryImages', selectedAlbum?.id, showUnclassified],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (showUnclassified) {
        query = query.is('album_id', null);
      } else if (selectedAlbum) {
        query = query.eq('album_id', selectedAlbum.id);
      } else {
        return [];
      }

      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!selectedAlbum || showUnclassified
  });

  const createAlbumMutation = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from('gallery_albums')
        .insert({
          title,
          author_id: user?.id,
          cover_image: '',
          date: new Date().toISOString()
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      setNewAlbumName("");
      setIsCreatingAlbum(false);
      toast.success("Album créé avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création de l'album: " + error.message);
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, albumId }: { file: File; albumId: string | null }) => {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }

      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Le fichier est trop volumineux (max 10MB)");
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error("Le fichier doit être une image");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${albumId || 'unclassified'}/${fileName}`;

      try {
        // Upload vers le stockage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erreur upload:', uploadError);
          throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        // Créer l'enregistrement dans la base de données
        const { data: insertData, error: insertError } = await supabase
          .from('gallery_images')
          .insert({
            title: file.name,
            image_url: publicUrl,
            album_id: albumId,
            author_id: user.id,
            category: 'default'
          })
          .select()
          .single();

        if (insertError) {
          // Si l'insertion échoue, supprimer le fichier uploadé
          await supabase.storage
            .from('images')
            .remove([filePath]);
          throw new Error(`Erreur lors de l'enregistrement: ${insertError.message}`);
        }

        return insertData;
      } catch (error: any) {
        console.error('Erreur dans le processus d\'upload:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast.success("Image ajoutée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'ajout de l'image");
    }
  });

  const moveImageMutation = useMutation({
    mutationFn: async ({ imageId, newAlbumId }: { imageId: string, newAlbumId: string | null }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ album_id: newAlbumId })
        .eq('id', imageId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast.success("Image déplacée avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors du déplacement de l'image: " + error.message);
    }
  });

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');

    // Vérifier si c'est une image existante qui est glissée
    const draggedImageData = e.dataTransfer.getData('application/json');
    if (draggedImageData) {
      try {
        const { id, albumId } = JSON.parse(draggedImageData) as DraggedImage;
        const targetAlbumId = showUnclassified ? null : selectedAlbum?.id;
        
        // Ne rien faire si on déplace vers le même album
        if (albumId === targetAlbumId) return;
        
        await moveImageMutation.mutateAsync({
          imageId: id,
          newAlbumId: targetAlbumId
        });
      } catch (error) {
        console.error('Error moving image:', error);
      }
      return;
    }

    // Sinon, c'est un nouveau fichier
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadImageMutation.mutateAsync({
          file,
          albumId: showUnclassified ? null : selectedAlbum?.id || null
        });
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadImageMutation.mutateAsync({
          file,
          albumId: showUnclassified ? null : selectedAlbum?.id || null
        });
      }
    }
  };

  const handleImageDragStart = (e: React.DragEvent<HTMLDivElement>, image: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: image.id,
      albumId: image.album_id
    }));
  };

  if (isLoadingAlbums) {
    return (
      <AdminLayout title="Galerie">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Galerie">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-4">
          <Dialog open={isCreatingAlbum} onOpenChange={setIsCreatingAlbum}>
              <DialogTrigger asChild>
              <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                Nouvel Album
                </Button>
              </DialogTrigger>
              <DialogContent>
              <div className="space-y-4">
                <Label>Nom de l'album</Label>
                <Input
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="Entrez le nom de l'album"
                />
                <Button
                  onClick={() => createAlbumMutation.mutate(newAlbumName)}
                  disabled={!newAlbumName.trim()}
                >
                  Créer
                </Button>
              </div>
              </DialogContent>
            </Dialog>

          <div className="space-y-2">
                  <Button 
              variant={showUnclassified ? "default" : "ghost"}
              className="w-full justify-start relative"
                    onClick={() => {
                setShowUnclassified(true);
                      setSelectedAlbum(null);
                    }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('bg-gray-100');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bg-gray-100');
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bg-gray-100');
                const draggedImageData = e.dataTransfer.getData('application/json');
                if (draggedImageData) {
                  const { id } = JSON.parse(draggedImageData) as DraggedImage;
                  await moveImageMutation.mutateAsync({
                    imageId: id,
                    newAlbumId: null
                  });
                }
              }}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Photos non classées
            </Button>

            {albums.map(album => (
                <Button 
                key={album.id}
                variant={selectedAlbum?.id === album.id ? "default" : "ghost"}
                className="w-full justify-start relative"
                  onClick={() => {
                  setSelectedAlbum(album);
                  setShowUnclassified(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-gray-100');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-gray-100');
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-gray-100');
                  const draggedImageData = e.dataTransfer.getData('application/json');
                  if (draggedImageData) {
                    const { id } = JSON.parse(draggedImageData) as DraggedImage;
                    await moveImageMutation.mutateAsync({
                      imageId: id,
                      newAlbumId: album.id
                    });
                  }
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {album.title}
                <span className="ml-auto text-sm text-gray-500">
                  {album.image_count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          <div
            className="min-h-[200px] border-2 border-dashed rounded-lg p-4 mb-4"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-gray-50');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-gray-50');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-gray-50');
              handleFileDrop(e);
                  }}
                >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Glissez-déposez vos images ici
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileInput}
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Ou sélectionnez des fichiers
                </Button>
          </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <div 
                  key={image.id} 
                  className="relative group aspect-square cursor-move"
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, image)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Error loading image:', image.image_url);
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+non+disponible';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-6 h-6 text-white" />
                    </div>
                    {showUnclassified && selectedAlbum && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-white"
                        onClick={async () => {
                          await moveImageMutation.mutateAsync({
                            imageId: image.id,
                            newAlbumId: selectedAlbum.id
                          });
                        }}
                      >
                        Ajouter à l'album
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
