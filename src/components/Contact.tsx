import { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send form data to backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      
      // Log to console for development
      console.log('Contact Form Submission:', {
        ...formData,
        timestamp: new Date().toISOString(),
        result
      });

      // Show success message
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', phone: '', message: '' });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      // Reset error after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'juratjushkinovich@gmail.com',
      href: 'mailto:juratjushkinovich@gmail.com'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Location',
      value: 'Tashkent, Uzbekistan',
      href: null
    },
    {
      icon: <Send className="w-6 h-6" />,
      label: 'Telegram',
      value: '@BiteWiseBot',
      href: 'https://t.me/BiteWiseBot'
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : ''}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Let's start a conversation
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                I'm always excited to discuss new projects, innovative ideas, or opportunities to 
                collaborate. Whether you have a question about my work or want to explore working together, 
                don't hesitate to reach out.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={info.label}
                  className="flex items-center gap-4 p-4 card-gradient rounded-lg hover:shadow-mint transition-all duration-300"
                >
                  <div className="text-mint">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-foreground hover:text-mint transition-colors duration-300 font-medium"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-r from-mint/10 to-blue/10 rounded-xl p-6 border border-mint/20">
              <h4 className="text-lg font-semibold text-mint mb-3">Quick Facts</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Usually respond within 24 hours</li>
                <li>• Available for remote collaboration</li>
                <li>• Open to freelance and full-time opportunities</li>
                <li>• Fluent in English, Russian, and Uzbek</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${isVisible ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleSubmit} className="card-gradient rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Send me a message
              </h3>

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-all duration-300 text-foreground placeholder-muted-foreground ${
                    errors.fullName ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-all duration-300 text-foreground placeholder-muted-foreground ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-all duration-300 text-foreground placeholder-muted-foreground ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-all duration-300 text-foreground placeholder-muted-foreground resize-none ${
                    errors.message ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Tell me about your project or inquiry..."
                />
                {errors.message && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'animate-pulse' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    Message Sent Successfully!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle size={20} />
                    Error Sending Message
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-sm text-muted-foreground text-center">
                * All fields are required. Your message will be sent to juratjushkinovich@gmail.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;