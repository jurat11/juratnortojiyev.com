import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Portfolio from '../components/Portfolio';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CreativeBackground from '../components/CreativeBackground';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrollTo state from navigation (e.g., when coming back from blog detail)
    if (location.state?.scrollTo) {
      const sectionToScroll = location.state.scrollTo;
      console.log('🎯 Scrolling to section from state:', sectionToScroll);
      
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
      console.log('Hash change detected:', hash);
      if (hash) {
        const element = document.querySelector(hash);
        console.log('Element found:', element);
        if (element) {
          // Add a small delay to ensure the page is fully rendered
          setTimeout(() => {
            console.log('Scrolling to element:', hash);
            element.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      console.log('Initial hash detected:', window.location.hash);
      setTimeout(handleHashChange, 300);
    } else {
      console.log('No initial hash detected');
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
    console.log('🔍 Route change detected! Current pathname:', location.pathname);
    if (location.pathname !== '/') {
      // Extract section name from path (e.g., /experience -> experience)
      const section = location.pathname.substring(1);
      console.log('🎯 Navigating to section:', section);
      
      // Try to scroll immediately, then retry after a delay
      const scrollToSection = () => {
        const element = document.getElementById(section);
        console.log('🔍 Looking for element with ID:', section);
        console.log('✅ Element found:', element);
        if (element) {
          console.log('🚀 Scrolling to section:', section);
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        } else {
          console.log('❌ Section not found:', section);
          // List all available section IDs for debugging
          const allSections = ['experience', 'projects', 'blog', 'contact'];
          allSections.forEach(id => {
            const el = document.getElementById(id);
            console.log(`📋 Section ${id}:`, el ? '✅ found' : '❌ not found');
          });
          return false;
        }
      };
      
      // Try immediately
      if (!scrollToSection()) {
        console.log('⏳ First attempt failed, trying again in 200ms...');
        // If not found, try after a shorter delay
        setTimeout(() => {
          if (!scrollToSection()) {
            console.log('⏳ Second attempt failed, trying again in 300ms...');
            // If still not found, try after a longer delay
            setTimeout(scrollToSection, 300);
          }
        }, 200);
      }
    } else {
      console.log('🏠 On home page, no section to scroll to');
    }
  }, [location.pathname]);

  console.log('Rendering Index component');

  return (
    <div className="min-h-screen bg-background">
      <CreativeBackground />
      <Navigation />
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
