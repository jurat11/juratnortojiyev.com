
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy components
const AllBlogs = lazy(() => import("./pages/AllBlogs"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const BlogDetail = lazy(() => import("./components/BlogDetail"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red mx-auto mb-4" style={{ borderColor: '#A0332B' }}></div>
      <p className="text-muted-foreground font-garamond" style={{ color: '#000000' }}>Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Performance monitoring component (development only)
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development
    if (import.meta.env.PROD) return;
    
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/experience" element={<Index />} />
            <Route path="/projects" element={<Index />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog" element={<Index />} />
            <Route path="/blogs" element={<AllBlogs />} />
            <Route path="/contact" element={<Index />} />
            {/* Test route to verify routing is working */}
            <Route path="/test" element={<div>Test route working!</div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
