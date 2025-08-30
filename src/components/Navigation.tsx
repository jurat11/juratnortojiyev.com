import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
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
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      // Press 'i' key to replay intro
      if (event.key === 'i' || event.key === 'I') {
        localStorage.removeItem('introSeen');
        window.location.reload();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume-placeholder.pdf';
    link.download = 'Jurat_Nortojiyev_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-aurora border-b border-mint/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div 
                className="text-2xl font-bold text-gradient cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => scrollToSection('about')}
              >
                Jur'at
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className={`nav-link relative ${
                  activeSection === 'about' ? 'text-mint' : ''
                }`}
              >
                About
                {activeSection === 'about' && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => scrollToSection('skills')}
                className={`nav-link relative ${
                  activeSection === 'skills' ? 'text-mint' : ''
                }`}
              >
                Skills
                {activeSection === 'skills' && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => scrollToSection('experience')}
                className={`nav-link relative ${
                  activeSection === 'experience' ? 'text-mint' : ''
                }`}
              >
                Experience
                {activeSection === 'experience' && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => scrollToSection('projects')}
                className={`nav-link relative ${
                  activeSection === 'projects' ? 'text-mint' : ''
                }`}
              >
                Projects
                {activeSection === 'projects' && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => scrollToSection('contact')}
                className={`nav-link relative ${
                  activeSection === 'contact' ? 'text-mint' : ''
                }`}
              >
                Contact
                {activeSection === 'contact' && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
                )}
              </button>
            </div>



            {/* Resume Download Button */}
            <button
              onClick={downloadResume}
              className="btn-outline flex items-center gap-2 group hover:scale-105 transition-all duration-300"
            >
              <Download size={16} className="group-hover:animate-bounce" />
              Resume
            </button>
          </div>
        </div>

        {/* Website Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-mint/10">
          <div 
            className="h-full bg-gradient-to-r from-mint to-blue transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>



      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button className="p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-mint/20 text-mint hover:bg-card/70 transition-all duration-300 hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Navigation;