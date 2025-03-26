
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, Edit, Trash2, ImageIcon, FolderPlus, 
  ArrowLeft, Upload, X, Check, Calendar, 
  Info, AlbumIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GalleryImage = Tables<'gallery_images'>;
type GalleryAlbum = Tables<'gallery_albums'>;

// Form validation schema for albums
const albumSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  date: z.string().min(2, "Date is required"),
  cover_image: z.string().url("Please enter a valid URL for the cover image")
});

// Form validation schema for images
const imageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  image_url: z.string().url("Please enter a valid URL for the image"),
  album_id: z.string().uuid("Please select an album")
});

export default function AdminGallery() {
  const [view, setView] = useState<'albums' | 'images' | 'albumDetail'>('albums');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Album form
  const albumForm = useForm<z.infer<typeof albumSchema>>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      cover_image: ""
    }
  });

  // Image form
  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image_url: "",
      album_id: ""
    }
  });

  // Fetch albums
  const { data: albums = [], isLoading: loadingAlbums, refetch: refetchAlbums } = useQuery({
    queryKey: ['adminGalleryAlbums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch images with a specific album
  const { data: images = [], isLoading: loadingImages, refetch: refetchImages } = useQuery({
    queryKey: ['adminGalleryImages', view === 'albumDetail' ? selectedAlbum?.id : 'all'],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (view === 'albumDetail' && selectedAlbum) {
        query = query.eq('album_id', selectedAlbum.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: view === 'images' || (view === 'albumDetail' && !!selectedAlbum)
  });

  // Reset the album form when opening the dialog or editing an album
  useEffect(() => {
    if (dialogOpen) {
      if (editingAlbum) {
        albumForm.reset({
          title: editingAlbum.title,
          description: editingAlbum.description || "",
          date: editingAlbum.date,
          cover_image: editingAlbum.cover_image,
        });
      } else {
        albumForm.reset({
          title: "",
          description: "",
          date: new Date().toISOString().split('T')[0],
          cover_image: ""
        });
      }
    }
  }, [dialogOpen, editingAlbum, albumForm]);

  // Reset the image form when opening the dialog or editing an image
  useEffect(() => {
    if (imageDialogOpen) {
      if (editingImage) {
        imageForm.reset({
          title: editingImage.title,
          description: editingImage.description || "",
          category: editingImage.category,
          image_url: editingImage.image_url,
          album_id: editingImage.album_id || ""
        });
      } else {
        imageForm.reset({
          title: "",
          description: "",
          category: view === 'albumDetail' && selectedAlbum ? selectedAlbum.title : "",
          image_url: "",
          album_id: view === 'albumDetail' && selectedAlbum ? selectedAlbum.id : ""
        });
      }
    }
  }, [imageDialogOpen, editingImage, imageForm, view, selectedAlbum]);

  // Handle album form submission
  const handleAlbumSubmit = async (values: z.infer<typeof albumSchema>) => {
    try {
      if (editingAlbum) {
        // Update existing album
        const { error } = await supabase
          .from('gallery_albums')
          .update({
            title: values.title,
            description: values.description,
            date: values.date,
            cover_image: values.cover_image,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAlbum.id);

        if (error) throw error;
        toast({
          title: "Album updated",
          description: "The album has been updated successfully."
        });
      } else {
        // Create new album
        const { error } = await supabase
          .from('gallery_albums')
          .insert({
            title: values.title,
            description: values.description,
            date: values.date,
            cover_image: values.cover_image
          });

        if (error) throw error;
        toast({
          title: "Album created",
          description: "The new album has been created successfully."
        });
      }

      // Refetch albums and reset form
      await refetchAlbums();
      setDialogOpen(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error('Error saving album:', error);
      toast({
        title: "Error",
        description: "Failed to save the album. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle image form submission
  const handleImageSubmit = async (values: z.infer<typeof imageSchema>) => {
    try {
      if (editingImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: values.title,
            description: values.description,
            category: values.category,
            image_url: values.image_url,
            album_id: values.album_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingImage.id);

        if (error) throw error;
        toast({
          title: "Image updated",
          description: "The image has been updated successfully."
        });
      } else {
        // Create new image
        const { error } = await supabase
          .from('gallery_images')
          .insert({
            title: values.title,
            description: values.description,
            category: values.category,
            image_url: values.image_url,
            album_id: values.album_id
          });

        if (error) throw error;
        toast({
          title: "Image added",
          description: "The new image has been added successfully."
        });
      }

      // Refetch images and reset form
      await refetchImages();
      setImageDialogOpen(false);
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Delete an album
  const handleDeleteAlbum = async (album: GalleryAlbum) => {
    if (confirm(`Are you sure you want to delete the album "${album.title}"? This will also delete all images in this album.`)) {
      try {
        const { error } = await supabase
          .from('gallery_albums')
          .delete()
          .eq('id', album.id);

        if (error) throw error;
        
        toast({
          title: "Album deleted",
          description: "The album and all its images have been deleted."
        });
        
        await refetchAlbums();
        if (view === 'albumDetail' && selectedAlbum?.id === album.id) {
          setView('albums');
          setSelectedAlbum(null);
        }
      } catch (error) {
        console.error('Error deleting album:', error);
        toast({
          title: "Error",
          description: "Failed to delete the album. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Delete an image
  const handleDeleteImage = async (image: GalleryImage) => {
    if (confirm(`Are you sure you want to delete the image "${image.title}"?`)) {
      try {
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', image.id);

        if (error) throw error;
        
        toast({
          title: "Image deleted",
          description: "The image has been deleted successfully."
        });
        
        await refetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: "Error",
          description: "Failed to delete the image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render different views based on the current state
  const renderContent = () => {
    if (view === 'albums') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Albums</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingAlbum(null)}
                  className="bg-brown hover:bg-brown/90"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Album
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingAlbum ? 'Edit Album' : 'Create New Album'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the photo album. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...albumForm}>
                  <form onSubmit={albumForm.handleSubmit(handleAlbumSubmit)} className="space-y-4">
                    <FormField
                      control={albumForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Album title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={albumForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe this album" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={albumForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="e.g., June 2023" {...field} />
                          </FormControl>
                          <FormDescription>
                            Date or time period for the album
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={albumForm.control}
                      name="cover_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide a URL for the album cover image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          {loadingAlbums ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-md" />
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <AlbumIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No albums found</h3>
              <p className="text-gray-500 mb-4">You haven't created any photo albums yet.</p>
              <Button 
                className="bg-brown hover:bg-brown/90"
                onClick={() => {
                  setEditingAlbum(null);
                  setDialogOpen(true);
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Create your first album
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div 
                    className="relative aspect-video w-full overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedAlbum(album);
                      setView('albumDetail');
                    }}
                  >
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{album.title}</h3>
                    {album.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{album.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{album.date}</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAlbum(album);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlbum(album);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else if (view === 'images') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">All Images</h3>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingImage(null)}
                  className="bg-brown hover:bg-brown/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the image. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...imageForm}>
                  <form onSubmit={imageForm.handleSubmit(handleImageSubmit)} className="space-y-4">
                    <FormField
                      control={imageForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Image title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe this image" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Image category" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="album_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Album</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brown" 
                              {...field}
                            >
                              <option value="">Select an album</option>
                              {albums.map(album => (
                                <option key={album.id} value={album.id}>{album.title}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide a URL for the image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setImageDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          {loadingImages ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No images found</h3>
              <p className="text-gray-500 mb-4">You haven't uploaded any gallery images yet.</p>
              <Button 
                className="bg-brown hover:bg-brown/90"
                onClick={() => {
                  setEditingImage(null);
                  setImageDialogOpen(true);
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload your first image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={image.image_url} 
                    alt={image.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h4 className="text-white font-medium truncate">{image.title}</h4>
                    {image.description && (
                      <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex justify-end mt-2 space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-black/20 border-white/30 text-white"
                        onClick={() => {
                          setEditingImage(image);
                          setImageDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-black/20 border-white/30 text-white"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else if (view === 'albumDetail' && selectedAlbum) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => {
                setView('albums');
                setSelectedAlbum(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h3 className="text-lg font-medium">{selectedAlbum.title}</h3>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={selectedAlbum.cover_image} 
                alt={selectedAlbum.title} 
                className="w-24 h-24 rounded-md object-cover" 
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedAlbum.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{selectedAlbum.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{selectedAlbum.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingAlbum(selectedAlbum);
                    setDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteAlbum(selectedAlbum)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Album Images</h3>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingImage(null)}
                  className="bg-brown hover:bg-brown/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the image. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...imageForm}>
                  <form onSubmit={imageForm.handleSubmit(handleImageSubmit)} className="space-y-4">
                    <FormField
                      control={imageForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Image title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe this image" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={imageForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Image category" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input 
                      type="hidden" 
                      {...imageForm.register("album_id")} 
                      value={selectedAlbum.id} 
                    />
                    <FormField
                      control={imageForm.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide a URL for the image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setImageDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          {loadingImages ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No images in this album</h3>
              <p className="text-gray-500 mb-4">This album is empty. Add some images to display them here.</p>
              <Button 
                className="bg-brown hover:bg-brown/90"
                onClick={() => {
                  setEditingImage(null);
                  setImageDialogOpen(true);
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add your first image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={image.image_url} 
                    alt={image.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h4 className="text-white font-medium truncate">{image.title}</h4>
                    {image.description && (
                      <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex justify-end mt-2 space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-black/20 border-white/30 text-white"
                        onClick={() => {
                          setEditingImage(image);
                          setImageDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-black/20 border-white/30 text-white"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <AdminLayout title="Gallery">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Manage Gallery</h2>
        <p className="text-gray-500 mt-1">Upload, organize, and manage your album-based gallery</p>
      </div>

      <Tabs defaultValue="albums" className="mt-6" onValueChange={(value) => {
        if (value === 'albums' || value === 'images') {
          setView(value as 'albums' | 'images');
          setSelectedAlbum(null);
        }
      }}>
        <TabsList>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="images">All Images</TabsTrigger>
        </TabsList>
        <TabsContent value="albums" className="mt-6">
          {renderContent()}
        </TabsContent>
        <TabsContent value="images" className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
