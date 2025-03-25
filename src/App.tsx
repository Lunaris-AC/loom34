
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

const queryClient = new QueryClient();

// HelloAsso URLs
const SHOP_URL = "https://www.helloasso.com/associations/your-association/boutiques/shop";
const MEMBERSHIP_URL = "https://www.helloasso.com/associations/your-association/adhesions/membership";

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
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Main Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/monsieur-ours" element={<MonsieurOurs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/partners" element={<Partners />} />
              
              {/* External Redirects */}
              <Route path="/shop" element={
                <Navigate to={SHOP_URL} replace />
              } />
              <Route path="/membership" element={
                <Navigate to={MEMBERSHIP_URL} replace />
              } />
              
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
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
