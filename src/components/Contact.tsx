import { useState, useRef, useEffect, memo } from 'react';
import { Send, Mail, MapPin, CheckCircle, AlertCircle, Linkedin } from 'lucide-react';
import TelegramIcon from './ui/telegram-icon';

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

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
      const response = await fetch('https://formspree.io/f/xovnldzn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
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
      value: 'based nowhere and everywhere',
      href: null
    },
    {
      icon: <TelegramIcon className="w-6 h-6" />,
      label: 'Telegram',
      value: '@jurat1',
      href: 'https://t.me/jurat1'
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      value: 'Jurat Nortojiev',
      href: 'https://www.linkedin.com/in/jur-at-nortojiyev-5399b034a/'
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 relative z-20" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4" style={{ color: '#A0332B', fontStyle: 'italic' }}>
            Get In Touch
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div 
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div>
              <h3 className="text-2xl font-display font-semibold mb-6" style={{ color: '#A0332B', fontStyle: 'italic' }}>
                Let's start a conversation
              </h3>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div style={{ color: '#A0332B' }}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm font-garamond mb-1" style={{ color: '#666666' }}>{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-garamond hover:opacity-80 transition-colors duration-300"
                        style={{ color: '#000000' }}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-garamond" style={{ color: '#000000' }}>{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
              <h3 className="text-2xl font-display font-semibold mb-6" style={{ color: '#A0332B', fontStyle: 'italic' }}>
                Send me a message
              </h3>

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium font-garamond" style={{ color: '#000000' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red focus:border-red transition-all duration-300 font-garamond ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#000000' }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-2 font-garamond">
                    <AlertCircle size={16} />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium font-garamond" style={{ color: '#000000' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red focus:border-red transition-all duration-300 font-garamond ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#000000' }}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-2 font-garamond">
                    <AlertCircle size={16} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium font-garamond" style={{ color: '#000000' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red focus:border-red transition-all duration-300 font-garamond ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#000000' }}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-2 font-garamond">
                    <AlertCircle size={16} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium font-garamond" style={{ color: '#000000' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red focus:border-red transition-all duration-300 font-garamond resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#000000' }}
                  placeholder="Tell me about your project or inquiry..."
                />
                {errors.message && (
                  <p className="text-sm text-red-500 flex items-center gap-2 font-garamond">
                    <AlertCircle size={16} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-garamond transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'animate-pulse' : ''
                }`}
                style={{ backgroundColor: '#A0332B', color: '#FFFFFF' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

              <p className="text-sm font-garamond text-center" style={{ color: '#666666' }}>
                * Required fields. All data is confidential and secure.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);
