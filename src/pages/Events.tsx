
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, Calendar, Filter, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { Tables } from '@/integrations/supabase/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const eventsPerPage = 6;

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // For simplicity, we're not implementing category filtering yet
      // since the current database schema doesn't have a category field for events

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tables<'events'>[];
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage, 
    currentPage * eventsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-700">
              Discover and join our community gatherings, celebrations, and activities. 
              Our events are the perfect opportunity to connect with others and have fun.
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
                  placeholder="Search events..."
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <button className="flex items-center justify-between w-48 px-4 h-12 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 text-gray-500" />
                      <span>Filter by Date</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {/* Date filter dropdown would go here */}
                </div>
                <div className="relative">
                  <button className="flex items-center justify-between w-48 px-4 h-12 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Filter size={18} className="mr-2 text-gray-500" />
                      <span>All Categories</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {/* Category filter dropdown would go here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl p-6 h-96">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Events Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery ? 
                  `No events match your search for "${searchQuery}". Try different keywords or clear your search.` : 
                  "We don't have any upcoming events at the moment. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedEvents.map((event) => (
                  <EventCard 
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    image={event.image}
                    slug={event.slug}
                    registrationUrl={event.registration_url}
                  />
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
      
      {/* Call to Action */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Host an Event?</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            We're always looking for community members to host events. If you have an idea for 
            an event, we'd love to hear from you and help make it happen.
          </p>
          <a 
            href="mailto:events@yourdomain.com" 
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Contact Our Events Team
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Events;
