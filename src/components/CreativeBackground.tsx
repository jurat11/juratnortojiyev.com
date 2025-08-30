import { useEffect, useState, useCallback, useRef } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'floating' | 'magnetic' | 'energy' | 'cosmic' | 'quantum';
  rotation: number;
  scale: number;
  life: number;
  maxLife: number;
  z: number;
}

const CreativeBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const colors = [
    'from-mint/30 via-blue/20 to-mint/30',
    'from-blue/30 via-mint/20 to-blue/30',
    'from-mint/20 via-blue/10 to-mint/20',
    'from-blue/20 via-mint/10 to-blue/20',
    'from-mint/40 via-blue/30 to-mint/40'
  ];

  const createParticle = useCallback((): Particle => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    
    switch (side) {
      case 0: // top
        x = Math.random() * windowSize.width;
        y = -50;
        vx = (Math.random() - 0.5) * 0.3;
        vy = Math.random() * 0.4 + 0.1;
        break;
      case 1: // right
        x = windowSize.width + 50;
        y = Math.random() * windowSize.height;
        vx = -(Math.random() * 0.4 + 0.1);
        vy = (Math.random() - 0.5) * 0.3;
        break;
      case 2: // bottom
        x = Math.random() * windowSize.width;
        y = windowSize.height + 50;
        vx = (Math.random() - 0.5) * 0.3;
        vy = -(Math.random() * 0.4 + 0.1);
        break;
      default: // left
        x = -50;
        y = Math.random() * windowSize.height;
        vx = Math.random() * 0.4 + 0.1;
        vy = (Math.random() - 0.5) * 0.3;
    }

    const types: Particle['type'][] = ['floating', 'magnetic', 'energy', 'cosmic', 'quantum'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      vx,
      vy,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
      life: 0,
      maxLife: 10000 + Math.random() * 15000,
      z: Math.random() * 100
    };
  }, [windowSize]);

  const updateParticles = useCallback(() => {
    setParticles(prev => 
      prev.map(particle => {
        let newVx = particle.vx;
        let newVy = particle.vy;
        let newRotation = particle.rotation;
        let newScale = particle.scale;
        let newOpacity = particle.opacity;
        let newZ = particle.z;
        
        // Advanced particle behavior based on type with 3D movement
        switch (particle.type) {
          case 'magnetic':
            if (isHovering) {
              const dx = mousePosition.x - particle.x;
              const dy = mousePosition.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > 0 && distance < 300) {
                const force = 0.0008;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
                newZ += Math.sin(Date.now() * 0.01) * 2;
              }
            }
            newRotation += 2;
            newZ += Math.sin(Date.now() * 0.005) * 1;
            break;
          
          case 'energy':
            newVx *= 1.01;
            newVy *= 1.01;
            newScale = 0.8 + Math.sin(Date.now() * 0.01) * 0.3;
            newOpacity = Math.abs(Math.sin(Date.now() * 0.008)) * 0.5 + 0.2;
            newZ += Math.cos(Date.now() * 0.008) * 3;
            break;
          
          case 'cosmic':
            newRotation += 1.5;
            newScale = 0.6 + Math.sin(Date.now() * 0.005 + particle.id.charCodeAt(0)) * 0.4;
            newOpacity = 0.3 + Math.sin(Date.now() * 0.003 + particle.id.charCodeAt(1)) * 0.2;
            newZ += Math.sin(Date.now() * 0.003 + particle.id.charCodeAt(2)) * 2;
            break;
          
          case 'quantum':
            if (Math.random() < 0.001) {
              newVx *= -1;
              newVy *= -1;
            }
            newRotation += 3;
            newScale = 0.7 + Math.sin(Date.now() * 0.012) * 0.3;
            newZ += Math.random() * 4 - 2;
            break;
          
          default: // floating
            newRotation += 0.5;
            newScale = 0.8 + Math.sin(Date.now() * 0.006 + particle.id.charCodeAt(2)) * 0.2;
            newZ += Math.sin(Date.now() * 0.004) * 1.5;
        }
        
        return {
          ...particle,
          x: particle.x + newVx,
          y: particle.y + newVy,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          scale: newScale,
          opacity: newOpacity,
          life: particle.life + 16,
          z: newZ
        };
      }).filter(particle => {
        // Remove particles that are out of bounds or expired
        const inBounds = particle.x > -100 && particle.x < windowSize.width + 100 &&
                        particle.y > -100 && particle.y < windowSize.height + 100;
        const alive = particle.life < particle.maxLife;
        return inBounds && alive;
      })
    );
  }, [mousePosition, isHovering, windowSize]);

  const addNewParticles = useCallback(() => {
    if (particles.length < 80) {
      setParticles(prev => [...prev, createParticle()]);
    }
  }, [particles.length, createParticle]);

  // Mouse and scroll event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
      setTimeout(() => setIsHovering(false), 200);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Set initial window size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Canvas animation loop with 3D perspective
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort particles by Z-depth for proper 3D layering
      const sortedParticles = [...particles].sort((a, b) => a.z - b.z);
      
      // Draw advanced particle effects with 3D perspective
      sortedParticles.forEach(particle => {
        ctx.save();
        
        // Apply 3D perspective scaling based on Z position
        const perspective = 1 + (particle.z / 200);
        const scale = particle.scale * perspective;
        
        ctx.globalAlpha = particle.opacity * perspective;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        
        // Create gradient for each particle with 3D depth
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * perspective);
        
        switch (particle.type) {
          case 'energy':
            gradient.addColorStop(0, `rgba(15, 252, 190, ${0.8 * perspective})`);
            gradient.addColorStop(0.5, `rgba(16, 110, 190, ${0.4 * perspective})`);
            gradient.addColorStop(1, `rgba(15, 252, 190, 0)`);
            break;
          case 'cosmic':
            gradient.addColorStop(0, `rgba(16, 110, 190, ${0.6 * perspective})`);
            gradient.addColorStop(0.7, `rgba(15, 252, 190, ${0.3 * perspective})`);
            gradient.addColorStop(1, `rgba(16, 110, 190, 0)`);
            break;
          case 'quantum':
            gradient.addColorStop(0, `rgba(15, 252, 190, ${0.7 * perspective})`);
            gradient.addColorStop(0.3, `rgba(16, 110, 190, ${0.5 * perspective})`);
            gradient.addColorStop(0.7, `rgba(15, 252, 190, ${0.3 * perspective})`);
            gradient.addColorStop(1, `rgba(16, 110, 190, 0)`);
            break;
          default:
            gradient.addColorStop(0, `rgba(15, 252, 190, ${0.5 * perspective})`);
            gradient.addColorStop(0.5, `rgba(16, 110, 190, ${0.3 * perspective})`);
            gradient.addColorStop(1, `rgba(15, 252, 190, 0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * perspective, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles]);

  // Particle management
  useEffect(() => {
    const interval = setInterval(updateParticles, 16);
    return () => clearInterval(interval);
  }, [updateParticles]);

  useEffect(() => {
    const interval = setInterval(addNewParticles, 100);
    return () => clearInterval(interval);
  }, [addNewParticles]);

  // Initialize particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);
  }, [createParticle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-2000">
      {/* Canvas for advanced 3D particle rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transform-gpu"
        width={windowSize.width}
        height={windowSize.height}
        style={{ transformStyle: 'preserve-3d' }}
      />
      
      {/* Interactive 3D Glow Effect */}
      {isHovering && (
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-mint/8 via-blue/6 to-mint/8 rounded-full blur-3xl transition-all duration-700 pointer-events-none transform-gpu"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            transform: 'translate3d(0, 0, 50px)',
            transformStyle: 'preserve-3d'
          }}
        />
      )}
      
      {/* Enhanced 3D Parallax Light Rays */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-mint/8 to-transparent animate-pulse transition-transform duration-1000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.1}px, 20px)`,
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue/8 to-transparent animate-pulse transition-transform duration-1000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * -0.15}px, 40px)`,
            animationDelay: '1s',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-mint/6 to-transparent animate-pulse transition-transform duration-1000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.2}px, 60px)`,
            animationDelay: '2s',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>
      
      {/* Enhanced 3D Floating Geometric Shapes */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/6 w-32 h-32 border border-mint/10 rounded-full animate-3d-float transition-all duration-2000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.05}px, 30px) rotateY(${scrollY * 0.02}deg)`,
            animationDelay: '0s',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute top-3/4 right-1/6 w-24 h-24 border border-blue/10 rounded-lg animate-3d-scale transition-all duration-2000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * -0.08}px, 50px) rotateX(${scrollY * -0.03}deg)`,
            animationDelay: '2s',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-20 h-20 border border-mint/8 transform rotate-45 animate-3d-wave transition-all duration-2000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.12}px, 70px) rotateZ(${scrollY * 0.01}deg)`,
            animationDelay: '4s',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>
      
      {/* Enhanced 3D Ambient Energy Fields */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-mint/3 via-blue/2 to-mint/3 rounded-full blur-3xl animate-aurora-glow transition-all duration-3000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.03}px, 80px) scale(${1 + Math.sin(Date.now() * 0.001) * 0.1})`,
            animationDelay: '1s',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-blue/3 via-mint/2 to-blue/3 rounded-full blur-3xl animate-aurora-glow transition-all duration-3000 transform-gpu"
          style={{ 
            transform: `translate3d(0, ${scrollY * -0.04}px, 100px) scale(${1 + Math.sin(Date.now() * 0.0015) * 0.1})`,
            animationDelay: '3s',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>
    </div>
  );
};

export default CreativeBackground;
