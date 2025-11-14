import { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

// Throttle function for performance
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isInHero, setIsInHero] = useState(true);

  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Hide navbar when in hero section (first 70% of viewport height, matching hero fade threshold)
      const fadeThreshold = heroHeight * 0.7;
      setIsInHero(scrollY < fadeThreshold);
      setIsScrolled(scrollY > 50);

      const sections = ['about', 'experience', 'projects', 'blog', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    }, 100), // Throttle to 100ms for better performance
    []
  );

  useEffect(() => {
    // Initialize on mount
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    const fadeThreshold = heroHeight * 0.7;
    setIsInHero(scrollY < fadeThreshold);
    setIsScrolled(scrollY > 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === 'about') {
      navigate('/');
    } else {
      navigate(`/${sectionId}`);
    }
  }, [navigate]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isInHero 
        ? 'opacity-0 pointer-events-none' 
        : isScrolled 
          ? 'opacity-100 bg-background/80 backdrop-blur-md border-b border-gray-200' 
          : 'opacity-100 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-xl font-display font-bold text-foreground cursor-pointer hover:text-red transition-colors duration-300"
            onClick={() => navigate('/')}
          >
            Jurat
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className={`nav-link ${
                activeSection === 'about' ? 'text-foreground' : ''
              }`}
            >
              About
            </button>
            
            <button
              onClick={() => scrollToSection('experience')}
              className={`nav-link ${
                activeSection === 'experience' ? 'text-foreground' : ''
              }`}
            >
              Experience
            </button>
            
            <button
              onClick={() => scrollToSection('projects')}
              className={`nav-link ${
                activeSection === 'projects' ? 'text-foreground' : ''
              }`}
            >
              Projects
            </button>
            
            <button
              onClick={() => scrollToSection('blog')}
              className={`nav-link ${
                activeSection === 'blog' ? 'text-foreground' : ''
              }`}
            >
              Blog
            </button>
            
            <button
              onClick={() => scrollToSection('contact')}
              className={`nav-link ${
                activeSection === 'contact' ? 'text-foreground' : ''
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-foreground hover:text-red transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navigation);
