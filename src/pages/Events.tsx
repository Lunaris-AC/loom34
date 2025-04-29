import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { Tables } from '@/integrations/supabase/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const eventsPerPage = 6;

  // Fetch all events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', searchQuery, categoryFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      if (categoryFilter) {
        // Extract category from description for demo (in a real app, you'd have a category field)
        // This is a simplified approach since we don't have a category field in the events table
        query = query.ilike('description', `%${categoryFilter}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Apply date filter in JS (since our date field is text)
      let filtered = data as Tables<'events'>[];
      
      if (dateFilter) {
        const filterDateStr = format(dateFilter, 'MMMM d, yyyy');
        filtered = filtered.filter(event => {
          return event.date.includes(filterDateStr);
        });
      }
      
      return filtered;
    }
  });

  // Extract categories from events (simplified - in a real app, you'd have a proper category field)
  useEffect(() => {
    if (events.length > 0) {
      const categoryList = [
        'Workshop',
        'Community',
        'Social',
        'Educational',
        'Charity',
        'Art'
      ];
      setCategories(categoryList);
    }
  }, [events]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage, 
    currentPage * eventsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Événements à venir
            </h1>
            <p className="text-lg text-gray-700">
              Découvrez et rejoignez nos rassemblements communautaires, nos célébrations et nos activités.
              Nos événements sont l'occasion parfaite de rencontrer d'autres personnes et de s'amuser.
            </p>
          </div>
        </div>
      </section>
      
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
                  placeholder="Rechercher des événements..."
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex justify-between w-full sm:w-48 h-12"
                      >
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-2 text-gray-500" />
                          <span>{dateFilter ? format(dateFilter, 'PP') : 'Filtrer par date'}</span>
                        </div>
                        <ChevronDown size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                      {dateFilter && (
                        <div className="p-3 border-t">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDateFilter(undefined)}
                            className="w-full"
                          >
                            Clear Date
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative">
                  <button 
                    className="flex items-center justify-between w-full sm:w-48 h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      const dropdown = document.getElementById('categoriesDropdown');
                      if (dropdown) {
                        dropdown.classList.toggle('hidden');
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Filter size={18} className="mr-2 text-gray-500" />
                      <span>{categoryFilter || 'Toutes les catégories'}</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {/* Category filter dropdown */}
                  <div 
                    id="categoriesDropdown"
                    className="absolute top-full mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 hidden"
                  >
                    <div 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCategoryFilter('');
                        setCurrentPage(1);
                        document.getElementById('categoriesDropdown')?.classList.add('hidden');
                      }}
                    >
                      All Categories
                    </div>
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setCategoryFilter(category);
                          setCurrentPage(1);
                          document.getElementById('categoriesDropdown')?.classList.add('hidden');
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active filters */}
            {(searchQuery || categoryFilter || dateFilter) && (
              <div className="mt-4 flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtres actifs :</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                    Recherche : {searchQuery}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchQuery('')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                    Catégorie : {categoryFilter}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setCategoryFilter('')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {dateFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                    Date : {format(dateFilter, 'PP')}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setDateFilter(undefined)}
                    >
                      ×
                    </button>
                  </span>
                )}
                <button 
                  className="text-sm text-brown hover:text-brown-dark ml-2"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
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
              <h3 className="text-2xl font-semibold mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || categoryFilter || dateFilter ? 
                  `Aucun événement ne correspond à vos critères de recherche. Essayez d'autres filtres.` : 
                  "Nous n'avons pas d'événements à venir pour le moment. Revenez bientôt !"}
              </p>
              
              {(searchQuery || categoryFilter || dateFilter) && (
                <button 
                  className="mt-4 text-brown hover:underline font-medium"
                  onClick={clearFilters}
                >
                  Effacer tous les filtres
                </button>
              )}
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
      
      <Footer />
    </div>
  );
};

export default Events;
