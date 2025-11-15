import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-query', '@supabase/supabase-js'],
    exclude: ['@tanstack/react-query-devtools'], // Exclude dev tools in production
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - keep React in main bundle to avoid loading order issues
          if (id.includes('node_modules')) {
            // Don't split React - keep it with main bundle for proper loading
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler/')) {
              return undefined; // Keep in main bundle
            }
            // React Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Radix UI components - split by usage
            if (id.includes('@radix-ui')) {
              // Split frequently used Radix components
              if (id.includes('@radix-ui/react-toast') || id.includes('@radix-ui/react-tooltip')) {
                return 'radix-core';
              }
              return 'radix-vendor';
            }
            // Data libraries
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'data-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    // Minification and optimization (esbuild is faster and included by default)
    minify: 'esbuild',
    // Source maps for production (disabled for smaller builds)
    sourcemap: false,
    // Optimize asset inlining
    assetsInlineLimit: 4096, // 4kb
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for smaller bundle
    target: 'es2020', // Updated for better tree-shaking
    // Report compressed size
    reportCompressedSize: true,
    // Enable terser for better compression (optional, esbuild is faster)
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
}));
