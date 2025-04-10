
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CalendarDays, ShoppingBag, Users, Image, Heart, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import ArticleCard from '@/components/ArticleCard';
import EventCard from '@/components/EventCard';
import Button from '@/components/Button';
import { Tables } from '@/integrations/supabase/types';

const Index = () => {
  // Animation on scroll
  const [isVisible, setIsVisible] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);

  // Fetch latest articles with debugging
  const { data: latestArticles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['latestArticles'],
    queryFn: async () => {
      console.log('Fetching latest articles...');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      console.log('Articles retrieved:', data);
      return data as Tables<'articles'>[];
    }
  });

  // Fetch upcoming events with debugging
  const { data: upcomingEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      console.log('Fetching upcoming events...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true })
        .limit(2);
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      console.log('Events retrieved:', data);
      return data as Tables<'events'>[];
    }
  });

  // Partners automatic scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setIsVisible(true);
      }
    };

    // Set initially
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Partners automatic scroll animation
  useEffect(() => {
    const partnersContainer = partnersRef.current;
    if (!partnersContainer) return;

    const scrollWidth = partnersContainer.scrollWidth;
    const clientWidth = partnersContainer.clientWidth;
    
    if (scrollWidth <= clientWidth) return; // No need to scroll if all items fit

    let scrollPosition = 0;
    const speed = 1; // pixels per frame
    
    const scroll = () => {
      if (!partnersContainer) return;
      
      scrollPosition += speed;
      
      // Reset position when we've scrolled the full width
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      partnersContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };
    
    const animationId = requestAnimationFrame(scroll);
    
    return () => cancelAnimationFrame(animationId);
  }, [isVisible]);

  // Partners data
  const partners = [
    { id: 1, name: "Community Center Paris", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+1" },
    { id: 2, name: "Rainbow Foundation", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+2" },
    { id: 3, name: "Local Bistro", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+3" },
    { id: 4, name: "Inclusive Spaces Co.", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+4" },
    { id: 5, name: "City of Paris", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+5" },
    { id: 6, name: "Pride Alliance", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+6" },
    { id: 7, name: "Global Diversity Fund", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+7" },
    { id: 8, name: "Tech for All", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+8" },
    { id: 9, name: "Eco Friends", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+9" },
    { id: 10, name: "Youth Support Network", logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+10" }
  ];

  // HelloAsso URLs
  const SHOP_URL = "https://www.helloasso.com/associations/your-association/boutiques/shop";
  const MEMBERSHIP_URL = "https://www.helloasso.com/associations/your-association/adhesions/membership";

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-medium">
                <span className="animate-pulse-soft">•</span>
                <span className="ml-2">~Bienvenue chez Loom !</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 animate-fade-in">
                Loom - <span className="text-brown">Les Ours Occitanie Méditerannée.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Association Bear créée en 2017. C'est une association pour les Bears mais aussi pour tous ceux qui aiment les Ours, les poils et les tailles allant du XS au XXXXXL.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Button
                  className="bg-orange text-white hover:bg-orange/90"
                  onClick={() => window.open(MEMBERSHIP_URL, '_blank', 'noopener,noreferrer')}
                >
                  Join Us
                </Button>
                <Button 
                  variant="outline" 
                  className="border-orange text-orange hover:bg-orange/10"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl animate-float">
                <img 
                  src="https://media.discordapp.net/attachments/1335572571495731242/1359936546718875708/20241214_232800.jpg?ex=67f94b1b&is=67f7f99b&hm=02cca923294002eb00e199db41aa92520244e28df4460d33ebf045a8e7db8c3a&=&format=webp&width=644&height=483" 
                  alt="Community gathering" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent rounded-2xl"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-xl shadow-lg hidden md:flex items-center gap-3 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-orange/10 rounded-full p-2">
                  <Users size={24} className="text-orange" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Members</p>
                  <p className="text-gray-900 font-bold">1,200+</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 p-4 bg-white rounded-xl shadow-lg hidden md:flex items-center gap-3 animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-yellow/10 rounded-full p-2">
                  <CalendarDays size={24} className="text-yellow-dark" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Annual Events</p>
                  <p className="text-gray-900 font-bold">50+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Articles Section */}
      <section className={`py-16 md:py-24 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Latest Articles" 
            subtitle="Stay updated with our community news, stories, and perspectives."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingArticles ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl p-6 h-96">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : latestArticles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No articles available at the moment. Check back soon!</p>
              </div>
            ) : (
              latestArticles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  image={article.image}
                  category={article.category}
                  slug={article.slug}
                />
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/articles">
              <Button variant="outline" rightIcon={<ChevronRight size={18} />}>
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Upcoming Events" 
            subtitle="Join us for these exciting community gatherings and celebrations."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoadingEvents ? (
              // Loading state
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl p-6 h-96">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
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
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/events">
              <Button rightIcon={<CalendarDays size={18} />}>
                View Full Calendar
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Monsieur Ours Spotlight */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden bg-brown text-white relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1525268771113-32d9e9021a97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-brown to-transparent"></div>
            </div>
            
            <div className="md:w-3/5 lg:w-1/2 p-8 md:p-12 lg:p-16 relative z-10">
              <div className="inline-block mb-4">
                <div className="w-10 h-1 bg-orange mb-2"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Monsieur Ours</h2>
              <p className="text-tan/90 text-lg mb-8">
                Our community mascot and ambassador. Monsieur Ours represents the values of our association: 
                warmth, acceptance, and strength in diversity.
              </p>
              <Link to="/monsieur-ours">
                <Button 
                  variant="secondary" 
                  rightIcon={<ChevronRight size={18} />}
                  className="hover:bg-orange-light"
                >
                  Discover His Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-tan/10">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Discover Our Community" 
            subtitle="Explore the different aspects of what makes our association unique."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-lift">
              <div className="rounded-full bg-brown/10 w-14 h-14 flex items-center justify-center mb-4">
                <Users size={24} className="text-brown" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Active Community</h3>
              <p className="text-gray-600">
                Join a vibrant and inclusive community of over 1,200 members.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-lift">
              <div className="rounded-full bg-orange/10 w-14 h-14 flex items-center justify-center mb-4">
                <CalendarDays size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Regular Events</h3>
              <p className="text-gray-600">
                Participate in our diverse schedule of events, gatherings, and celebrations.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-lift">
              <div className="rounded-full bg-yellow/10 w-14 h-14 flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-yellow-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Shop</h3>
              <p className="text-gray-600">
                Support our mission by shopping our collection of merchandise and memorabilia.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-lift">
              <div className="rounded-full bg-tan/30 w-14 h-14 flex items-center justify-center mb-4">
                <Image size={24} className="text-brown" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Photo Gallery</h3>
              <p className="text-gray-600">
                Browse our collection of photos documenting community events and members.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section - Updated to be scrollable */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Our Partners" 
            subtitle="We're grateful for the support of these organizations and businesses."
            centered
          />
          
          <div 
            ref={partnersRef}
            className="flex overflow-x-auto pb-8 mt-12 no-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex min-w-max space-x-12 px-4">
              {partners.map((partner) => (
                <div 
                  key={partner.id} 
                  className="flex-shrink-0 w-48 h-32 bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-w-full max-h-full"
                  />
                </div>
              ))}
              {/* Duplicate the first few items to create a seamless loop */}
              {partners.slice(0, 5).map((partner) => (
                <div 
                  key={`duplicate-${partner.id}`} 
                  className="flex-shrink-0 w-48 h-32 bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-w-full max-h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Updated to only have "Become a Member" button */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-brown to-brown-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Join Our Community Today and Be Part of Something Special
          </h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Become a member and enjoy exclusive benefits, special event access, and help support our mission.
          </p>
          <button
            onClick={() => window.open(MEMBERSHIP_URL, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Become a Member
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
