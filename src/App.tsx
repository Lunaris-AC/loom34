
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import MonsieurOurs from "./pages/MonsieurOurs";
import Gallery from "./pages/Gallery";
import Partners from "./pages/Partners";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminEvents from "./pages/admin/Events";
import AdminGallery from "./pages/admin/Gallery";
import RequireAuth from "./components/auth/RequireAuth";
import RequireAdmin from "./components/auth/RequireAdmin";
import ArticleDetail from "./pages/ArticleDetail";
import EventDetail from "./pages/EventDetail";
import Articles from "./pages/Articles";
import ExternalRedirect from "./components/ExternalRedirect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// HelloAsso URLs - Direct links without host prefixing
const SHOP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom#shop";
const MEMBERSHIP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025";

const App = () => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Main Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/monsieur-ours" element={<MonsieurOurs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/partners" element={<Partners />} />
              
              {/* External Redirects - Using ExternalRedirect component */}
              <Route path="/shop" element={<ExternalRedirect url={SHOP_URL} />} />
              <Route path="/membership" element={<ExternalRedirect url={MEMBERSHIP_URL} />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<RequireAuth><RequireAdmin><Navigate to="/admin/dashboard" /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/dashboard" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/articles" element={<RequireAuth><RequireAdmin><AdminArticles /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/events" element={<RequireAuth><RequireAdmin><AdminEvents /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/gallery" element={<RequireAuth><RequireAdmin><AdminGallery /></RequireAdmin></RequireAuth>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
