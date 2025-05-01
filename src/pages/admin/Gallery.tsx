import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ImageIcon, FolderOpen, GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer les paramètres depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const albumIdFromUrl = urlParams.get('albumId');
  const showUnclassified = urlParams.get('view') === 'unclassified';

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

  // Trouver l'album sélectionné à partir de l'URL
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(
    albums.find(album => album.id === albumIdFromUrl) || null
  );

  // Mettre à jour selectedAlbum quand les albums changent
  useEffect(() => {
    if (albumIdFromUrl) {
      const album = albums.find(album => album.id === albumIdFromUrl);
      if (album) {
        setSelectedAlbum(album);
      }
    } else {
      setSelectedAlbum(null);
    }
  }, [albums, albumIdFromUrl]);

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
    enabled: !!selectedAlbum || showUnclassified,
    refetchInterval: 1000,
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
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création de l'album: " + error.message);
    }
  });

  const updateAlbumMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; description?: string }) => {
      const { error } = await supabase
        .from('gallery_albums')
        .update({
          title: data.title,
          description: data.description
        })
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setNewAlbumName("");
      toast.success("Album modifié avec succès");
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la modification de l'album: " + error.message);
    }
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      // D'abord, mettre à jour toutes les images de l'album pour les mettre en non classées
      const { error: updateError } = await supabase
        .from('gallery_images')
        .update({ album_id: null })
        .eq('album_id', albumId);
        
      if (updateError) throw updateError;

      // Ensuite, supprimer l'album
      const { error: deleteError } = await supabase
        .from('gallery_albums')
        .delete()
        .eq('id', albumId);
        
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setSelectedAlbum(null);
      toast.success("Album supprimé avec succès");
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression de l'album: " + error.message);
    }
  });

  const updateImageMutation = useMutation({
    mutationFn: async (data: { id: string; title?: string; description?: string; album_id?: string | null }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({
          title: data.title,
          description: data.description,
          album_id: data.album_id
        })
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast.success("Photo modifiée avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la modification de la photo: " + error.message);
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Photo supprimée avec succès");
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression de la photo: " + error.message);
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
      toast.success("Image déplacée avec succès");
      window.location.reload();
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

  const handleAlbumClick = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    // Mettre à jour l'URL avec l'ID de l'album
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('albumId', album.id);
    newUrl.searchParams.delete('view'); // Supprimer le paramètre view s'il existe
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  };

  const handleUnclassifiedClick = () => {
    setSelectedAlbum(null);
    // Mettre à jour l'URL pour les photos non classées
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('albumId');
    newUrl.searchParams.set('view', 'unclassified');
    window.history.pushState({}, '', newUrl);
    window.location.reload();
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
              onClick={handleUnclassifiedClick}
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
              <div key={album.id} className="flex items-center gap-1">
                <Button 
                  variant={selectedAlbum?.id === album.id ? "default" : "ghost"}
                  className="flex-1 justify-start"
                  onClick={() => handleAlbumClick(album)}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="space-y-4">
                      <Label>Nom de l'album</Label>
                      <Input
                        defaultValue={album.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setNewAlbumName(newTitle);
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              if (newAlbumName.trim()) {
                                updateAlbumMutation.mutate({
                                  id: album.id,
                                  title: newAlbumName,
                                  description: album.description
                                });
                              }
                            }}
                          >
                            Enregistrer
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ? Les photos seront déplacées dans la section non classée.")) {
                      deleteAlbumMutation.mutate(album.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="space-y-4">
                            <Label>Nom de la photo</Label>
                            <Input
                              defaultValue={image.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setNewAlbumName(newTitle);
                              }}
                            />
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    if (newAlbumName.trim()) {
                                      updateImageMutation.mutate({
                                        id: image.id,
                                        title: newAlbumName,
                                        description: image.description
                                      });
                                    }
                                  }}
                                >
                                  Enregistrer
                                </Button>
                              </DialogClose>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
                            deleteImageMutation.mutate(image.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <GripVertical className="w-6 h-6 text-white" />
                    </div>
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
