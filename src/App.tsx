
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* These routes will be implemented in future iterations */}
            <Route path="/about" element={<NotFound />} />
            <Route path="/events" element={<NotFound />} />
            <Route path="/shop" element={<NotFound />} />
            <Route path="/monsieur-ours" element={<NotFound />} />
            <Route path="/gallery" element={<NotFound />} />
            <Route path="/partners" element={<NotFound />} />
            <Route path="/membership" element={<NotFound />} />
            <Route path="/login" element={<NotFound />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
