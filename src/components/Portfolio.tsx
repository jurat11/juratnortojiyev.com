import { useEffect, useState, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { supabase, Project as ProjectType } from '../lib/supabase';

const Portfolio = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from Supabase
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (link: string) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProjectNameClick = (project: ProjectType) => {
    // Prioritize live demo link, then GitHub link
    if (project.live && project.live.trim() !== '') {
      handleProjectClick(project.live);
    } else if (project.github && project.github.trim() !== '') {
      handleProjectClick(project.github);
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="projects" className="py-20 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Projects</span>
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} id="projects" className="py-20 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-red-500">Error loading projects. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="projects" className="py-20 bg-surface relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-mint/3 rounded-full blur-3xl animate-float transition-all duration-2000" 
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue/3 rounded-full blur-3xl animate-float transition-all duration-2000" 
          style={{ 
            animationDelay: '2s', 
            transform: `translateY(${scrollY * -0.15}px)`
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{fontFamily: "'EB Garamond', serif"}}>
            My <span className="text-gradient">Projects and Activities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing my work and technical expertise
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-card/20 backdrop-blur-sm border border-mint/10 rounded-xl overflow-hidden hover:border-mint/30 hover:shadow-mint transition-all duration-300 hover:bg-card/30 card-3d hover-3d-lift transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 0.2}s`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Project Image - Responsive Height */}
                <div className="relative h-48 md:h-64 overflow-hidden group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 group-hover:to-transparent transition-all duration-500" />
                </div>

                {/* Project Content */}
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 
                      className={`text-lg md:text-xl font-bold transition-all duration-300 ${
                        (project.live || project.github) 
                          ? 'text-mint cursor-pointer hover:text-blue hover:scale-105' 
                          : 'text-foreground'
                      }`}
                      onClick={() => (project.live || project.github) && handleProjectNameClick(project)}
                      title={(project.live || project.github) ? "Click to view project" : ""}
                    >
                      {project.title}
                    </h3>
                    {(project.github || project.live) && (
                      <button
                        onClick={() => {
                          if (project.live) {
                            handleProjectClick(project.live);
                          } else if (project.github) {
                            handleProjectClick(project.github);
                          }
                        }}
                        className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue/20 text-blue hover:bg-blue/40 transition-all duration-300 hover:scale-110"
                        title="View Project"
                      >
                        <ExternalLink size={14} className="md:w-4 md:h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                    {project.description}
                  </p>

                  {/* Skills Used */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {project.skills.split(',').map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs bg-mint/10 text-mint px-2 py-1 rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Project Links - Only GitHub, no Live Demo button */}
                  {project.github && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleProjectClick(project.github!)}
                        className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={14} className="md:w-4 md:h-4" />
                        GitHub
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </section>
  );
};

export default Portfolio;