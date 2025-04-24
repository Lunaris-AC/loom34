
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Grid, ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import { AlbumForm } from "@/components/admin/gallery/AlbumForm";
import { ImageForm } from "@/components/admin/gallery/ImageForm";
import { AlbumGrid } from "@/components/admin/gallery/AlbumGrid";
import { ImageGrid } from "@/components/admin/gallery/ImageGrid";
import { DeleteConfirmDialog } from "@/components/admin/gallery/DeleteConfirmDialog";

interface GalleryAlbum extends Tables<'gallery_albums'> {
  image_count?: number;
}

export default function Gallery() {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [isCreatingImage, setIsCreatingImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isImageDeleteDialog, setIsImageDeleteDialog] = useState(false);
  const { user } = useAuth();

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
    queryKey: ['galleryImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
      
      return data;
    },
  });

  const handleCreateAlbum = async (formData: any) => {
    try {
      const { title, description, cover_image, date } = formData;
      
      if (!title) {
        toast.error("Album title is required");
        return;
      }
      
      const { error } = await supabase
        .from('gallery_albums')
        .insert({
          title,
          description: description || null,
          cover_image,
          date,
          author_id: user?.id
        });
        
      if (error) throw error;
      
      toast.success("Album created successfully");
    } catch (error: any) {
      console.error("Error creating album:", error);
      toast.error("Failed to create album: " + error.message);
    }
  };

  const handleUpdateAlbum = async (formData: any) => {
    if (!selectedAlbum) return;
    
    try {
      const { title, description, cover_image, date } = formData;
      
      if (!title) {
        toast.error("Album title is required");
        return;
      }
      
      const { error } = await supabase
        .from('gallery_albums')
        .update({
          title,
          description: description || null,
          cover_image,
          date,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAlbum.id);
        
      if (error) throw error;
      
      toast.success("Album updated successfully");
      setSelectedAlbum(null);
    } catch (error: any) {
      console.error("Error updating album:", error);
      toast.error("Failed to update album: " + error.message);
    }
  };

  const handleCreateImage = async (formData: any) => {
    try {
      const { title, description, image_url, album_id, category } = formData;
      
      if (!title || !image_url) {
        toast.error("Image title and URL are required");
        return;
      }
      
      const { error } = await supabase
        .from('gallery_images')
        .insert({
          title,
          description: description || null,
          image_url,
          album_id: album_id || null,
          category,
          author_id: user?.id
        });
        
      if (error) throw error;
      
      toast.success("Image added successfully");
    } catch (error: any) {
      console.error("Error creating image:", error);
      toast.error("Failed to add image: " + error.message);
    }
  };

  const handleUpdateImage = async (formData: any) => {
    if (!selectedImage) return;
    
    try {
      const { title, description, image_url, album_id, category } = formData;
      
      if (!title || !image_url) {
        toast.error("Image title and URL are required");
        return;
      }
      
      const { error } = await supabase
        .from('gallery_images')
        .update({
          title,
          description: description || null,
          image_url,
          album_id: album_id || null,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedImage.id);
        
      if (error) throw error;
      
      toast.success("Image updated successfully");
      setSelectedImage(null);
    } catch (error: any) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image: " + error.message);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!selectedAlbum) return;
    
    try {
      // First, delete any images associated with this album
      const { error: imagesError } = await supabase
        .from('gallery_images')
        .update({ album_id: null })
        .eq('album_id', selectedAlbum.id);
      
      if (imagesError) throw imagesError;
      
      // Then delete the album
      const { error } = await supabase
        .from('gallery_albums')
        .delete()
        .eq('id', selectedAlbum.id);
        
      if (error) throw error;
      
      toast.success("Album deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedAlbum(null);
    } catch (error: any) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album: " + error.message);
    }
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', selectedImage.id);
        
      if (error) throw error;
      
      toast.success("Image deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedImage(null);
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image: " + error.message);
    }
  };

  const confirmDeleteAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setIsImageDeleteDialog(false);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteImage = (image: Tables<'gallery_images'>) => {
    setSelectedImage(image);
    setIsImageDeleteDialog(true);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Gallery">
      <div className="space-y-8">
        {/* Albums Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Manage Albums</h2>
              <p className="text-gray-500 mt-1">Create and organize photo albums</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-brown hover:bg-brown/90"
                  onClick={() => {
                    setIsCreatingAlbum(true);
                    setSelectedAlbum(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AlbumForm
                  isCreating={isCreatingAlbum}
                  defaultValues={selectedAlbum ?? undefined}
                  onSubmit={isCreatingAlbum ? handleCreateAlbum : handleUpdateAlbum}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          {isLoadingAlbums ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <Grid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No albums found</h3>
              <p className="text-gray-500 mb-4">Create your first album to organize your gallery images</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-brown hover:bg-brown/90"
                    onClick={() => {
                      setIsCreatingAlbum(true);
                      setSelectedAlbum(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first album
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AlbumForm
                    isCreating={true}
                    onSubmit={handleCreateAlbum}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <AlbumGrid
              albums={albums}
              onEdit={(album) => {
                setSelectedAlbum(album);
                setIsCreatingAlbum(false);
              }}
              onDelete={confirmDeleteAlbum}
            />
          )}
        </section>

        {/* Images Section */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Manage Images</h2>
              <p className="text-gray-500 mt-1">Add and organize images in your gallery</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-brown hover:bg-brown/90"
                  onClick={() => {
                    setIsCreatingImage(true);
                    setSelectedImage(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ImageForm
                  albums={albums}
                  isCreating={isCreatingImage}
                  defaultValues={selectedImage ?? undefined}
                  onSubmit={isCreatingImage ? handleCreateImage : handleUpdateImage}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          {isLoadingImages ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No images found</h3>
              <p className="text-gray-500 mb-4">Add your first image to the gallery</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-brown hover:bg-brown/90"
                    onClick={() => {
                      setIsCreatingImage(true);
                      setSelectedImage(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ImageForm
                    albums={albums}
                    isCreating={true}
                    onSubmit={handleCreateImage}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <ImageGrid
              images={images}
              albums={albums}
              onEdit={(image) => {
                setSelectedImage(image);
                setIsCreatingImage(false);
              }}
              onDelete={confirmDeleteImage}
            />
          )}
        </section>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={isImageDeleteDialog ? handleDeleteImage : handleDeleteAlbum}
        title={isImageDeleteDialog ? "image" : "album"}
        itemName={isImageDeleteDialog ? selectedImage?.title ?? "" : selectedAlbum?.title ?? ""}
      />
    </AdminLayout>
  );
}
