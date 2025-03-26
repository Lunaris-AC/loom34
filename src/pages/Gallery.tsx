
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, ChevronDown, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import SectionHeading from '@/components/SectionHeading';

// Define types
interface Album {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  date: string;
  image_count: number;
}

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);

  // Mock albums data - in a real app, you'd fetch this from Supabase
  const albums: Album[] = [
    {
      id: 1,
      title: "Annual Community Picnic 2023",
      description: "Photos from our yearly gathering at Parc Monceau.",
      cover_image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "June 15, 2023",
      image_count: 24
    },
    {
      id: 2,
      title: "Pride Parade 2023",
      description: "Celebrating diversity and inclusion at the Paris Pride Parade.",
      cover_image: "https://images.unsplash.com/photo-1516841273335-e39b37888115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "June 24, 2023",
      image_count: 36
    },
    {
      id: 3,
      title: "Winter Fundraiser",
      description: "Our annual fundraising gala at Hotel de Ville.",
      cover_image: "https://images.unsplash.com/photo-1532117182044-031e7cd916ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "December 10, 2023",
      image_count: 18
    },
    {
      id: 4,
      title: "Art Workshop Series",
      description: "Photos from our monthly art workshops led by local artists.",
      cover_image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "January - March 2023",
      image_count: 42
    },
    {
      id: 5,
      title: "Community Volunteer Day",
      description: "Our members giving back through various service projects around the city.",
      cover_image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 22, 2023",
      image_count: 29
    },
    {
      id: 6,
      title: "Summer Family Festival",
      description: "Our biggest family event of the year with games, food, and performances.",
      cover_image: "https://images.unsplash.com/photo-1536598065097-53b4573578be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "August 5, 2023",
      image_count: 56
    }
  ];

  // Filter albums based on search
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = searchQuery === '' || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Fetch images for a selected album
  const { data: albumImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ['albumImages', selectedAlbum?.id],
    queryFn: async () => {
      if (!selectedAlbum) return [];
      
      // In a real app, you'd fetch images by album ID
      // For now, we'll just return a filtered set of mock gallery images
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        // Using category as a proxy for album ID in this example
        .eq('category', selectedAlbum.title)
        .limit(24);
        
      if (error) throw error;
      
      // If no images found, return mock data
      if (!data || data.length === 0) {
        return Array(12).fill(0).map((_, index) => ({
          id: `mock-${selectedAlbum.id}-${index}`,
          title: `Image ${index + 1}`,
          description: `Sample image from ${selectedAlbum.title}`,
          image_url: `https://source.unsplash.com/random/800x600?sig=${selectedAlbum.id}${index}`,
          category: selectedAlbum.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null
        })) as Tables<'gallery_images'>[];
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
              Community Gallery
            </h1>
            <p className="text-lg text-gray-700">
              Browse through memories from our events and community activities organized in albums.
              These photos capture the spirit and joy of our vibrant community.
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
                    placeholder="Search albums..."
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
              <SectionHeading
                title="Photo Albums"
                subtitle="Explore our collections of memories organized by event or theme."
                centered
              />
              
              {filteredAlbums.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No Albums Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No albums match your search for "{searchQuery}". Try different keywords or clear your search.
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
                      <div className="h-56 overflow-hidden">
                        <img 
                          src={album.cover_image} 
                          alt={album.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                        <p className="text-gray-600 mb-3">{album.description}</p>
                        <div className="flex items-center justify-between text-sm">
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
                Back to Albums
              </button>
              
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-2">{selectedAlbum.title}</h2>
                <p className="text-gray-600 mb-2">{selectedAlbum.description}</p>
                <span className="text-sm text-gray-500">{selectedAlbum.date} • {selectedAlbum.image_count} Photos</span>
              </div>
            </div>
          </section>
          
          {/* Images Grid */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              {isLoadingImages ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(12).fill(0).map((_, index) => (
                    <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albumImages.map((image) => (
                    <div 
                      key={image.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.title || 'Gallery image'} 
                        className="w-full h-full object-cover"
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
          <h2 className="text-3xl font-bold mb-6">Have Photos to Share?</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            If you've captured special moments at our events, we'd love to see them! 
            Share your photos with us to be featured in our community gallery.
          </p>
          <a 
            href="mailto:gallery@yourdomain.com" 
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Submit Your Photos
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Gallery;
