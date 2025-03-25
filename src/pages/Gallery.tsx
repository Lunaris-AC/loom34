
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, ChevronDown, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const imagesPerPage = 12;

  // Fetch gallery images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['galleryImages', searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tables<'gallery_images'>[];
    }
  });

  // Get unique categories for filter
  const categories = [...new Set(images.map(img => img.category))];

  // Calculate pagination
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const paginatedImages = images.slice(
    (currentPage - 1) * imagesPerPage, 
    currentPage * imagesPerPage
  );

  // Image modal state
  const [selectedImage, setSelectedImage] = useState<Tables<'gallery_images'> | null>(null);

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
              Browse through memories from our events and community activities. 
              These photos capture the spirit and joy of our vibrant community.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search gallery..."
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <button className="flex items-center justify-between w-48 px-4 h-12 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <div className="flex items-center">
                    <Filter size={18} className="mr-2 text-gray-500" />
                    <span>{categoryFilter || 'All Categories'}</span>
                  </div>
                  <ChevronDown size={16} />
                </button>
                {/* Category filter dropdown would go here */}
                <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 hidden">
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setCategoryFilter('')}
                  >
                    All Categories
                  </div>
                  {categories.map((category) => (
                    <div 
                      key={category}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(12).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl aspect-square"></div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Images Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery ? 
                  `No images match your search for "${searchQuery}". Try different keywords or clear your search.` : 
                  "There are no images in the gallery yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedImages.map((image) => (
                  <div 
                    key={image.id}
                    className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                className="w-full h-auto"
              />
              <button 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-700 mb-4">{selectedImage.description}</p>
              )}
              <span className="inline-block px-3 py-1 bg-tan/20 text-brown rounded-full text-sm">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Call to Action */}
      <section className="py-16 bg-brown text-white">
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
