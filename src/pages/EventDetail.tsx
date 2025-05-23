import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/db/client';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/db/types';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch event details
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data, error } = await db
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      return data as Tables<'events'>;
    }
  });

  // Handle 404
  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-tan/10">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-24">
        <button 
          className="inline-flex items-center text-brown hover:text-brown-dark mb-8"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft size={18} className="mr-1" />
          Retour aux événements
        </button>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <CalendarDays size={20} className="mr-2 text-brown" />
              <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={20} className="mr-2 text-brown" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2 text-brown" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-8 text-lg text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.description}</ReactMarkdown>
          </div>
          
          {event.registration_url && (
            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={() => window.open(event.registration_url, '_blank')}
                className="flex items-center"
              >
                S'inscrire à l'événement
                <ExternalLink size={18} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
