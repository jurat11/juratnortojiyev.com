import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'web' | 'programming' | 'research' | 'tools';
  icon?: string;
  color: string;
  description: string;
}

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedPercentages, setAnimatedPercentages] = useState<{ [key: string]: number }>({});
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Convert skill level to percentage for progress bar visualization
  const getLevelPercentage = (level: 'beginner' | 'intermediate' | 'advanced'): number => {
    switch (level) {
      case 'beginner': return 50;
      case 'intermediate': return 75;
      case 'advanced': return 98;
      default: return 0;
    }
  };

  // Get progress bar color based on skill level
  const getProgressBarColor = (level: 'beginner' | 'intermediate' | 'advanced'): string => {
    switch (level) {
      case 'beginner': return 'from-yellow-400 to-yellow-600';
      case 'intermediate': return 'from-orange-400 to-orange-600';
      case 'advanced': return 'from-red-500 to-red-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Get skill level display text
  const getLevelText = (level: 'beginner' | 'intermediate' | 'advanced'): string => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return '';
    }
  };

  const skills: Skill[] = [
    { 
      name: 'HTML', 
      level: 'advanced', 
      category: 'programming', 
      icon: '🌐', 
      color: 'from-orange-500 to-red-500',
      description: 'Semantic markup and accessibility'
    },
    { 
      name: 'CSS', 
      level: 'advanced', 
      category: 'programming', 
      icon: '🎨', 
      color: 'from-blue-500 to-purple-500',
      description: 'Advanced styling and animations'
    },
    { 
      name: 'JavaScript', 
      level: 'intermediate', 
      category: 'programming', 
      icon: '⚡', 
      color: 'from-yellow-400 to-orange-500',
      description: 'ES6+ and modern patterns'
    },
    { 
      name: 'TypeScript', 
      level: 'beginner', 
      category: 'programming', 
      icon: '📘', 
      color: 'from-blue-600 to-blue-700',
      description: 'Type-safe JavaScript development'
    },
    { 
      name: 'React.js', 
      level: 'beginner', 
      category: 'programming', 
      icon: '⚛️', 
      color: 'from-cyan-400 to-blue-500',
      description: 'Component-based architecture'
    },
    { 
      name: 'Node.js', 
      level: 'intermediate', 
      category: 'programming', 
      icon: '🟢', 
      color: 'from-green-500 to-emerald-600',
      description: 'Server-side JavaScript runtime'
    },
    { 
      name: 'Python', 
      level: 'intermediate', 
      category: 'programming', 
      icon: '🐍', 
      color: 'from-blue-500 to-indigo-600',
      description: 'Data analysis and automation'
    },
    { 
      name: 'LaTeX', 
      level: 'advanced', 
      category: 'research', 
      icon: '📝', 
      color: 'from-purple-600 to-violet-700',
      description: 'Document preparation system'
    },
    { 
      name: 'Product Development Research', 
      level: 'advanced', 
      category: 'research', 
      icon: '🔬', 
      color: 'from-purple-500 to-violet-500',
      description: 'Product development research'
    },
    { 
      name: 'Analytical R&D', 
      level: 'intermediate', 
      category: 'research', 
      icon: '📊', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Data-driven research methods'
    },
    { 
      name: 'Collaborative R&D', 
      level: 'intermediate', 
      category: 'research', 
      icon: '🤝', 
      color: 'from-green-500 to-emerald-500',
      description: 'Team-based research projects'
    },
    { 
      name: 'Google Docs', 
      level: 'advanced', 
      category: 'tools', 
      icon: '📄', 
      color: 'from-blue-500 to-green-600',
      description: 'Document management'
    },
    { 
      name: 'Google Sheets', 
      level: 'advanced', 
      category: 'tools', 
      icon: '📊', 
      color: 'from-green-500 to-blue-600',
      description: 'Spreadsheet management'
    },
    { 
      name: 'Notion', 
      level: 'advanced', 
      category: 'tools', 
      icon: '📋', 
      color: 'from-gray-600 to-black',
      description: 'Workspace organization and collaboration'
    },
    { 
      name: 'AI Tools', 
      level: 'advanced', 
      category: 'tools', 
      icon: '🤖', 
      color: 'from-purple-500 to-pink-600',
      description: 'AI-powered productivity tools'
    },
    { 
      name: 'ClickUp', 
      level: 'intermediate', 
      category: 'tools', 
      icon: '🚀', 
      color: 'from-purple-500 to-pink-600',
      description: 'Project management platform'
    },
  ];

  const categories = {
    programming: 'Programming',
    research: 'Research & Development',
    tools: 'Productivity & Management Tools'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animate progress bars
          skills.forEach((skill, index) => {
            setTimeout(() => {
              setAnimatedPercentages(prev => ({
                ...prev,
                [skill.name]: getLevelPercentage(skill.level)
              }));
            }, index * 100);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, skills]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as { [key: string]: Skill[] });

  const parallaxTransform = (speed: number) => ({
    transform: `translateY(${scrollY * speed}px)`
  });

  return (
    <section ref={sectionRef} id="skills" className="py-20 bg-surface relative overflow-hidden">
      {/* Minimal Background Decorations */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-mint/3 rounded-full blur-3xl animate-float transition-all duration-2000" 
          style={parallaxTransform(0.1)}
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue/3 rounded-full blur-3xl animate-float transition-all duration-2000" 
          style={{ 
            animationDelay: '2s', 
            ...parallaxTransform(-0.15)
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Technical expertise and proficiency levels
          </p>
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-primary flex items-center gap-2 mx-auto group"
          >
            <span>{isExpanded ? 'Hide Skills' : 'Show Skills'}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Skills Content */}
        <div 
          className={`grid lg:grid-cols-3 gap-12 transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Left Column - Programming (including Web Development) */}
          <div 
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0s' }}
          >
            <h3 className="text-2xl font-semibold text-mint mb-8 flex items-center gap-3">
              <span className="text-2xl">💻</span>
              {categories.programming}
            </h3>
            
            <div className="space-y-6">
              {groupedSkills.programming?.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Minimal Skill Card */}
                  <div className="relative p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-mint/10 hover:border-mint/30 transition-all duration-300 hover:bg-card/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          {skill.icon}
                        </span>
                        <div>
                          <span className="text-lg font-medium text-foreground group-hover:text-mint transition-colors duration-300">
                            {skill.name}
                          </span>
                          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-mint font-semibold">
                        {getLevelText(skill.level)}
                      </span>
                    </div>
                    
                    <div className="progress-bar group-hover:shadow-mint transition-all duration-300 relative overflow-hidden">
                      <div 
                        className={`progress-fill bg-gradient-to-r ${getProgressBarColor(skill.level)} transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: `${animatedPercentages[skill.name] || 0}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Research & Development */}
          <div 
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <h3 className="text-2xl font-semibold text-mint mb-8 flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              {categories.research}
            </h3>
            
            <div className="space-y-6">
              {groupedSkills.research?.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Minimal Skill Card */}
                  <div className="relative p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-mint/10 hover:border-mint/30 transition-all duration-300 hover:bg-card/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          {skill.icon}
                        </span>
                        <div>
                          <span className="text-lg font-medium text-foreground group-hover:text-mint transition-colors duration-300">
                            {skill.name}
                          </span>
                          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-mint font-semibold">
                        {getLevelText(skill.level)}
                      </span>
                    </div>
                    
                    <div className="progress-bar group-hover:shadow-mint transition-all duration-300 relative overflow-hidden">
                      <div 
                        className={`progress-fill bg-gradient-to-r ${getProgressBarColor(skill.level)} transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: `${animatedPercentages[skill.name] || 0}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Productivity & Management Tools */}
          <div 
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            <h3 className="text-2xl font-semibold text-mint mb-8 flex items-center gap-3">
              <span className="text-2xl">🛠️</span>
              {categories.tools}
            </h3>
            
            <div className="space-y-6">
              {groupedSkills.tools?.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Minimal Skill Card */}
                  <div className="relative p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-mint/10 hover:border-mint/30 transition-all duration-300 hover:bg-card/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          {skill.icon}
                        </span>
                        <div>
                          <span className="text-lg font-medium text-foreground group-hover:text-mint transition-colors duration-300">
                            {skill.name}
                          </span>
                          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-mint font-semibold">
                        {getLevelText(skill.level)}
                      </span>
                    </div>
                    
                    <div className="progress-bar group-hover:shadow-mint transition-all duration-300 relative overflow-hidden">
                      <div 
                        className={`progress-fill bg-gradient-to-r ${getProgressBarColor(skill.level)} transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: `${animatedPercentages[skill.name] || 0}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Philosophy */}
        <div 
          className={`mt-20 text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I don't believe in listing theories for the sake of looking smart. What matters is practice — building, breaking, and fixing until it works. My skills aren't things I just "know"; they're things I've used, tested, and proven in real situations.
            </p>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Skills;