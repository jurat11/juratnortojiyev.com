import { useEffect, useState, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  skills: string[];
  github?: string;
  live?: string;
  created_at: string;
  updated_at: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from the backend API
        const response = await fetch('http://localhost:3001/api/projects');
        
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
        // Fallback to empty array
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

  const handleProjectNameClick = (project: Project) => {
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
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : ''}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            My <span className="text-gradient">Projects</span>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-card/20 backdrop-blur-sm border border-mint/10 rounded-xl overflow-hidden hover:border-mint/30 transition-all duration-300 hover:bg-card/30 card-3d hover-3d-lift ${
                  isVisible ? 'animate-slide-up' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Project Image - Made Bigger */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 
                      className={`text-xl font-bold transition-all duration-300 ${
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
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue/20 text-blue hover:bg-blue/40 transition-all duration-300 hover:scale-110"
                        title="View Project"
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Skills Used */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs bg-mint/10 text-mint px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Project Links - Only GitHub, no Live Demo button */}
                  {project.github && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleProjectClick(project.github!)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={16} />
                        GitHub
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '1s' }}>
          <div className="bg-card/20 backdrop-blur-sm border border-mint/10 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-mint mb-4">Have a Project in Mind?</h3>
            <p className="text-muted-foreground mb-6">
              Let's collaborate and bring your ideas to life.
            </p>
            <a 
              href="#contact" 
              className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              Get In Touch
              <span className="group-hover:animate-bounce">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;