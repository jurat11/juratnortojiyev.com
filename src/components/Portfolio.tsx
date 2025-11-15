import { useEffect, useState, useRef, memo } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import { supabase, Project as ProjectType } from '../lib/supabase';

const Portfolio = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<number>>(new Set());
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
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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

  const handleProjectClick = (projectId: number) => {
    setExpandedProjectIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        // Don't toggle - just expand if not already expanded
        return newSet;
      } else {
        newSet.add(projectId);
        return newSet;
      }
    });
  };

  const handleCloseProject = (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProjectIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(projectId);
      return newSet;
    });
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (url && url.trim() !== '') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="projects" className="py-20 relative z-20" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Projects
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red border-t-transparent" style={{ borderColor: '#A0332B' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} id="projects" className="py-20 relative z-20" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Projects
            </h2>
            <p className="text-red-500 mt-4">Error loading projects. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="projects" className="py-20 relative z-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg font-garamond" style={{ color: '#000000' }}>No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const isExpanded = expandedProjectIds.has(project.id);
              return (
                <div
                  key={project.id}
                  className={`bg-card border border-gray-200 rounded-lg overflow-hidden hover:border-red/30 hover:shadow-md transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => handleProjectClick(project.id)}
                    className="w-full text-left"
                    disabled={isExpanded}
                  >
                    {/* Project Image */}
                    {project.image && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="192"
                          fetchpriority="low"
                        />
                      </div>
                    )}
                    
                    {/* Project Name */}
                    <div className="p-6">
                      <h3 className="text-xl font-garamond font-semibold" style={{ color: '#000000' }}>
                        {project.title}
                      </h3>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-200 relative">
                      {/* Close Button */}
                      <button
                        onClick={(e) => handleCloseProject(project.id, e)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
                        style={{ color: '#A0332B' }}
                        aria-label="Close project details"
                      >
                        <X size={20} />
                      </button>
                      {/* Project Image - 40% of original dimensions */}
                      {project.image && (
                        <div className="flex justify-center my-6">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-contain"
                            style={{ 
                              width: '40%', 
                              height: 'auto',
                              maxWidth: '100%',
                              maxHeight: '300px'
                            }}
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Project Description */}
                      <p className="font-garamond mb-4 leading-relaxed text-sm md:text-base" style={{ color: '#000000' }}>
                        {project.description}
                      </p>

                      {/* Skills Used */}
                      <div className="mb-4">
                        <h3 className="text-base font-garamond font-semibold mb-2" style={{ color: '#A0332B' }}>
                          Technologies Used
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.split(',').map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="text-xs px-2 py-1 rounded-full font-garamond"
                              style={{ backgroundColor: '#A0332B', color: '#FFFFFF' }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      {(project.github || project.live) && (
                        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                          {project.live && project.live.trim() !== '' && (
                            <button
                              onClick={(e) => handleExternalLink(project.live!, e)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-garamond font-semibold text-sm transition-all duration-300 hover:opacity-80"
                              style={{ 
                                color: '#FFFFFF', 
                                backgroundColor: '#A0332B',
                                border: '1px solid #A0332B'
                              }}
                            >
                              <ExternalLink size={16} />
                              <span>Live Demo</span>
                            </button>
                          )}
                          {project.github && project.github.trim() !== '' && (
                            <button
                              onClick={(e) => handleExternalLink(project.github!, e)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-garamond font-semibold text-sm transition-all duration-300 hover:opacity-80"
                              style={{ 
                                color: '#A0332B', 
                                border: '1px solid #A0332B'
                              }}
                            >
                              <Github size={16} />
                              <span>View Code</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Portfolio);
