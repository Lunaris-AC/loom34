import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import React from "react";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import MonsieurOurs from "./pages/MonsieurOurs";
import Gallery from "./pages/Gallery";
import Partners from "./pages/Partners";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminEvents from "./pages/admin/Events";
import AdminGallery from "./pages/admin/Gallery";
import AdminUsers from "./pages/admin/Users";
import AdminTickets from "./pages/admin/Tickets";
import RequireAuth from "./components/auth/RequireAuth";
import RequireAdmin from "./components/auth/RequireAdmin";
import ArticleDetail from "./pages/ArticleDetail";
import EventDetail from "./pages/EventDetail";
import Articles from "./pages/Articles";
import ExternalRedirect from "./components/ExternalRedirect";
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient();

// HelloAsso URLs - Direct links without host prefixing
const SHOP_URL = "https://www.helloasso.com/associations/your-association/boutiques/shop";
const MEMBERSHIP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025";

// Mapping des routes vers leurs titres
const PAGE_TITLES: { [key: string]: string } = {
  "/": "LOOM - Les Ours Occitanie Méditerranée",
  "/about": "LOOM - À propos",
  "/events": "LOOM - Événements",
  "/articles": "LOOM - Articles",
  "/monsieur-ours": "LOOM - Monsieur Ours",
  "/gallery": "LOOM - Galerie Photos",
  "/partners": "LOOM - Nos Partenaires",
  "/auth/login": "LOOM - Connexion",
  "/auth/register": "LOOM - Inscription",
  "/auth/profile": "LOOM - Mon Profil",
  "/admin/dashboard": "LOOM Admin - Tableau de bord",
  "/admin/articles": "LOOM Admin - Articles",
  "/admin/events": "LOOM Admin - Événements",
  "/admin/gallery": "LOOM Admin - Galerie",
  "/admin/users": "LOOM Admin - Utilisateurs",
  "/admin/tickets": "LOOM Admin - Tickets",
  "/privacy-policy": "LOOM - Politique de confidentialité",
  "/terms": "LOOM - Conditions d'utilisation",
  "/unauthorized": "LOOM - Accès non autorisé"
};

// Composant qui force le rechargement complet à chaque navigation
function RouteReload() {
  const location = useLocation();
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    // Gestion des titres dynamiques pour les pages avec paramètres
    let pageTitle = PAGE_TITLES[location.pathname] || "LOOM - Les Ours Occitanie Méditerranée";
    
    // Gestion spéciale pour les pages avec slug
    if (location.pathname.startsWith("/articles/")) {
      pageTitle = "LOOM - Article";
    } else if (location.pathname.startsWith("/events/")) {
      pageTitle = "LOOM - Événement";
    }
    
    // Mise à jour du titre de la page
    document.title = pageTitle;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.location.href = location.pathname + location.search + location.hash;
  }, [location]);
  return null;
}

const App = () => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteReload />
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
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              
              {/* Protected User Routes */}
              <Route element={<RequireAuth />}>
                <Route path="/auth/profile" element={<Profile />} />
              </Route>
              
              {/* Admin Routes - Using RequireAuth and RequireAdmin as route wrappers */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route element={<RequireAuth />}>
                <Route element={<RequireAdmin />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/articles" element={<AdminArticles />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/gallery" element={<AdminGallery />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/tickets" element={<AdminTickets />} />
                </Route>
              </Route>
              
              {/* Privacy Policy and Terms Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
