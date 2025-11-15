import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Portfolio from '../components/Portfolio';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CreativeBackground from '../components/CreativeBackground';

const Index = () => {
  const location = useLocation();

  // Update page title based on route
  useEffect(() => {
    const updateTitle = () => {
      const path = location.pathname;
      if (path === '/') {
        document.title = "Jurat Nortojiev | Developer, Thinker, Questioner | BiteWise & SATashkent";
      } else if (path === '/experience') {
        document.title = "Experience & Achievements | Jurat Nortojiev";
      } else if (path === '/projects') {
        document.title = "Projects | Jurat Nortojiev - BiteWise, SATashkent & More";
      } else if (path === '/blog') {
        document.title = "Blog | Jurat Nortojiev - Thoughts, Experiences, Insights";
      } else if (path === '/contact') {
        document.title = "Contact | Jurat Nortojiev";
      }
    };
    updateTitle();
  }, [location.pathname]);

  useEffect(() => {
    // Handle scrollTo state from navigation (e.g., when coming back from blog detail)
    if (location.state?.scrollTo) {
      const sectionToScroll = location.state.scrollTo;
      
      setTimeout(() => {
        const element = document.getElementById(sectionToScroll);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clear the state to prevent re-scrolling on re-renders
          window.history.replaceState({}, document.title);
        } else {
          // Fallback: smooth scroll to top if section not found
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location.state]);

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Add a small delay to ensure the page is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 300);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Also listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Handle route-based navigation to sections
  useEffect(() => {
    if (location.pathname !== '/') {
      // Extract section name from path (e.g., /experience -> experience)
      const section = location.pathname.substring(1);
      
      // Try to scroll immediately, then retry after a delay
      const scrollToSection = () => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };
      
      // Try immediately
      if (!scrollToSection()) {
        // If not found, try after a shorter delay
        setTimeout(() => {
          if (!scrollToSection()) {
            // If still not found, try after a longer delay
            setTimeout(scrollToSection, 300);
          }
        }, 200);
      }
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <CreativeBackground />
      <main>
        <Hero />
        <Experience />
        <Portfolio />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
