import { useState, useEffect } from 'react';
import { db } from '@/db/client';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ChevronDown, ImageIcon, X, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/db/types';
import SectionHeading from '@/components/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type GalleryAlbum = Tables<'gallery_albums'>;
type GalleryImage = Tables<'gallery_images'>;

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Fetch albums
  const { data: albums = [], isLoading: isLoadingAlbums, error: albumsError } = useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      try {
        console.log('Fetching albums...');
        const { data, error } = await db
          .from('gallery_albums')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching albums:', error);
          throw new Error(`Erreur lors de la récupération des albums: ${error.message}`);
        }

        console.log('Albums fetched successfully:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Unexpected error fetching albums:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Fetch images
  const { data: images = [], isLoading: isLoadingImages, error: imagesError } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      try {
        console.log('Fetching images...');
        const { data, error } = await db
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching images:', error);
          throw new Error(`Erreur lors de la récupération des images: ${error.message}`);
        }

        console.log('Images fetched successfully:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Unexpected error fetching images:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const isLoading = isLoadingAlbums || isLoadingImages;
  const error = albumsError || imagesError;

  // Filter albums based on search
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = searchQuery === '' || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (album.description && album.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Une erreur est survenue lors du chargement de la galerie</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (selectedAlbum) {
    const albumImages = images.filter(img => img.album_id === selectedAlbum.id);
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => setSelectedAlbum(null)}>
            Retour
          </Button>
          <h1 className="text-2xl font-bold">{selectedAlbum.title}</h1>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">{selectedAlbum.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {albumImages.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.03 }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white transition-shadow hover:shadow-2xl"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Image'}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end min-h-[48px]">
                  <span className="text-base font-semibold text-white drop-shadow-lg truncate" title={image.title || image.image_url.split('/').pop()}>
                    {image.title || image.image_url.split('/').pop()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lightbox modale pour l'image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button 
                className="w-10 h-10 rounded-full bg-gray-800/70 text-white flex items-center justify-center hover:bg-gray-700/70"
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} />
              </button>
              <a
                href={selectedImage.image_url}
                download
                className="w-10 h-10 rounded-full bg-brown text-white flex items-center justify-center hover:bg-brown-dark"
                title="Enregistrer l'image"
                onClick={e => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-6-6m6 6l6-6" />
                </svg>
              </a>
            </div>
            <div 
              className="max-w-5xl max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title || 'Gallery image'} 
                className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg shadow-lg"
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
      </div>
    );
  }

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
              {filteredAlbums.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                  {filteredAlbums.map((album) => {
                    const albumImages = images.filter(img => img.album_id === album.id);
                    let cover = album.cover_image;
                    if (!cover && albumImages.length > 0) {
                      cover = albumImages[albumImages.length - 1].image_url;
                    }
                    if (!cover) {
                      cover = 'https://www.shutterstock.com/image-vector/cute-bear-builder-carrying-hammer-600nw-2034793730.jpg';
                    }
                    return (
                      <motion.div
                        key={album.id}
                        whileHover={{ scale: 1.03 }}
                        className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white transition-shadow hover:shadow-2xl"
                      >
                        <Link to={`/gallery/${album.id}`} className="block focus:outline-none focus:ring-2 focus:ring-brown">
                          <img
                            src={cover}
                            alt={album.title}
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://www.shutterstock.com/image-vector/cute-bear-builder-carrying-hammer-600nw-2034793730.jpg'; }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end min-h-[80px]">
                            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{album.title}</h3>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                              <span>{format(new Date(album.date), 'PP', { locale: fr })}</span>
                              <span>•</span>
                              <span>{albumImages.length} {albumImages.length === 1 ? 'image' : 'images'}</span>
                            </div>
                          </div>
                          {album.description && album.description.trim() !== '' && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-4 group-hover:bg-white/60 transition-colors">
                              <p className="text-gray-700 text-sm line-clamp-2">{album.description}</p>
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
      
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
