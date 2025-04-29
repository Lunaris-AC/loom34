import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, CalendarDays, Image as ImageIcon, Users, ArrowUpRight, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Stats card component
const StatsCard = ({ 
  icon, 
  title, 
  count, 
  loading, 
  color,
  path 
}: { 
  icon: React.ReactNode, 
  title: string, 
  count: number,
  loading: boolean,
  color: string,
  path: string
}) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className={`h-8 w-8 ${color} mr-3 rounded-full flex items-center justify-center`}>
            {icon}
          </div>
          {loading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <div className="text-2xl font-bold">{count}</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3">
        <Link 
          to={path}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          View details
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

// Quick action card component
const QuickActionCard = ({ 
  icon, 
  title, 
  path 
}: { 
  icon: React.ReactNode, 
  title: string, 
  path: string 
}) => {
  return (
    <Link 
      to={path} 
      className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 
                flex items-center transition-colors hover:shadow-sm"
    >
      {icon}
      <span className="text-gray-800 font-medium ml-3">{title}</span>
    </Link>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articlesCount: 0,
    eventsCount: 0,
    galleryCount: 0,
    usersCount: 0,
    ticketsCount: 0,
    loading: true
  });

  const [recentActivity, setRecentActivity] = useState({
    articles: [],
    events: [],
    loading: true
  });

  // Fetch tickets count
  const { data: ticketsData } = useQuery({
    queryKey: ['ticketsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contact_tickets')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count;
    }
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch article count
        const { count: articlesCount, error: articlesError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        // Fetch events count
        const { count: eventsCount, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        // Fetch gallery count
        const { count: galleryCount, error: galleryError } = await supabase
          .from('gallery_images')
          .select('*', { count: 'exact', head: true });

        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (articlesError) console.error("Error fetching articles:", articlesError);
        if (eventsError) console.error("Error fetching events:", eventsError);
        if (galleryError) console.error("Error fetching gallery:", galleryError);
        if (usersError) console.error("Error fetching users:", usersError);

        setStats({
          articlesCount: articlesCount || 0,
          eventsCount: eventsCount || 0,
          galleryCount: galleryCount || 0,
          usersCount: usersCount || 0,
          ticketsCount: ticketsData || 0,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load statistics");
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    async function fetchRecentActivity() {
      try {
        // Fetch recent articles
        const { data: recentArticles, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent events
        const { data: recentEvents, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (articlesError) console.error("Error fetching recent articles:", articlesError);
        if (eventsError) console.error("Error fetching recent events:", eventsError);

        setRecentActivity({
          articles: recentArticles || [],
          events: recentEvents || [],
          loading: false
        });
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast.error("Failed to load recent activity");
        setRecentActivity(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
    fetchRecentActivity();
  }, [ticketsData]);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-2">Bienvenue sur le tableau de bord</h2>
        <p className="text-gray-600">
          Gérez le contenu de votre site, surveillez l'activité et gardez tout à jour.
        </p>
      </div>
      
      {/* Stats section */}
      <h3 className="text-lg font-medium text-gray-800 mb-4">Vue d'ensemble</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          icon={<FileText className="h-5 w-5 text-white" />} 
          title="Articles" 
          count={stats.articlesCount} 
          loading={stats.loading}
          color="bg-blue-500"
          path="/admin/articles"
        />
        
        <StatsCard 
          icon={<CalendarDays className="h-5 w-5 text-white" />} 
          title="Événements" 
          count={stats.eventsCount} 
          loading={stats.loading}
          color="bg-orange"
          path="/admin/events"
        />
        
        <StatsCard 
          icon={<ImageIcon className="h-5 w-5 text-white" />} 
          title="Photos" 
          count={stats.galleryCount} 
          loading={stats.loading}
          color="bg-purple-500"
          path="/admin/gallery"
        />
        
        <StatsCard 
          icon={<Users className="h-5 w-5 text-white" />} 
          title="Utilisateurs" 
          count={stats.usersCount} 
          loading={stats.loading}
          color="bg-green-500"
          path="/admin/users"
        />

        <StatsCard 
          icon={<MessageSquare className="h-5 w-5 text-white" />} 
          title="Tickets" 
          count={stats.ticketsCount} 
          loading={stats.loading}
          color="bg-red-500"
          path="/admin/tickets"
        />
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-medium text-gray-800 mb-4">Actions rapides</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickActionCard 
          icon={<FileText className="h-5 w-5 text-blue-500" />} 
          title="Créer un article" 
          path="/admin/articles"
        />
        
        <QuickActionCard 
          icon={<CalendarDays className="h-5 w-5 text-orange" />} 
          title="Planifier un événement" 
          path="/admin/events"
        />
        
        <QuickActionCard 
          icon={<ImageIcon className="h-5 w-5 text-purple-500" />} 
          title="Ajouter des photos" 
          path="/admin/gallery"
        />

        <QuickActionCard 
          icon={<MessageSquare className="h-5 w-5 text-red-500" />} 
          title="Voir les tickets" 
          path="/admin/tickets"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Articles récents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded mr-3" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.articles.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Aucun article créé pour le moment
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.articles.map((article: any) => (
                  <div 
                    key={article.id} 
                    className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div 
                      className="h-12 w-12 bg-cover bg-center rounded mr-3 flex-shrink-0"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link 
              to="/admin/articles" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir tous les articles
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Événements récents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded mr-3" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.events.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Aucun événement créé pour le moment
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.events.map((event: any) => (
                  <div 
                    key={event.id} 
                    className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div 
                      className="h-12 w-12 bg-cover bg-center rounded mr-3 flex-shrink-0"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {event.date} · {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link 
              to="/admin/events" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir tous les événements
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
