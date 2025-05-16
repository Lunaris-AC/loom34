import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, ChevronDown, ImageIcon, X, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import SectionHeading from '@/components/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface GalleryAlbum extends Tables<'gallery_albums'> {
  image_count?: number;
}

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);

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

      // For each album, get the count of images and the latest image as cover
      const albumsWithCount: GalleryAlbum[] = await Promise.all(
        (albumsData || []).map(async (album) => {
          // Get image count
          const { count, error: countError } = await supabase
            .from('gallery_images')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);

          if (countError) {
            console.error('Error fetching image count:', countError);
          }

          // Get latest image for cover
          const { data: latestImage, error: latestImageError } = await supabase
            .from('gallery_images')
            .select('image_url')
            .eq('album_id', album.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (latestImageError && latestImageError.code !== 'PGRST116') { // ignore no rows found
            console.error('Error fetching latest image:', latestImageError);
          }

          return {
            ...album,
            image_count: count || 0,
            cover_image: latestImage?.image_url || album.cover_image,
          };
        })
      );

      return albumsWithCount;
    },
  });

  // Filter albums based on search
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = searchQuery === '' || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (album.description && album.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // Fetch images for a selected album
  const { data: albumImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['albumImages', selectedAlbum?.id],
    queryFn: async () => {
      if (!selectedAlbum) return [];
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('album_id', selectedAlbum.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching album images:', error);
        throw error;
      }
      
      return data as Tables<'gallery_images'>[];
    },
    enabled: !!selectedAlbum
  });

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Galerie Communautaire
            </h1>
            <p className="text-lg text-gray-700">
            Explorez les archives photographiques des Ours!
            </p>
          </div>
        </div>
      </section>
      
      {/* Album View */}
      {!selectedAlbum ? (
        <>
          {/* Search Bar */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un album..."
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Albums Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              
              {isLoadingAlbums ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {Array(6).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-80 rounded-xl" />
                  ))}
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Aucun Album Disponible pour le moment - ERR03 </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchQuery ? 
                      `Aucun album ne correspond à votre recherche "${searchQuery}". Essayez d'autres mots-clés ou réinitialisez votre recherche.` : 
                      "Il n'y a pas encore d'albums. Les albums apparaîtront ici une fois créés."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {filteredAlbums.map((album) => (
                    <div 
                      key={album.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover-lift"
                      onClick={() => setSelectedAlbum(album)}
                    >
                      <div className="h-56 overflow-hidden flex items-center justify-center bg-gray-100">
                        <img 
                          src={album.cover_image} 
                          alt={album.title} 
                          className="max-h-56 w-auto h-auto mx-auto"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                        <p className="text-gray-600 mb-3">{album.description}</p>
                        <div className="flex items-center justify-between tesxt-sm">
                          <span className="text-gray-500">{album.date}</span>
                          <span className="bg-tan/20 text-brown px-2 py-1 rounded-full">
                            {album.image_count} Photos
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Album Detail View */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <button 
                className="inline-flex items-center text-brown hover:text-brown-dark mb-6"
                onClick={() => {
                  setSelectedAlbum(null);
                  setSelectedImage(null);
                }}
              >
                <ArrowLeft size={18} className="mr-1" />
                Retour aux albums
              </button>
              
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-2">{selectedAlbum.title}</h2>
                <p className="text-gray-600 mb-2">{selectedAlbum.description}</p>
                <span className="text-sm text-gray-500">
                  {selectedAlbum.date} • {albumImages.length} Images
                </span>
              </div>
            </div>
          </section>
          
          {/* Images Grid */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              {isLoadingImages ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(12).fill(0).map((_, index) => (
                    <Skeleton key={index} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : albumImages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No Images Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Cet album ne contient pas encore d'images.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albumImages.map((image) => (
                    <div 
                      key={image.id}
                      className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center bg-gray-100"
                      style={{ aspectRatio: '1/1' }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.title || 'Gallery image'} 
                        className="max-h-60 w-auto h-auto mx-auto"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              className="w-10 h-10 rounded-full bg-gray-800/70 text-white flex items-center justify-center hover:bg-gray-700/70"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div 
            className="max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.title || 'Gallery image'} 
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            
            {(selectedImage.title || selectedImage.description) && (
              <div className="bg-gray-900/80 text-white p-4 mt-2 rounded-lg">
                {selectedImage.title && (
                  <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Call to Action */}
      <section className="py-16 bg-brown text-white mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous avez des photos à partager ?</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Si vous avez capturé des moments spéciaux lors de nos événements, nous serions ravis de les voir !
            Partagez vos photos avec nous pour qu'elles apparaissent dans notre galerie communautaire.
          </p>
          <a 
            href="mailto:contactloom34@gmail.com" 
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Envoyer vos photos
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Gallery;
