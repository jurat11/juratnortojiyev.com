import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowUp, Share2, Linkedin, Twitter } from 'lucide-react';
import TelegramIcon from './ui/telegram-icon';
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

  // Scroll to top when component mounts (fixes mobile scroll issue)
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    // Also use scrollIntoView for better mobile support
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

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
        
        // Update meta tags for link previews and SEO
        if (data) {
          const baseUrl = window.location.origin;
          const blogUrl = window.location.href;
          const imageUrl = data.image ? (data.image.startsWith('http') ? data.image : `${baseUrl}${data.image}`) : `${baseUrl}/juratphoto.jpg`;
          const plainContent = data.content ? data.content.replace(/<[^>]*>/g, '') : '';
          const description = data.excerpt || plainContent.substring(0, 200) || `${data.title} by Jurat Nortojiev`;
          const keywords = `${data.title}, Jurat Nortojiev, blog, ${plainContent.substring(0, 100).split(' ').slice(0, 10).join(', ')}`;
          
          // Update or create meta tags
          const updateMetaTag = (property: string, content: string, isProperty = true) => {
            const attr = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${property}"]`);
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute(attr, property);
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
          };
          
          // Basic SEO meta tags
          updateMetaTag('description', description, false);
          updateMetaTag('keywords', keywords, false);
          updateMetaTag('author', data.author || 'Jurat Nortojiev', false);
          updateMetaTag('article:author', data.author || 'Jurat Nortojiev');
          updateMetaTag('article:published_time', data.published_at || data.created_at);
          updateMetaTag('article:modified_time', data.updated_at || data.created_at);
          
          // Canonical URL
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', blogUrl);
          
          // Open Graph tags
          updateMetaTag('og:title', data.title);
          updateMetaTag('og:description', description);
          updateMetaTag('og:image', imageUrl);
          updateMetaTag('og:url', blogUrl);
          updateMetaTag('og:type', 'article');
          updateMetaTag('og:site_name', 'Jurat Nortojiev');
          updateMetaTag('og:author', data.author || 'Jurat Nortojiev');
          
          // Twitter Card tags
          updateMetaTag('twitter:card', 'summary_large_image', false);
          updateMetaTag('twitter:title', data.title, false);
          updateMetaTag('twitter:description', description, false);
          updateMetaTag('twitter:image', imageUrl, false);
          updateMetaTag('twitter:creator', '@juratnortojiev', false);
          
          // Update page title
          document.title = `${data.title} | Jurat Nortojiev`;
          
          // Add structured data (JSON-LD) for Article
          const existingArticleSchema = document.getElementById('article-schema');
          if (existingArticleSchema) {
            existingArticleSchema.remove();
          }
          
          const articleSchema = document.createElement('script');
          articleSchema.id = 'article-schema';
          articleSchema.type = 'application/ld+json';
          articleSchema.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.title,
            "description": description,
            "image": imageUrl,
            "author": {
              "@type": "Person",
              "name": data.author || "Jurat Nortojiev",
              "url": "https://juratnortojiyev.com"
            },
            "publisher": {
              "@type": "Person",
              "name": "Jurat Nortojiev",
              "url": "https://juratnortojiyev.com",
              "image": `${baseUrl}/uploads/Jurat unlock.png`
            },
            "datePublished": data.published_at || data.created_at,
            "dateModified": data.updated_at || data.created_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": blogUrl
            },
            "url": blogUrl,
            "articleBody": plainContent,
            "keywords": keywords,
            "inLanguage": "en-US"
          });
          document.head.appendChild(articleSchema);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Scroll to top after blog is loaded (additional fix for mobile)
  useEffect(() => {
    if (!isLoading && blog) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }, [isLoading, blog]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string, customReadTime?: string | null) => {
    if (!customReadTime && !content) return '';
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
            className="bg-red text-white px-6 py-2 rounded-lg hover:bg-red-dark transition-colors"
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
      <header className="bg-card/95 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            type="button"
            onClick={() => {
              // Get the stored return path and scroll position
              const returnPath = localStorage.getItem('blogReturnPath') || '/';
              const scrollTo = localStorage.getItem('blogReturnScroll');
              
              // Clear the stored values
              localStorage.removeItem('blogReturnPath');
              localStorage.removeItem('blogReturnScroll');
              
              // Navigate to the stored location
              if (scrollTo) {
                navigate(returnPath, { state: { scrollTo } });
              } else {
                navigate(returnPath);
              }
            }}
            className="inline-flex items-center gap-2 transition-colors font-garamond"
            style={{ color: '#A0332B' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={20} style={{ color: '#A0332B' }} />
            Back
          </button>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <header className="mb-8" itemScope itemType="https://schema.org/BlogPosting">
          <h1 className="text-4xl lg:text-5xl font-display font-semibold mb-4 leading-tight" style={{ color: '#A0332B', fontStyle: 'italic' }} itemProp="headline">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl font-garamond mb-6 leading-relaxed" style={{ color: '#000000' }} itemProp="description">
            {blog.excerpt}
          </p>
          )}

          {/* Meta Information */}
          {blog.read_time && (
            <div className="flex flex-wrap items-center gap-6 text-sm font-garamond mb-6" style={{ color: '#000000' }}>
            <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: '#A0332B' }} />
              <span>{getReadingTime(blog.content, blog.read_time)}</span>
            </div>
          </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-8 flex justify-center">
            <img
              src={blog.image}
              alt={`${blog.title} - Featured image for blog post by Jurat Nortojiev`}
              className="rounded-xl shadow-lg"
              style={{ width: '60%', height: 'auto' }}
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none" itemScope itemType="https://schema.org/BlogPosting">
          <div 
            className="font-garamond leading-relaxed whitespace-pre-wrap" 
            style={{ color: '#000000' }}
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm font-garamond mb-4" style={{ color: '#000000' }}>Share this article:</p>
          <div className="flex flex-wrap gap-3">
            {/* Instagram */}
            <button
              type="button"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(blog.title);
                // Instagram doesn't have direct share API, so we copy the link
                navigator.clipboard.writeText(window.location.href).then(() => {
                  alert('Link copied! Paste it in your Instagram story or post.');
                }).catch(() => {
                  alert('Please copy this link manually: ' + window.location.href);
                });
              }}
              className="inline-flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full"
              style={{ color: '#A0332B', border: '1px solid #A0332B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A0332B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A0332B';
              }}
              title="Share on Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>

            {/* Telegram */}
            <button
              type="button"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(blog.title);
                window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
              }}
              className="inline-flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full"
              style={{ color: '#A0332B', border: '1px solid #A0332B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A0332B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A0332B';
              }}
              title="Share on Telegram"
            >
              <TelegramIcon size={20} />
            </button>

            {/* X (Twitter) */}
            <button
              type="button"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(blog.title);
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
              }}
              className="inline-flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full"
              style={{ color: '#A0332B', border: '1px solid #A0332B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A0332B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A0332B';
              }}
              title="Share on X"
            >
              <Twitter size={20} />
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
              }}
              className="inline-flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full"
              style={{ color: '#A0332B', border: '1px solid #A0332B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A0332B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A0332B';
              }}
              title="Share on LinkedIn"
            >
              <Linkedin size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-200 text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300 hover:scale-110 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
