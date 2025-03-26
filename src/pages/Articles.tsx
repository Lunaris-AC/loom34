
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Tables } from '@/integrations/supabase/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const articlesPerPage = 9;

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tables<'articles'>[];
    }
  });

  // Get unique categories for filter
  const categories = [...new Set(articles.map(article => article.category))];

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * articlesPerPage, 
    currentPage * articlesPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Articles
            </h1>
            <p className="text-lg text-gray-700">
              Explore our collection of articles, stories, and perspectives from our community. 
              Stay updated with the latest news and insights.
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
                  placeholder="Search articles..."
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>
              <div className="relative">
                <button 
                  className="flex items-center justify-between w-48 px-4 h-12 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    const dropdown = document.getElementById('categoriesDropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Filter size={18} className="mr-2 text-gray-500" />
                    <span>{categoryFilter || 'All Categories'}</span>
                  </div>
                  <ChevronDown size={16} />
                </button>
                {/* Category filter dropdown */}
                <div 
                  id="categoriesDropdown"
                  className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 hidden"
                >
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategoryFilter('');
                      setCurrentPage(1); // Reset to first page on filter change
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
                        setCurrentPage(1); // Reset to first page on filter change
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
        </div>
      </section>
      
      {/* Articles Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl p-6 h-96">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || categoryFilter ? 
                  `No articles match your search criteria. Try different keywords or filters.` : 
                  "We don't have any articles published yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
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
      
      <Footer />
    </div>
  );
};

export default Articles;
