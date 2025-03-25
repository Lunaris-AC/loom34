
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
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
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<RequireAuth><RequireAdmin><Navigate to="/admin/dashboard" /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/dashboard" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/articles" element={<RequireAuth><RequireAdmin><AdminArticles /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/events" element={<RequireAuth><RequireAdmin><AdminEvents /></RequireAdmin></RequireAuth>} />
              <Route path="/admin/gallery" element={<RequireAuth><RequireAdmin><AdminGallery /></RequireAdmin></RequireAuth>} />
              
              {/* These routes will be implemented in future iterations */}
              <Route path="/about" element={<NotFound />} />
              <Route path="/events" element={<NotFound />} />
              <Route path="/shop" element={<NotFound />} />
              <Route path="/monsieur-ours" element={<NotFound />} />
              <Route path="/gallery" element={<NotFound />} />
              <Route path="/partners" element={<NotFound />} />
              <Route path="/membership" element={<NotFound />} />
              
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
