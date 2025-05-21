
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, ChevronLeft, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) {
        console.error('ERREUR:', error);
        throw error;
      }
      
      return data as Tables<'articles'>;
    }
  });
  
  useEffect(() => {
    if (article?.date) {
      const date = new Date(article.date);
      setFormattedDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [article]);
  
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
  
  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen bg-tan/10">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex-1">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Article non trouvé</h1>
            <p className="text-lg text-gray-700 mb-8">
              L'article que vous cherchez n'existe pas ou a été supprimé.
            </p>
            <Link to="/articles">
              <Button>
                <ChevronLeft size={18} className="mr-2" />
                Retour aux articles
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
      <section className="pt-24 md:pt-32 pb-8 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/articles" className="inline-flex items-center text-brown hover:text-brown-dark mb-6">
              <ChevronLeft size={18} className="mr-1" />
              Retour aux articles
            </Link>
            
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-medium mb-4">
              {article.category}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-8">
              <div className="flex items-center mr-6">
                <User size={18} className="mr-2" />
                <span>Admin</span>
              </div>
              <div className="flex items-center">
                <CalendarDays size={18} className="mr-2" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Article Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez notre communauté</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Participez à notre communauté vibrante et restez informé des derniers articles, événements et initiatives.
          </p>
          <a 
            href="https://www.helloasso.com/associations/your-association/adhesions/membership" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Devenez membre
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
