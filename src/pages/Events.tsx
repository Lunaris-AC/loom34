import { useState, useMemo } from 'react';
import { db } from '@/db/client';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Clock, Search, Filter, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/db/types';
import SectionHeading from '@/components/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [hideExpired, setHideExpired] = useState(false);

  // Fetch events from database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await db
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      return data as Tables<'events'>[];
    }
  });

  // Get unique locations from events
  const locations = useMemo(() => {
    const locs = Array.from(new Set(events.map(e => e.location).filter(Boolean)));
    return locs.sort((a, b) => a.localeCompare(b, 'fr'));
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || event.location === locationFilter;
      const notExpired = !hideExpired || new Date(event.date) >= new Date();
      return matchesSearch && matchesLocation && notExpired;
    });
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return filtered;
  }, [events, searchQuery, locationFilter, sortOrder, hideExpired]);

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Nos Événements
            </h1>
            <p className="text-lg text-gray-700">
              Découvrez tous nos événements à venir et passés. Rejoignez-nous pour des moments inoubliables !
            </p>
          </div>
        </div>
      </section>
      
      {/* Search & Filters Bar */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un événement..."
                className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="h-12 border border-gray-300 rounded-lg px-3 focus:ring-brown focus:border-brown min-w-[160px]"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              >
                <option value="">Tous les lieux</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant={sortOrder === 'asc' ? 'default' : 'outline'}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-12"
              >
                Trier par date {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
              <Button
                variant={hideExpired ? 'default' : 'outline'}
                onClick={() => setHideExpired(v => !v)}
                className="h-12"
              >
                {hideExpired ? 'Afficher tous' : 'Masquer expirés'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <CalendarDays size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Aucun Événement Disponible pour le moment - ERR04</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery ? 
                  `Aucun événement ne correspond à votre recherche "${searchQuery}". Essayez d'autres mots-clés ou réinitialisez votre recherche.` : 
                  "Il n'y a pas encore d'événements. Les événements apparaîtront ici une fois créés."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="block group"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:ring-2 group-hover:ring-brown">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brown transition-colors">{event.title}</h3>
                      <div className="text-gray-600 mb-4 line-clamp-2 prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.description}</ReactMarkdown>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500">
                          <CalendarDays size={16} className="mr-2" />
                          <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      {event.registration_url && (
                        <button 
                          className="w-full mt-4 bg-brown text-white py-2 px-4 rounded-md hover:bg-brown/90 transition-colors flex items-center justify-center"
                          onClick={e => { e.stopPropagation(); e.preventDefault(); window.open(event.registration_url, '_blank'); }}
                        >
                          <Ticket size={16} className="mr-2" />
                          S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Events;
