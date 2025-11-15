import { useEffect, useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  read_time?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
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
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('blogs')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (supabaseError) throw supabaseError;
        
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts');
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getReadingTime = (content: string, readTime?: string): string => {
    if (readTime) return readTime;
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="blog" className="py-20 relative z-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Blog
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
      <section ref={sectionRef} id="blog" className="py-20 relative z-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
              Blog
            </h2>
            <p className="text-red-500 mt-4">Error loading blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="blog" className="py-20 relative z-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Blog
          </h2>
          <p className="text-lg font-garamond font-light max-w-2xl mx-auto" style={{ color: '#000000' }}>
            Thoughts, experiences, and insights
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg font-garamond" style={{ color: '#000000' }}>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 6).map((blog, index) => (
              <article
                key={blog.id}
                itemScope
                itemType="https://schema.org/BlogPosting"
                className={`group bg-card border border-gray-200 rounded-lg overflow-hidden hover:border-red/30 hover:shadow-md transition-all duration-300 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => {
                  localStorage.setItem('currentBlog', JSON.stringify(blog));
                  // Store the previous location (home page blog section)
                  localStorage.setItem('blogReturnPath', '/');
                  localStorage.setItem('blogReturnScroll', 'blog');
                  navigate(`/blog/${blog.id}`);
                }}
              >
                {/* Blog Image */}
                {blog.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="192"
                      fetchpriority="low"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="p-6">
                  {/* Meta Information - Only show read time if available */}
                  {blog.read_time && (
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Clock size={14} style={{ color: '#A0332B' }} />
                      <span className="font-garamond" style={{ color: '#000000' }}>{getReadingTime(blog.content, blog.read_time)}</span>
                    </div>
                  )}

                    {/* Title */}
                    <h3 className="text-xl font-garamond font-semibold mb-3 line-clamp-2" style={{ color: '#000000' }} itemProp="headline">
                      {blog.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p 
                      className="font-garamond mb-4 line-clamp-3 leading-relaxed text-sm" 
                      style={{ color: '#000000' }}
                      itemProp="description"
                      dangerouslySetInnerHTML={{ 
                        __html: blog.excerpt || (() => {
                          if (!blog.content) return '';
                          // Strip HTML tags for fallback excerpt
                          const plainContent = blog.content.replace(/<[^>]*>/g, '');
                          const sentences = plainContent
                            .split(/[.!?]+/)
                            .map(s => s.trim())
                            .filter(s => s.length > 20)
                            .slice(0, 3);
                          return sentences.length > 0 ? sentences.join('. ').trim() + '.' : plainContent.substring(0, 150).trim() + '...';
                        })()
                      }}
                    />

                  {/* Read More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('currentBlog', JSON.stringify(blog));
                      // Store the previous location (home page blog section)
                      localStorage.setItem('blogReturnPath', '/');
                      localStorage.setItem('blogReturnScroll', 'blog');
                      navigate(`/blog/${blog.id}`);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-garamond transition-all duration-300 hover:opacity-80"
                    style={{ color: '#A0332B', border: '1px solid #A0332B' }}
                  >
                    <span>Read More</span>
                    <ArrowRight size={16} style={{ color: '#A0332B' }} />
                  </button>
                </div>
              </article>
              ))}
            </div>
            
            {/* See More Button */}
            {blogs.length > 6 && (
              <div 
                className="text-center mt-12 transition-all duration-1000 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${Math.min(blogs.length, 6) * 0.1 + 0.3}s`
                }}
              >
                <button
                  onClick={() => navigate('/blogs')}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-garamond font-semibold transition-all duration-300 hover:opacity-80 hover:scale-105"
                  style={{ 
                    color: '#FFFFFF', 
                    backgroundColor: '#A0332B',
                    border: '1px solid #A0332B'
                  }}
                >
                  <span>See More</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default memo(Blog);
