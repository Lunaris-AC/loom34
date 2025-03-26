
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Grid } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  cover_image: string;
  date: string;
}

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  album_id: string | null;
  category: string;
}

export default function AdminGallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isImageDeleteDialog, setIsImageDeleteDialog] = useState(false);
  const { user } = useAuth();
  
  // Form state for new/edit album
  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    cover_image: "https://placehold.co/600x400?text=Album+Cover",
    date: new Date().toISOString().split('T')[0]
  });
  
  // Form state for new/edit image
  const [imageForm, setImageForm] = useState({
    title: "",
    description: "",
    image_url: "https://placehold.co/600x400?text=Gallery+Image",
    album_id: "",
    category: "general"
  });

  useEffect(() => {
    fetchAlbums();
    fetchImages();
  }, []);

  async function fetchAlbums() {
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error: any) {
      console.error("Error fetching albums:", error);
      toast.error("Failed to load albums: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchImages() {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error("Error fetching images:", error);
    }
  }

  const resetAlbumForm = () => {
    setAlbumForm({
      title: "",
      description: "",
      cover_image: "https://placehold.co/600x400?text=Album+Cover",
      date: new Date().toISOString().split('T')[0]
    });
    setIsCreatingAlbum(true);
    setSelectedAlbum(null);
  };
  
  const resetImageForm = () => {
    setImageForm({
      title: "",
      description: "",
      image_url: "https://placehold.co/600x400?text=Gallery+Image",
      album_id: albums.length > 0 ? albums[0].id : "",
      category: "general"
    });
    setIsCreatingImage(true);
    setSelectedImage(null);
  };

  const handleAlbumInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlbumForm({ ...albumForm, [name]: value });
  };
  
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setImageForm({ ...imageForm, [name]: value });
  };

  const handleCreateAlbum = async () => {
    try {
      const { title, description, cover_image, date } = albumForm;
      
      if (!title) {
        toast.error("Album title is required");
        return;
      }
      
      const newAlbum = {
        title,
        description: description || null,
        cover_image,
        date,
        author_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('gallery_albums')
        .insert(newAlbum)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Album created successfully");
      fetchAlbums();
      resetAlbumForm();
    } catch (error: any) {
      console.error("Error creating album:", error);
      toast.error("Failed to create album: " + error.message);
    }
  };
  
  const handleCreateImage = async () => {
    try {
      const { title, description, image_url, album_id, category } = imageForm;
      
      if (!title || !image_url) {
        toast.error("Image title and URL are required");
        return;
      }
      
      const newImage = {
        title,
        description: description || null,
        image_url,
        album_id: album_id || null,
        category,
        author_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('gallery_images')
        .insert(newImage)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Image added successfully");
      fetchImages();
      resetImageForm();
    } catch (error: any) {
      console.error("Error creating image:", error);
      toast.error("Failed to add image: " + error.message);
    }
  };

  const handleUpdateAlbum = async () => {
    if (!selectedAlbum) return;
    
    try {
      const { title, description, cover_image, date } = albumForm;
      
      if (!title) {
        toast.error("Album title is required");
        return;
      }
      
      const updatedAlbum = {
        title,
        description: description || null,
        cover_image,
        date,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('gallery_albums')
        .update(updatedAlbum)
        .eq('id', selectedAlbum.id);
        
      if (error) throw error;
      
      toast.success("Album updated successfully");
      fetchAlbums();
      resetAlbumForm();
    } catch (error: any) {
      console.error("Error updating album:", error);
      toast.error("Failed to update album: " + error.message);
    }
  };
  
  const handleUpdateImage = async () => {
    if (!selectedImage) return;
    
    try {
      const { title, description, image_url, album_id, category } = imageForm;
      
      if (!title || !image_url) {
        toast.error("Image title and URL are required");
        return;
      }
      
      const updatedImage = {
        title,
        description: description || null,
        image_url,
        album_id: album_id || null,
        category,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('gallery_images')
        .update(updatedImage)
        .eq('id', selectedImage.id);
        
      if (error) throw error;
      
      toast.success("Image updated successfully");
      fetchImages();
      resetImageForm();
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
      fetchAlbums();
      fetchImages();
      setDeleteDialogOpen(false);
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
      fetchImages();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image: " + error.message);
    }
  };

  const editAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setAlbumForm({
      title: album.title,
      description: album.description || "",
      cover_image: album.cover_image,
      date: album.date
    });
    setIsCreatingAlbum(false);
  };
  
  const editImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageForm({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      album_id: image.album_id || "",
      category: image.category
    });
    setIsCreatingImage(false);
  };

  const confirmDeleteAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setIsImageDeleteDialog(false);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteImage = (image: GalleryImage) => {
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
                <Button className="bg-brown hover:bg-brown/90" onClick={resetAlbumForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isCreatingAlbum ? "Create New Album" : "Edit Album"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={albumForm.title}
                      onChange={handleAlbumInputChange}
                      className="col-span-3"
                      placeholder="Album title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={albumForm.description}
                      onChange={handleAlbumInputChange}
                      className="col-span-3"
                      placeholder="Album description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cover_image" className="text-right">Cover Image URL</Label>
                    <Input
                      id="cover_image"
                      name="cover_image"
                      value={albumForm.cover_image}
                      onChange={handleAlbumInputChange}
                      className="col-span-3"
                      placeholder="URL to album cover image"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={albumForm.date}
                      onChange={handleAlbumInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={isCreatingAlbum ? handleCreateAlbum : handleUpdateAlbum}>
                      {isCreatingAlbum ? "Create Album" : "Update Album"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          {loading ? (
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
                  <Button className="bg-brown hover:bg-brown/90" onClick={resetAlbumForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first album
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
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
                      <Button size="sm" variant="secondary" onClick={() => editAlbum(album)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDeleteAlbum(album)}>
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
                <Button className="bg-brown hover:bg-brown/90" onClick={resetImageForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isCreatingImage ? "Add New Image" : "Edit Image"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image_title" className="text-right">Title</Label>
                    <Input
                      id="image_title"
                      name="title"
                      value={imageForm.title}
                      onChange={handleImageInputChange}
                      className="col-span-3"
                      placeholder="Image title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="image_description" className="text-right pt-2">Description</Label>
                    <Textarea
                      id="image_description"
                      name="description"
                      value={imageForm.description}
                      onChange={handleImageInputChange}
                      className="col-span-3"
                      placeholder="Image description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image_url" className="text-right">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={imageForm.image_url}
                      onChange={handleImageInputChange}
                      className="col-span-3"
                      placeholder="URL to image"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="album_id" className="text-right">Album</Label>
                    <select
                      id="album_id"
                      name="album_id"
                      value={imageForm.album_id}
                      onChange={handleImageInputChange}
                      className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">No Album</option>
                      {albums.map(album => (
                        <option key={album.id} value={album.id}>{album.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={imageForm.category}
                      onChange={handleImageInputChange}
                      className="col-span-3"
                      placeholder="Image category"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={isCreatingImage ? handleCreateImage : handleUpdateImage}>
                      {isCreatingImage ? "Add Image" : "Update Image"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          {loading ? (
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
                  <Button className="bg-brown hover:bg-brown/90" onClick={resetImageForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
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
                      <Button size="sm" variant="secondary" onClick={() => editImage(image)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDeleteImage(image)}>
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
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          {isImageDeleteDialog ? (
            <p>Are you sure you want to delete the image "{selectedImage?.title}"? This action cannot be undone.</p>
          ) : (
            <p>Are you sure you want to delete the album "{selectedAlbum?.title}"? This action cannot be undone.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={isImageDeleteDialog ? handleDeleteImage : handleDeleteAlbum}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
