import { useEffect, useState, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import heroImage from '../assets/hero-developer.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastScrollTime = useRef(0);
  const lastMouseTime = useRef(0);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current > 16) { // ~60fps
      lastScrollTime.current = now;
      setScrollY(window.scrollY);
    }
  }, []);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMouseTime.current > 32) { // ~30fps for mouse
      lastMouseTime.current = now;
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
    
    // Use passive listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleScroll]);

  // Simplified transforms to reduce performance impact
  const parallaxTransform = useCallback((speed: number) => {
    if (Math.abs(scrollY * speed) > 100) return {}; // Limit extreme values
    return {
      transform: `translateY(${scrollY * speed * 0.1}px)` // Reduced intensity
    };
  }, [scrollY]);

  const mouseTransform = useCallback((sensitivity: number) => {
    const maxOffset = 20; // Limit mouse movement effect
    const x = Math.max(-maxOffset, Math.min(maxOffset, (mousePosition.x - window.innerWidth / 2) * sensitivity));
    const y = Math.max(-maxOffset, Math.min(maxOffset, (mousePosition.y - window.innerHeight / 2) * sensitivity));
    return {
      transform: `translate(${x}px, ${y}px)`
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <section 
      ref={heroRef}
      id="about" 
      className="min-h-screen flex items-center justify-center bg-hero relative overflow-hidden"
    >
      {/* Simplified Background decorations */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-mint/10 rounded-full blur-2xl animate-pulse transition-all duration-2000"
          style={{
            ...mouseTransform(0.01),
            ...parallaxTransform(0.05)
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue/5 rounded-full blur-2xl animate-pulse transition-all duration-3000"
          style={{ 
            animationDelay: '1s',
            ...mouseTransform(-0.005),
            ...parallaxTransform(-0.08)
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-mint/5 via-blue/5 to-mint/5 rounded-full blur-xl animate-pulse transition-all duration-4000"
          style={{
            ...mouseTransform(0.008),
            ...parallaxTransform(0.03)
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Text Content */}
          <div 
            ref={textRef}
            className={`space-y-4 lg:space-y-6 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
                Hi, I'm{' '}
                <span 
                  className="text-gradient cursor-pointer group relative inline-block hover:scale-105 transition-all duration-300 animate-pulse mobile-glow"
                >
                  Nortojiyev Jur'at
                  <div className="absolute -inset-2 bg-gradient-to-r from-mint/20 to-blue/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </span>
              </h1>
              <h2 
                className="text-lg sm:text-xl lg:text-3xl text-muted-foreground font-light transition-all duration-1000 ease-out animate-gentle-glow" 
                style={{ 
                  transitionDelay: '0.3s',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                Web Developer & AI Enthusiast
              </h2>
            </div>

            <p 
              className="text-sm sm:text-base lg:text-xl text-foreground/80 leading-relaxed max-w-3xl transition-all duration-1000 ease-out" 
              style={{ 
                transitionDelay: '0.6s',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              I move with fire that refuses silence, and with depth that drags thought into places most fear to enter.
              <br />
              By day, I'm a high school student, but my hands are already shaping code, building systems, tearing apart problems most would rather leave untouched.
              <br />
              My vision cuts beyond the surface — not just apps or projects, but questions of why we build at all, and what survives the erosion of time.
              <br />
              I stand in defiance of the ordinary, unmoved by limits, unshaken by resistance — whether in research, in startups, or in the philosophies I wrestle with long past midnight.
              <br />
              I lead not because I chase power, but because chaos demands order, and I will not stand still.
              <br />
              What I create is not a project — it is an argument with the future.
              <br />
              What I build is not for now, but for the test of eternity.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-3 lg:gap-4 transition-all duration-1000 ease-out" 
              style={{ 
                transitionDelay: '0.9s',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary flex items-center justify-center gap-2 group relative overflow-hidden text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 mobile-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-mint/20 to-blue/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Send size={16} className="sm:w-5 sm:h-5 group-hover:animate-bounce transition-all duration-300 relative z-10" />
                <span className="relative z-10">Get In Touch</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            ref={imageRef}
            className={`relative transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} 
            style={{ transitionDelay: '0.5s' }}
          >
            <div className="relative group">
              <img
                src={heroImage}
                alt="Developer workspace"
                className="w-full h-auto rounded-xl lg:rounded-2xl shadow-elegant group-hover:shadow-aurora transition-all duration-500 group-hover:scale-105 relative z-10"
                style={{
                  ...parallaxTransform(0.05)
                }}
              />
              
              {/* Enhanced hover effect */}
              <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-br from-mint/0 via-blue/0 to-mint/0 opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none" />
              
              {/* Mobile-specific floating elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-mint rounded-full animate-pulse lg:hidden" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue rounded-full animate-pulse lg:hidden" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;