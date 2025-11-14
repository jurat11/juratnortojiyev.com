import { useEffect, useState, useCallback, memo } from 'react';
import { ArrowDown } from 'lucide-react';
import heroImage from '/uploads/Jurat unlock.png';
import bgImage from '/uploads/chicago.jpg';

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

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(
    throttle(() => {
      setScrollY(window.scrollY);
    }, 16), // ~60fps
    []
  );

  // Throttled resize handler
  const handleResize = useCallback(
    throttle(() => {
      setViewportHeight(window.innerHeight);
    }, 100),
    []
  );

  useEffect(() => {
    setIsVisible(true);
    setViewportHeight(window.innerHeight);
    setScrollY(window.scrollY); // Initialize scroll position
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);
  
  // Calculate fade threshold: 70% of viewport height
  const fadeThreshold = viewportHeight * 0.7;
  const isInHeroView = scrollY < fadeThreshold;
  
  // Update isVisible when scrolling back into hero view
  useEffect(() => {
    if (isInHeroView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInHeroView, isVisible]);

  return (
    <>
      {/* Fixed Background Image - stays in place like Dandy Weng */}
      <div 
        className="fixed inset-0 w-full h-screen z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content overlay that scrolls away */}
      <section 
        id="about" 
        className="relative min-h-screen flex items-center justify-center z-10"
        style={{
          opacity: isInHeroView ? Math.max(0, 1 - scrollY / fadeThreshold) : 0,
          transform: isInHeroView ? `translateY(${scrollY * 0.5}px)` : 'translateY(0px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        }}
      >
        {/* Semi-transparent overlay for text readability */}
        <div 
          className="absolute inset-0 bg-white/60 backdrop-blur-md"
          style={{
            opacity: isInHeroView ? Math.max(0, 1 - scrollY / (fadeThreshold * 0.8)) : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
          {/* Hero Image - Circular, centered */}
          <div 
            className="mb-12"
            style={{
              transform: isInHeroView 
                ? `translateY(${scrollY * 0.2}px) scale(${Math.max(0.5, 1 - scrollY / fadeThreshold)})`
                : 'translateY(0px) scale(0.5)',
              opacity: isInHeroView ? Math.max(0, 1 - scrollY / fadeThreshold) : 0,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
            <div className="relative inline-block">
              <img
                src={heroImage}
                alt="Jurat Nortojiev - Developer, Thinker, Questioner"
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-2 border-gray-200 shadow-lg"
                loading="eager"
                width="224"
                height="224"
              />
            </div>
          </div>

          {/* Name */}
          <div 
            className="mb-6"
            style={{ 
              transform: isInHeroView ? `translateY(${scrollY * 0.15}px)` : 'translateY(0px)',
              opacity: isInHeroView ? Math.max(0, 1 - scrollY / fadeThreshold) : 0,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold mb-3" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Jurat Nortojiev
          </h1>
          </div>

          {/* Subtitle */}
          <div 
            className="mb-12"
            style={{ 
              transform: isInHeroView ? `translateY(${scrollY * 0.1}px)` : 'translateY(0px)',
              opacity: isInHeroView ? Math.max(0, 1 - scrollY / fadeThreshold) : 0,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
          <p className="text-lg sm:text-xl font-garamond font-light" style={{ color: '#000000' }}>
            developer, thinker, questioner
          </p>
          <p className="text-base sm:text-lg mt-2 font-garamond font-light" style={{ color: '#000000' }}>
            based nowhere and everywhere
          </p>
          </div>

          {/* Scroll indicator */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            style={{ 
              opacity: isInHeroView ? Math.max(0, 1 - scrollY / (fadeThreshold * 0.5)) : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(Hero);
