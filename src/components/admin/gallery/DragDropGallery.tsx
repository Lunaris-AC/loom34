import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, ImageIcon, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlbumForm } from './AlbumForm';
import { ImageForm } from './ImageForm';
import { SortableAlbum } from './SortableAlbum';
import { SortableImage } from './SortableImage';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface DragDropGalleryProps {
  albums: Tables<'gallery_albums'>[];
  images: Tables<'gallery_images'>[];
  onUpdateAlbums: (albums: Tables<'gallery_albums'>[]) => void;
  onUpdateImages: (images: Tables<'gallery_images'>[]) => void;
  onCreateAlbum: (data: any) => Promise<void>;
  onCreateImage: (data: any) => Promise<void>;
  onUpdateAlbum: (data: any) => Promise<void>;
  onUpdateImage: (data: any) => Promise<void>;
  onDeleteAlbum: (albumId: string) => Promise<void>;
  onDeleteImage: (imageId: string) => Promise<void>;
}

export function DragDropGallery({
  albums,
  images,
  onUpdateAlbums,
  onUpdateImages,
  onCreateAlbum,
  onCreateImage,
  onUpdateAlbum,
  onUpdateImage,
  onDeleteAlbum,
  onDeleteImage,
}: DragDropGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Tables<'gallery_albums'> | null>(null);
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = albums.findIndex(album => album.id === active.id);
      const newIndex = albums.findIndex(album => album.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newAlbums = arrayMove(albums, oldIndex, newIndex);
        onUpdateAlbums(newAlbums);
      }
    }

    setActiveId(null);
  };

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex(image => image.id === active.id);
      const newIndex = images.findIndex(image => image.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        onUpdateImages(newImages);
      }
    }

    setActiveId(null);
  };

  const handleDropImageInAlbum = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const image = images.find(img => img.id === active.id);
    const album = albums.find(alb => alb.id === over.id);
    
    if (image && album) {
      const updatedImage = { ...image, album_id: album.id };
      onUpdateImage(updatedImage);
      toast.success(`Image déplacée dans l'album ${album.title}`);
    }

    setActiveId(null);
  };

  const handleEditAlbum = async (data: any) => {
    await onUpdateAlbum(data);
    setSelectedAlbum(null);
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ? Les photos seront déplacées dans la section non classée.")) {
      await onDeleteAlbum(albumId);
    }
  };

  const handleEditImage = async (data: any) => {
    await onUpdateImage(data);
    setSelectedImage(null);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      await onDeleteImage(imageId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Albums Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Albums</h2>
            <p className="text-gray-500 mt-1">Organisez vos albums par glisser-déposer</p>
          </div>
          <div className="flex gap-2">
            {selectedAlbum && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAlbum(selectedAlbum);
                    setIsCreatingAlbum(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier l'album
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAlbum(selectedAlbum.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer l'album
                </Button>
              </>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="brown"
                  className="text-white"
                  onClick={() => {
                    setIsCreatingAlbum(true);
                    setSelectedAlbum(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AlbumForm
                  isCreating={isCreatingAlbum}
                  defaultValues={selectedAlbum ?? undefined}
                  onSubmit={isCreatingAlbum ? onCreateAlbum : handleEditAlbum}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SortableContext items={albums.map(album => album.id)} strategy={rectSortingStrategy}>
              {albums.map(album => (
                <SortableAlbum
                  key={album.id}
                  album={album}
                  onEdit={() => {
                    setSelectedAlbum(album);
                    setIsCreatingAlbum(false);
                  }}
                  onDelete={() => handleDeleteAlbum(album.id)}
                />
              ))}
            </SortableContext>
          </div>

          {typeof window !== 'undefined' && createPortal(
            <DragOverlay>
              {activeId ? (
                <div className="opacity-50">
                  {albums.find(album => album.id === activeId) && (
                    <SortableAlbum
                      album={albums.find(album => album.id === activeId)!}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  )}
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </section>

      {/* Images Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Images</h2>
            <p className="text-gray-500 mt-1">Glissez les images dans les albums</p>
          </div>
          <div className="flex gap-2">
            {selectedImage && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedImage(selectedImage);
                    setIsCreatingImage(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier l'image
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteImage(selectedImage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer l'image
                </Button>
              </>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="brown"
                  className="text-white"
                  onClick={() => {
                    setIsCreatingImage(true);
                    setSelectedImage(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ImageForm
                  albums={albums}
                  isCreating={isCreatingImage}
                  defaultValues={selectedImage ?? undefined}
                  onSubmit={isCreatingImage ? onCreateImage : handleEditImage}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleImageDragEnd}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SortableContext items={images.map(image => image.id)} strategy={rectSortingStrategy}>
              {images.map(image => (
                <SortableImage
                  key={image.id}
                  image={image}
                  albums={albums}
                  onEdit={() => {
                    setSelectedImage(image);
                    setIsCreatingImage(false);
                  }}
                  onDelete={() => handleDeleteImage(image.id)}
                />
              ))}
            </SortableContext>
          </div>

          {typeof window !== 'undefined' && createPortal(
            <DragOverlay>
              {activeId ? (
                <div className="opacity-50">
                  {images.find(image => image.id === activeId) && (
                    <SortableImage
                      image={images.find(image => image.id === activeId)!}
                      albums={albums}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  )}
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </section>
    </div>
  );
} 