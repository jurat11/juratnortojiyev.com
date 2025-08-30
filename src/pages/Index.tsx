import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CreativeBackground from '../components/CreativeBackground';
import Intro from '../components/Intro';

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => {
    // Always show intro for now (you can change this later)
    return true;
  });

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 100);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('introSeen', 'true');
    setShowIntro(false);
    // Ensure we start at the top of the page
    window.scrollTo(0, 0);
    // Clear any hash from URL
    if (window.location.hash) {
      window.location.hash = '';
    }
  };

  console.log('showIntro state:', showIntro);
  console.log('Rendering Index component');
  
  if (showIntro) {
    console.log('Rendering Intro component');
    return <Intro onComplete={handleIntroComplete} />;
  }
  
  console.log('Rendering main website content');

  return (
    <div className="min-h-screen bg-background">
      <CreativeBackground />
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
