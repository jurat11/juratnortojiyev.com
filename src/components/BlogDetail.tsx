import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, ArrowUp } from 'lucide-react';
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

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          setError('Blog ID not found');
          return;
        }

        // Try to get from localStorage first (if coming from main page)
        const storedBlog = localStorage.getItem('currentBlog');
        if (storedBlog) {
          const parsedBlog = JSON.parse(storedBlog);
          if (parsedBlog.id === parseInt(id)) {
            setBlog(parsedBlog);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from Supabase if not in localStorage
        const { data, error: supabaseError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        
        if (supabaseError) throw supabaseError;
        
        if (!data) {
          setError('Blog post not found');
          return;
        }
        
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || 'Blog post not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-mint text-white px-6 py-2 rounded-lg hover:bg-blue transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-card/20 backdrop-blur-sm border-b border-mint/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            type="button"
            onClick={() => {
              console.log('Back button clicked, navigating to blog section');
              // Navigate back to home page; simplest behavior
              navigate('/');
            }}
            className="inline-flex items-center gap-2 text-mint hover:text-blue transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-mint" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-mint" />
              <span>{formatDate(blog.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-mint" />
              <span>{getReadingTime(blog.content, blog.read_time)}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-mint/10">
          <div className="text-center">
            <p className="text-muted-foreground">
              Written by <span className="text-mint font-medium">{blog.author}</span>
            </p>
          </div>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-mint text-white p-3 rounded-full shadow-lg hover:bg-blue transition-all duration-300 hover:scale-110 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
