import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./components/AdminPanel";
import BlogDetail from "./components/BlogDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Performance monitoring component
const PerformanceMonitor = () => {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Log performance issues
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}. Performance may be degraded.`);
        }
        
        // Check memory usage
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
          const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
          
          if (usedMB > 100) {
            console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
          }
        }
      }
      
      requestAnimationFrame(measurePerformance);
    };

    requestAnimationFrame(measurePerformance);

    // Monitor for potential memory leaks
    const checkMemoryLeaks = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        
        if (usedMB > 200) {
          console.error(`Critical memory usage: ${usedMB}MB. Consider refreshing the page.`);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(checkMemoryLeaks);
    };
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PerformanceMonitor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/skills" element={<Index />} />
          <Route path="/experience" element={<Index />} />
          <Route path="/projects" element={<Index />} />
          <Route path="/blog" element={<Index />} />
          <Route path="/contact" element={<Index />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          {/* Test route to verify routing is working */}
          <Route path="/test" element={<div>Test route working!</div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
