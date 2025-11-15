import { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Experience as ExperienceType } from '../lib/supabase';

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  // Use React Query for data fetching with caching
  const { data: experiences = [], isLoading, error } = useQuery<ExperienceType[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate items one by one with requestAnimationFrame for smoothness
          experiences.forEach((_, index) => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                setVisibleItems(prev => new Set([...prev, index]));
              }, index * 150); // Reduced delay for faster animation
            });
          });
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Optimized
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [experiences]);

  const handleCompanyClick = useCallback((link: string) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }, []);

  if (isLoading) {
    return (
      <section ref={sectionRef} id="experience" className="py-20 relative z-20" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Experience
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
      <section ref={sectionRef} id="experience" className="py-20 relative z-20" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Experience
            </h2>
            <p className="text-red-500 mt-4">Error loading experiences. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="experience" className="py-20 relative z-20" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Experience
          </h2>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg font-garamond" style={{ color: '#000000' }}>No experiences found.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5" style={{ backgroundColor: '#E0E0E0' }}></div>

            <div className="space-y-12">
              {experiences.map((experience, index) => {
                const isItemVisible = visibleItems.has(index);
                return (
                  <div
                    key={experience.id}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    style={{
                      opacity: isItemVisible ? 1 : 0,
                      transform: isItemVisible ? 'translateY(0)' : 'translateY(30px)',
                      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                      transitionDelay: `${index * 0.15}s`
                    }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-6 z-10">
                      <div 
                        className="w-4 h-4 rounded-full border-4 transition-all duration-300"
                        style={{ 
                          backgroundColor: experience.period.includes('Present') ? '#A0332B' : 'rgba(160, 51, 43, 0.4)',
                          borderColor: '#FAFAFA',
                          boxShadow: isItemVisible ? '0 0 0 4px rgba(160, 51, 43, 0.1)' : 'none'
                        }}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ml-12 md:ml-0 ${
                      index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                    }`}>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red/30 group">
                        <div className="flex flex-wrap items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-garamond font-semibold mb-1" style={{ color: '#000000' }}>
                              {experience.job_title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <h4 
                                className={`text-lg font-garamond font-semibold mb-2 transition-all duration-300 inline-flex items-center gap-2 ${
                                  experience.link && experience.link.trim() !== '' 
                                    ? 'cursor-pointer hover:opacity-80' 
                                    : ''
                                }`}
                                style={{ color: '#A0332B' }}
                                onClick={() => experience.link && experience.link.trim() !== '' && handleCompanyClick(experience.link)}
                              >
                                {experience.company}
                                {experience.link && experience.link.trim() !== '' && (
                                  <ArrowRight 
                                    size={16} 
                                    className="transition-all duration-300 group-hover:translate-x-1"
                                    style={{ 
                                      color: '#A0332B'
                                    }}
                                  />
                                )}
                              </h4>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} style={{ color: '#A0332B' }} />
                            <span className="text-sm font-garamond" style={{ color: '#000000' }}>{experience.period}</span>
                          </div>
                        </div>

                        {experience.description && (
                          <div className="space-y-2">
                            {experience.description.split('. ').filter(point => point.trim()).map((point, pointIndex) => (
                              <div
                                key={pointIndex}
                                className="flex items-start gap-3 font-garamond"
                                style={{ color: '#000000' }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#A0332B' }}></div>
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
                );
              })}
            </div>
          </div>
        )}

        {/* Education Section */}
        <div 
          className={`mt-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${(experiences.length * 0.15) + 0.3}s` }}
        >
          <h3 className="text-2xl md:text-3xl font-display font-semibold text-center mb-12" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Education & Achievements
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease-out',
                transitionDelay: `${(experiences.length * 0.15) + 0.5}s`
              }}
            >
              <h4 className="text-xl font-garamond font-semibold mb-3" style={{ color: '#A0332B' }}>Education</h4>
              <p className="font-garamond mb-2" style={{ color: '#000000' }}>High School Diploma</p>
              <p className="font-garamond text-sm" style={{ color: '#666666' }}>Public School • 2015 - 2026</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-garamond mb-1" style={{ color: '#000000' }}>IELTS 7 (L.9, R.7.5) - December 2024</p>
              </div>
            </div>

            <div 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease-out',
                transitionDelay: `${(experiences.length * 0.15) + 0.7}s`
              }}
            >
              <h4 className="text-xl font-garamond font-semibold mb-3" style={{ color: '#A0332B' }}>Languages</h4>
              <div className="space-y-2">
                <p className="font-garamond" style={{ color: '#000000' }}>Uzbek</p>
                <p className="font-garamond" style={{ color: '#000000' }}>Russian</p>
                <p className="font-garamond" style={{ color: '#000000' }}>English</p>
              </div>
            </div>

            <div 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease-out',
                transitionDelay: `${(experiences.length * 0.15) + 0.9}s`
              }}
            >
              <h4 className="text-xl font-garamond font-semibold mb-3" style={{ color: '#A0332B' }}>Honors and Awards</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>LaunchX Global Entrepreneurship Bootcamp</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>Full Scholarship (Top 3 in Uzbekistan, 30% acceptance rate), 2025</p>
                </div>
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>Algoverse AI Research Program</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>Global AI Research Cohort (18% acceptance, Spring 2025), Grade 11</p>
                </div>
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>Technocamp 2025</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>1st National Science Camp (10% acceptance, 200 of 2,000 selected), Grades 11-12</p>
                </div>
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>Regional Judo Champion</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>1st Place, Tashkent Region (Uzbekistan Judo Federation), Grade 9</p>
                </div>
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>Valedictorian</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>#1 Ranked Student, School No. 40 (Highest GPA, 3 consecutive years), Grades 10-12</p>
                </div>
                <div>
                  <p className="font-garamond text-sm font-semibold" style={{ color: '#000000' }}>Bentley Pre-College Wall Street 101</p>
                  <p className="font-garamond text-xs" style={{ color: '#666666' }}>Full Scholarship awarded (unable to attend due to travel costs)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Experience);
