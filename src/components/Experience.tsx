import { useEffect, useState, useRef } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface Experience {
  id: number;
  period: string;
  company: string;
  job_title: string;
  status: string;
  description: string;
  link: string;
  created_at: string;
  updated_at: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from the backend API
        const response = await fetch('http://localhost:3001/api/experiences');
        
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        } else {
          throw new Error('Failed to fetch experiences');
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('Failed to load experiences');
        // Fallback to empty array
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleCompanyClick = (link: string) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="experience" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Experience</span>
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
      <section ref={sectionRef} id="experience" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-red-500">Error loading experiences. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="experience" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : ''}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            My <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A journey through my professional development and key contributions
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No experiences found.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-mint via-blue to-transparent"></div>

            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } ${isVisible ? 'animate-slide-up' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-6">
                    <div className={`w-4 h-4 rounded-full border-4 border-background ${
                      experience.status === 'current' ? 'bg-mint animate-glow' : 'bg-blue'
                    }`}></div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <div className="card-gradient rounded-xl p-6 shadow-elegant hover:shadow-cyan transition-all duration-300">
                      <div className="flex flex-wrap items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {experience.job_title}
                          </h3>
                          <h4 
                            className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                              experience.link && experience.link.trim() !== '' 
                                ? 'text-mint cursor-pointer hover:text-blue hover:scale-105' 
                                : 'text-mint'
                            }`}
                            onClick={() => experience.link && experience.link.trim() !== '' && handleCompanyClick(experience.link)}
                          >
                            {experience.company}
                            {experience.link && experience.link.trim() !== '' && (
                              <span className="ml-2 text-sm opacity-70">🔗</span>
                            )}
                          </h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          experience.status === 'current' 
                            ? 'bg-mint/20 text-mint' 
                            : 'bg-blue/20 text-blue'
                        }`}>
                          {experience.status === 'current' ? 'Current' : 'Past'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span className="text-sm">{experience.period}</span>
                        </div>
                        {experience.link && experience.link.trim() !== '' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCompanyClick(experience.link)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 hover:scale-105 transition-all duration-300"
                            >
                              <ExternalLink size={16} />
                              View Company
                            </button>
                          </div>
                        )}
                      </div>

                      {experience.description && (
                        <div className="space-y-2">
                          {experience.description.split('. ').filter(point => point.trim()).map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="text-foreground/80 flex items-start gap-3"
                            >
                              <div className="w-1.5 h-1.5 bg-mint rounded-full mt-2 flex-shrink-0"></div>
                              <span>{point.trim()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        <div className={`mt-20 ${isVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '1.5s' }}>
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Education & Achievements</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-gradient rounded-xl p-6">
              <h4 className="text-xl font-bold text-mint mb-3">Education</h4>
              <p className="text-foreground mb-2">High School Diploma</p>
              <p className="text-muted-foreground">Public School • 2015 - 2026</p>
            </div>

            <div className="card-gradient rounded-xl p-6">
              <h4 className="text-xl font-bold text-mint mb-3">Languages</h4>
              <div className="space-y-2">
                <p className="text-foreground">Uzbek <span className="text-muted-foreground">(Native)</span></p>
                <p className="text-foreground">Russian <span className="text-muted-foreground">(Native)</span></p>
                <p className="text-foreground">English <span className="text-muted-foreground">(Professional)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;