import { useEffect, useState, useRef } from 'react';
import { Github, Linkedin, Send } from 'lucide-react';
import heroImage from '../assets/hero-developer.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const techIcons = [
    { name: 'JavaScript', position: 'top-20 left-20', color: 'from-yellow-400 to-orange-500', icon: '⚡' },
    { name: 'TypeScript', position: 'top-32 right-24', color: 'from-blue-600 to-blue-700', icon: '📘' },
    { name: 'React', position: 'bottom-32 left-16', color: 'from-cyan-400 to-blue-500', icon: '⚛️' },
    { name: 'CSS', position: 'bottom-20 right-20', color: 'from-pink-400 to-purple-500', icon: '🎨' },
    { name: 'Python', position: 'top-40 left-1/2', color: 'from-blue-500 to-indigo-600', icon: '🐍' },
    { name: 'HTML', position: 'bottom-40 right-1/3', color: 'from-orange-500 to-red-500', icon: '🌐' },
  ];

  const parallaxTransform = (speed: number) => ({
    transform: `translateY(${scrollY * speed}px)`
  });

  const mouseTransform = (sensitivity: number) => ({
    transform: `translate(${(mousePosition.x - window.innerWidth / 2) * sensitivity}px, ${(mousePosition.y - window.innerHeight / 2) * sensitivity}px)`
  });

  const create3DTransform = (x: number, y: number, z: number, rotateX: number, rotateY: number) => ({
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transformStyle: 'preserve-3d'
  });

  return (
    <section 
      ref={heroRef}
      id="about" 
      className="min-h-screen flex items-center justify-center bg-hero relative overflow-hidden perspective-2000"
    >
      {/* Enhanced Background decorations with 3D parallax */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-mint/10 rounded-full blur-3xl animate-3d-float transition-all duration-1000 transform-gpu"
          style={{
            ...mouseTransform(0.02),
            ...parallaxTransform(0.1),
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue/5 rounded-full blur-3xl animate-3d-float transition-all duration-1000 transform-gpu"
          style={{ 
            animationDelay: '2s',
            ...mouseTransform(-0.01),
            ...parallaxTransform(-0.15),
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-mint/5 via-blue/5 to-mint/5 rounded-full blur-3xl animate-aurora-glow transition-all duration-1500 transform-gpu"
          style={{
            ...mouseTransform(0.015),
            ...parallaxTransform(0.05),
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Additional ambient elements with 3D effects */}
        <div 
          className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-blue/3 to-mint/3 rounded-full blur-2xl animate-3d-scale transition-all duration-2000 transform-gpu"
          style={{
            animationDelay: '3s',
            ...parallaxTransform(-0.08),
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-mint/3 to-blue/3 rounded-full blur-2xl animate-3d-wave transition-all duration-2000 transform-gpu"
          style={{
            animationDelay: '1s',
            ...parallaxTransform(0.12),
            transformStyle: 'preserve-3d'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Enhanced Text Content with 3D animations */}
          <div 
            ref={textRef}
            className={`space-y-6 ${isVisible ? 'animate-slide-up' : ''} transform-gpu`}
            style={{
              ...parallaxTransform(-0.05),
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Hi, I'm{' '}
                <span 
                  className="text-gradient animate-glow hover:animate-magic-glow transition-all duration-500 cursor-pointer group relative inline-block transform-gpu hover-3d-lift"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  Jur'at
                  <div className="absolute -inset-2 bg-gradient-to-r from-mint/20 to-blue/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-muted-foreground font-light animate-fade-in transform-gpu" style={{ animationDelay: '0.3s' }}>
                Web Developer & AI Enthusiast
              </h2>
            </div>

            <p className="text-lg lg:text-xl text-foreground/80 leading-relaxed max-w-3xl animate-fade-in transform-gpu" style={{ animationDelay: '0.6s' }}>
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

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in transform-gpu" style={{ animationDelay: '0.9s' }}>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary flex items-center justify-center gap-2 group relative overflow-hidden btn-3d transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-mint/20 to-blue/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Send size={20} className="group-hover:animate-bounce transition-all duration-300 relative z-10" />
                <span className="relative z-10">Get In Touch</span>
              </button>
              <button
                onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline group relative overflow-hidden btn-3d transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-mint/10 to-blue/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 group-hover:animate-pulse">View My Work</span>
              </button>
            </div>

            {/* Enhanced Social Links with 3D effects */}
            <div className="flex gap-6 pt-2 animate-fade-in transform-gpu" style={{ animationDelay: '1.2s' }}>
              <a
                href="https://github.com/juratnortojiyev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-mint transition-all duration-300 hover:scale-110 transform hover:rotate-12 group relative inline-block hover-3d-spin transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-mint/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github size={24} className="group-hover:animate-bounce relative z-10" />
              </a>
              <a
                href="https://www.linkedin.com/in/jur-at-nortojiyev-5399b034a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue transition-all duration-300 hover:scale-110 transform hover:-rotate-12 group relative inline-block hover-3d-tilt transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-blue/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Linkedin size={24} className="group-hover:animate-pulse relative z-10" />
              </a>
              <a
                href="https://t.me/BiteWiseBot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-mint transition-all duration-300 hover:scale-110 transform hover:rotate-12 group relative inline-block hover-3d-spin transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-mint/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Send size={24} className="group-hover:animate-bounce relative z-10" />
              </a>
            </div>
          </div>

          {/* Enhanced Hero Image with advanced 3D effects */}
          <div 
            ref={imageRef}
            className={`relative ${isVisible ? 'animate-fade-in' : ''} transform-gpu`} 
            style={{ 
              animationDelay: '0.5s',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative group card-3d transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
              <img
                src={heroImage}
                alt="Developer workspace with floating tech icons"
                className="w-full h-auto rounded-2xl shadow-elegant group-hover:shadow-aurora transition-all duration-500 group-hover:scale-105 relative z-10 transform-gpu"
                style={{
                  ...parallaxTransform(0.1),
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Enhanced Floating Tech Icons with 3D effects */}
              {techIcons.map((tech, index) => (
                <div
                  key={tech.name}
                  className={`absolute ${tech.position} transform -translate-x-1/2 -translate-y-1/2 animate-3d-float group-hover:animate-bounce transition-all duration-500 transform-gpu`}
                  style={{ 
                    animationDelay: `${index * 0.5}s`,
                    ...parallaxTransform(0.05 + index * 0.02),
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div 
                    className={`bg-gradient-to-r ${tech.color} backdrop-blur-sm border border-mint/20 rounded-lg px-3 py-2 text-sm font-medium text-white shadow-mint hover:shadow-aurora transition-all duration-300 hover:scale-110 relative group/icon transform-gpu hover-3d-lift`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span className="mr-2">{tech.icon}</span>
                    {tech.name}
                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
              
              {/* Enhanced Interactive Glow Effect with 3D */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mint/0 via-blue/0 to-mint/0 opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none" />
              
              {/* Floating particles around the image with 3D transforms */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-mint rounded-full animate-3d-bounce transform-gpu" 
                  style={{ 
                    animationDelay: '0s',
                    transformStyle: 'preserve-3d'
                  }} 
                />
                <div 
                  className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue rounded-full animate-3d-bounce transform-gpu" 
                  style={{ 
                    animationDelay: '1s',
                    transformStyle: 'preserve-3d'
                  }} 
                />
                <div 
                  className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-mint rounded-full animate-3d-bounce transform-gpu" 
                  style={{ 
                    animationDelay: '2s',
                    transformStyle: 'preserve-3d'
                  }} 
                />
                <div 
                  className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue rounded-full animate-3d-bounce transform-gpu" 
                  style={{ 
                    animationDelay: '3s',
                    transformStyle: 'preserve-3d'
                  }} 
                />
                <div 
                  className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-mint rounded-full animate-3d-bounce transform-gpu" 
                  style={{ 
                    animationDelay: '4s',
                    transformStyle: 'preserve-3d'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced floating elements with 3D parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-mint rounded-full animate-3d-float transform-gpu" 
          style={{ 
            animationDelay: '0s',
            ...parallaxTransform(0.08),
            transformStyle: 'preserve-3d'
          }} 
        />
        <div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue rounded-full animate-3d-float transform-gpu" 
          style={{ 
            animationDelay: '1s',
            ...parallaxTransform(-0.12),
            transformStyle: 'preserve-3d'
          }} 
        />
        <div 
          className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-mint rounded-full animate-3d-float transform-gpu" 
          style={{ 
            animationDelay: '2s',
            ...parallaxTransform(0.06),
            transformStyle: 'preserve-3d'
          }} 
        />
        <div 
          className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue rounded-full animate-3d-float transform-gpu" 
          style={{ 
            animationDelay: '3s',
            ...parallaxTransform(-0.09),
            transformStyle: 'preserve-3d'
          }} 
        />
      </div>
    </section>
  );
};

export default Hero;