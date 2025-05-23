import { useState, useEffect, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from '@/db/client';
import { Plus, ImageIcon, FolderOpen, GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/db/types";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from "framer-motion";
import DragDropGallery from "@/components/admin/gallery/DragDropGallery";
import { FixedSizeGrid as Grid } from 'react-window';
import { GalleryUploadProgress } from "@/components/admin/gallery/GalleryUploadProgress";

type GalleryAlbum = Tables<'gallery_albums'>;
type GalleryImage = {
  id: string;
  image_url: string;
  title: string;
  description: string;
  album_id: string | null;
  created_at: string;
  updated_at: string;
};

interface DraggedImage {
  id: string;
  albumId: string | null;
}

export default function Gallery() {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploadProgressOpen, setUploadProgressOpen] = useState(false);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  // Récupérer les paramètres depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const albumIdFromUrl = urlParams.get('albumId');
  const showUnclassified = urlParams.get('view') === 'unclassified';

  // Fetch albums from database
  const { data: albums = [], isLoading: isLoadingAlbums, refetch } = useQuery<GalleryAlbum[]>({
    queryKey: ['galleryAlbums'],
    queryFn: async () => {
      const { data, error } = await db
        .from('gallery_albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch all images for sidebar counters
  const { data: allImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ['galleryImages', 'all'],
    queryFn: async () => {
      const { data, error } = await db
        .from('gallery_images')
        .select('id, image_url, title, description, album_id, created_at, updated_at');
      if (error) throw error;
      return data || [];
    },
  });

  // Trouver l'album sélectionné à partir de l'URL
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

  // Mettre à jour selectedAlbum quand les albums ou l'URL changent
  useEffect(() => {
    if (albumIdFromUrl && albums.length > 0) {
      const album = albums.find(album => album.id === albumIdFromUrl);
      setSelectedAlbum(album || null);
    } else {
      setSelectedAlbum(null);
    }
  }, [albums, albumIdFromUrl]);

  // Fetch images
  const { data: images = [], isLoading: isLoadingImages, error: imagesError } = useQuery<GalleryImage[]>({
    queryKey: ['galleryImages', selectedAlbum?.id, showUnclassified],
    queryFn: async () => {
      let query = db
        .from('gallery_images')
        .select('id, image_url, title, description, album_id, created_at, updated_at');

      // Afficher toutes les images si aucun album ni unclassified n'est sélectionné
      if (showUnclassified) {
        query = query.is('album_id', null);
      } else if (selectedAlbum) {
        query = query.eq('album_id', String(selectedAlbum.id));
      } // sinon, ne filtre pas : toutes les images

      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: true, // Toujours activer la requête
  });

  if (imagesError) {
    return (
      <AdminLayout title="Galerie">
        <div className="text-red-600 font-bold p-8">Erreur lors du chargement des images : {imagesError.message}</div>
      </AdminLayout>
    );
  }

  const createAlbumMutation = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await db
        .from('gallery_albums')
        .insert({
          title,
          description: '',
          cover_image: '',
          date: new Date().toISOString()
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      setNewAlbumName("");
      setIsCreatingAlbum(false);
      toast({
        title: "Album créé",
        description: "L'album a été créé avec succès.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'album: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateAlbumMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; description?: string }) => {
      const { error } = await db
        .from('gallery_albums')
        .update({
          title: data.title,
          description: data.description
        })
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      setNewAlbumName("");
      toast({
        title: "Album modifié",
        description: "L'album a été modifié avec succès.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'album: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      // D'abord, mettre à jour toutes les images de l'album pour les mettre en non classées
      const { error: updateError } = await db
        .from('gallery_images')
        .update({ album_id: null })
        .eq('album_id', albumId);
        
      if (updateError) throw updateError;

      // Ensuite, supprimer l'album
      const { error: deleteError } = await db
        .from('gallery_albums')
        .delete()
        .eq('id', albumId);
        
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      setSelectedAlbum(null);
      toast({
        title: "Album supprimé",
        description: "L'album a été supprimé avec succès.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'album: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateImageMutation = useMutation({
    mutationFn: async (data: { id: string; title?: string; description?: string; album_id?: string | null }) => {
      const { error } = await db
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
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      toast({
        title: "Photo modifiée",
        description: "La photo a été modifiée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la photo: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await db
        .from('gallery_images')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la photo: " + error.message,
        variant: "destructive",
      });
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
        const { data: uploadData, error: uploadError } = await db.storage
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
        const { data: { publicUrl } } = db.storage
          .from('images')
          .getPublicUrl(filePath);

        // Créer l'enregistrement dans la base de données
        const { error: insertError } = await db
          .from('gallery_images')
          .insert({
            image_url: publicUrl,
            album_id: albumId,
            title: file.name,
            description: '',
            category: '' // Ajout d'une valeur par défaut pour la colonne obligatoire
          });

        if (insertError) {
          // Si l'insertion échoue, supprimer le fichier uploadé
          await db.storage
            .from('images')
            .remove([filePath]);
          throw insertError;
        }

        // Si l'image est ajoutée à un album, mettre à jour la couverture de l'album
        if (albumId) {
          const { error: updateError } = await db
            .from('gallery_albums')
            .update({ cover_image: publicUrl })
            .eq('id', albumId);

          if (updateError) {
            console.error('Erreur mise à jour couverture:', updateError);
          }
        }
      } catch (error: any) {
        console.error('Erreur complète:', error);
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      toast({
        title: "Photo uploadée",
        description: "La photo a été uploadée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload de la photo: " + error.message,
        variant: "destructive",
      });
    }
  });

  const moveImageMutation = useMutation({
    mutationFn: async ({ imageId, newAlbumId }: { imageId: string, newAlbumId: string | null }) => {
      const { error } = await db
        .from('gallery_images')
        .update({ album_id: newAlbumId })
        .eq('id', imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['galleryAlbums'] });
      toast({
        title: "Image déplacée",
        description: "Image déplacée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] }); // Rafraîchit seulement les images
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Erreur lors du déplacement de l'image: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Upload asynchrone avec 8 concurrents
  async function uploadFilesAsync(files: File[], albumId: string | null) {
    setUploadProgressOpen(true);
    setUploadCurrent(0);
    setUploadTotal(files.length);
    setUploadPercent(0);
    setUploadErrors([]);
    let completed = 0;
    let errors: string[] = [];
    const concurrency = 8;
    let index = 0;
    async function next() {
      if (index >= files.length) return;
      const file = files[index++];
      let uploadFile = file;
      // Plus de conversion HEIC/HEIF : on accepte le fichier tel quel
      try {
        await uploadImageMutation.mutateAsync({ file: uploadFile, albumId });
      } catch (err: any) {
        errors.push(`Erreur upload ${file.name}: ${err?.message || err}`);
        setUploadErrors([...errors]);
      }
      setUploadCurrent(++completed);
      setUploadPercent(Math.round((completed / files.length) * 100));
      if (completed === files.length) {
        setTimeout(() => setUploadProgressOpen(false), 1200);
      }
      return next();
    }
    // Lancer 8 uploads en parallèle
    await Promise.all(Array(Math.min(concurrency, files.length)).fill(0).map(next));
  }

  // Nouveau handleFileInput
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await uploadFilesAsync(files, selectedAlbum?.id || null);
  };

  // Nouveau handleFileDrop
  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    await uploadFilesAsync(files, selectedAlbum?.id || null);
  };

  const handleImageDragStart = (e: React.DragEvent<HTMLDivElement>, image: GalleryImage) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: image.id,
      albumId: image.album_id
    }));
  };

  const handleAlbumClick = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setSelectedImage(null);
    window.history.pushState({}, '', `?albumId=${album.id}`);
  };

  const handleUnclassifiedClick = () => {
    setSelectedAlbum(null);
    setSelectedImage(null);
    window.history.pushState({}, '', '?view=unclassified');
  };

  const GalleryImageCell = memo(({ columnIndex, rowIndex, style, data }: any) => {
    const { images, columns, handleImageDragStart, updateImageMutation, deleteImageMutation, setSelectedImage, setNewAlbumName, Dialog, DialogTrigger, Button, Edit, DialogContent, Label, Input, DialogClose, Trash2 } = data;
    const index = rowIndex * columns + columnIndex;
    if (index >= images.length) return null;
    const image = images[index];
    // Utilise uniquement image_url (pas de thumbnail_url)
    const imgSrc = image.image_url;
    return (
      <div style={style} className="relative group aspect-square cursor-move rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow" draggable onDragStart={(e) => handleImageDragStart(e, image)}>
        <img
          src={imgSrc}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            console.error('Error loading image:', imgSrc);
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+non+disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="w-full">
            <p className="text-white text-sm font-medium truncate mb-2">{image.title}</p>
            <div className="flex justify-end gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-white bg-white/20 hover:bg-white/30"
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
                        setNewAlbumName(e.target.value);
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => {
                            if (image.title.trim()) {
                              updateImageMutation.mutate({
                                id: image.id,
                                title: image.title,
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
                className="bg-red-500/20 hover:bg-red-500/30 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
                    deleteImageMutation.mutate(image.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  });

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
      {/* Popup de progression d'upload */}
      <GalleryUploadProgress
        open={uploadProgressOpen}
        current={uploadCurrent}
        total={uploadTotal}
        percent={uploadPercent}
        errors={uploadErrors}
        onClose={() => setUploadProgressOpen(false)}
      />
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-72 border-r p-4 space-y-4 bg-gray-50">
          <Dialog open={isCreatingAlbum} onOpenChange={setIsCreatingAlbum}>
            <DialogTrigger asChild>
              <Button variant="brown" className="w-full">
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
                  variant="brown"
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
              className="w-full justify-start relative hover:bg-gray-100 transition-colors"
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

            {albums.map(album => {
              // Utilise allImages pour le compteur
              const imageCount = Array.isArray(allImages) ? allImages.filter(img => img.album_id === album.id).length : 0;
              return (
                <motion.div 
                  key={album.id} 
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant={selectedAlbum?.id === album.id ? "default" : "ghost"}
                    className="flex-1 justify-start group relative overflow-hidden"
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
                    <div className="relative z-10 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      <span className="truncate block max-w-[110px]" title={album.title}>{album.title}</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">{imageCount}</span>
                    </div>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
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
                            setNewAlbumName(e.target.value);
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
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 bg-white">
          <div
            className="min-h-[200px] border-2 border-dashed rounded-lg p-8 mb-6 bg-gray-50 hover:bg-gray-100 transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-gray-100');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-gray-100');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-gray-100');
              handleFileDrop(e);
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-4">
                  Glissez-déposez vos images ici
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileInput}
                />
                <Button
                  variant="outline"
                  className="mt-2 hover:bg-gray-100"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Ou sélectionnez des fichiers
                  <span className="block text-xs text-gray-400 mt-1">(Formats supportés : jpg, png, webp, heic, heif...)</span>
                </Button>
              </div>
            </div>
          </div>

          {Array.isArray(images) && images.length > 0 && (
            <div style={{ width: '100%', height: 800 }}>
              <Grid
                columnCount={4}
                columnWidth={240}
                height={800}
                rowCount={Math.ceil((Array.isArray(images) ? images.length : 0) / 4)}
                rowHeight={260}
                width={1000}
                itemData={{
                  images: Array.isArray(images) ? images : [],
                  columns: 4,
                  handleImageDragStart,
                  updateImageMutation,
                  deleteImageMutation,
                  setSelectedImage,
                  setNewAlbumName,
                  Dialog,
                  DialogTrigger,
                  Button,
                  Edit,
                  DialogContent,
                  Label,
                  Input,
                  DialogClose,
                  Trash2
                }}
              >
                {GalleryImageCell}
              </Grid>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
