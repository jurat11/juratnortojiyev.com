import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
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
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔍 Fetching blogs from Supabase...');
        
        // Fetch from Supabase
        const { data, error: supabaseError } = await supabase
          .from('blogs')
          .select('*')
          .order('published_at', { ascending: false });
        
        console.log('📊 Supabase response:', { data, error: supabaseError });
        
        if (supabaseError) throw supabaseError;
        
        setBlogs(data || []);
        console.log('✅ Blogs loaded:', data?.length || 0);
      } catch (error) {
        console.error('❌ Error fetching blogs:', error);
        setError('Failed to load blog posts');
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string, customReadTime?: string) => {
    if (customReadTime) {
      return customReadTime;
    }
    
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="blog" className="py-20 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Blog</span>
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} id="blog" className="py-20 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="text-gradient">Blog</span>
            </h2>
            <p className="text-red-500">Error loading blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="blog" className="py-20 bg-surface relative overflow-hidden">
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            My <span className="text-gradient">Blog</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharing my thoughts, experiences, and insights about web development and technology
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            <p className="text-sm text-gray-500 mt-2">Debug: blogs array length is {blogs.length}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                className={`group bg-card/20 backdrop-blur-sm border border-mint/10 rounded-xl overflow-hidden hover:border-mint/30 transition-all duration-300 hover:bg-card/30 card-3d hover-3d-lift transition-all duration-1000 ease-out cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 0.2}s`,
                  transformStyle: 'preserve-3d'
                }}
                onClick={() => {
                  console.log('Blog card clicked for blog:', blog.id);
                  // Store blog data in localStorage for the full article view
                  localStorage.setItem('currentBlog', JSON.stringify(blog));
                  // Navigate to blog detail page
                  navigate(`/blog/${blog.id}`);
                }}
              >
                {/* Blog Image */}
                {blog.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        console.error('Image failed to load:', blog.image, e);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', blog.image);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Blog Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(blog.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{getReadingTime(blog.content, blog.read_time)}</span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-mint" />
                    <span className="text-sm text-muted-foreground">{blog.author}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Read More Button */}
                  <button
                    onClick={() => {
                      console.log('Read More clicked for blog:', blog.id);
                      // Store blog data in localStorage for the full article view
                      localStorage.setItem('currentBlog', JSON.stringify(blog));
                      // Navigate to blog detail page
                      navigate(`/blog/${blog.id}`);
                    }}
                    className="blog-read-more-btn inline-flex items-center gap-2 bg-mint text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 hover:bg-blue hover:scale-105 active:scale-95 group"
                  >
                    <span>Read More</span>
                    <ArrowRight size={18} className="arrow-icon" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}


      </div>
    </section>
  );
};

export default Blog;
