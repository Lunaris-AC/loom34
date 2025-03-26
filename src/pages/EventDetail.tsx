
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, MapPin, ChevronLeft, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      return data as Tables<'events'>;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-tan/10">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-brown/20 border-t-brown rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="flex flex-col min-h-screen bg-tan/10">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex-1">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Event Not Found</h1>
            <p className="text-lg text-gray-700 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/events">
              <Button>
                <ChevronLeft size={18} className="mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/events" className="inline-flex items-center text-brown hover:text-brown-dark mb-6">
              <ChevronLeft size={18} className="mr-1" />
              Back to Events
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
              {event.title}
            </h1>
          </div>
        </div>
      </section>
      
      {/* Event Details */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Event Image */}
              <div className="md:col-span-2">
                <div className="rounded-2xl overflow-hidden shadow-md mb-8">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <div className="prose max-w-none">
                    {event.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-6 text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Event Info */}
              <div>
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
                      <div className="flex items-start text-gray-700">
                        <CalendarDays size={20} className="mr-3 text-brown mt-0.5" />
                        <div>
                          <p className="font-medium">{event.date}</p>
                          <p>{event.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Location</h3>
                      <div className="flex items-start text-gray-700">
                        <MapPin size={20} className="mr-3 text-brown mt-0.5" />
                        <p>{event.location}</p>
                      </div>
                    </div>
                    
                    {event.registration_url && (
                      <a 
                        href={event.registration_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full bg-brown hover:bg-brown-dark text-white py-3 px-6 rounded-lg font-medium transition-colors text-center mt-8"
                      >
                        Register for This Event
                        <ExternalLink size={16} className="inline-block ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-brown text-white mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in More Events?</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Explore our calendar of upcoming events and join our community for exclusive access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button
                variant="secondary"
                size="lg"
                className="bg-orange hover:bg-orange-light transition-all"
              >
                View All Events
              </Button>
            </Link>
            <a
              href="https://www.helloasso.com/associations/your-association/adhesions/membership"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Become a Member
              </Button>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
