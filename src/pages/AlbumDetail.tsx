import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/db/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tables } from '@/db/types';

const AlbumDetail = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch album
  const { data: album, isLoading: isLoadingAlbum } = useQuery({
    queryKey: ['galleryAlbum', albumId],
    queryFn: async () => {
      const { data, error } = await db
        .from('gallery_albums')
        .select('*')
        .eq('id', albumId)
        .single();
      if (error) throw error;
      return data as Tables<'gallery_albums'>;
    },
    enabled: !!albumId
  });

  // Fetch images
  const { data: images = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['galleryImages', albumId],
    queryFn: async () => {
      const { data, error } = await db
        .from('gallery_images')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!albumId
  });

  if (isLoadingAlbum || isLoadingImages) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  if (!album) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Album introuvable</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <div className="mb-4 mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">{album.title}</h1>
        <div className="space-y-4">
          <p className="text-muted-foreground">{album.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {images.map((image) => (
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
      <Footer />
    </div>
  );
};

export default AlbumDetail; 