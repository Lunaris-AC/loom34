
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, CalendarDays, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articlesCount: 0,
    eventsCount: 0,
    galleryCount: 0,
    loading: true
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

        if (articlesError) console.error("Error fetching articles:", articlesError);
        if (eventsError) console.error("Error fetching events:", eventsError);
        if (galleryError) console.error("Error fetching gallery:", galleryError);

        setStats({
          articlesCount: articlesCount || 0,
          eventsCount: eventsCount || 0,
          galleryCount: galleryCount || 0,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Articles Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              {stats.loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.articlesCount}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-orange mr-3" />
              {stats.loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.eventsCount}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Gallery Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-purple-500 mr-3" />
              {stats.loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.galleryCount}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/articles" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 flex items-center transition-colors">
            <FileText className="h-6 w-6 text-blue-500 mr-3" />
            <span className="text-gray-800 font-medium">Manage Articles</span>
          </a>
          <a href="/admin/events" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 flex items-center transition-colors">
            <CalendarDays className="h-6 w-6 text-orange mr-3" />
            <span className="text-gray-800 font-medium">Manage Events</span>
          </a>
          <a href="/admin/gallery" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 flex items-center transition-colors">
            <ImageIcon className="h-6 w-6 text-purple-500 mr-3" />
            <span className="text-gray-800 font-medium">Manage Gallery</span>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
