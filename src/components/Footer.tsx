import { Github, Linkedin, Send, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    skills: [
      { name: 'JavaScript', href: '#skills' },
      { name: 'TypeScript', href: '#skills' },
      { name: 'React.js', href: '#skills' },
      { name: 'Python', href: '#skills' },
      { name: 'AI & Machine Learning', href: '#skills' }
    ],
    projects: [
      { name: 'BiteWise AI Bot', href: '#portfolio' },
      { name: 'Traffic Optimization', href: '#portfolio' },
      { name: 'Web Applications', href: '#portfolio' },
      { name: 'Research Papers', href: '#portfolio' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' }
    ]
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/juratnortojiyev',
      icon: <Github className="w-5 h-5" />
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jur-at-nortojiyev-5399b034a',
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      name: 'Telegram',
      href: 'https://t.me/BiteWiseBot',
      icon: <Send className="w-5 h-5" />
    },
    {
      name: 'Email',
      href: 'mailto:jjuratov50@gmail.com',
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-card border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gradient">Jur'at Nortojiyev</h3>
                <p className="text-muted-foreground mt-2">
                  Web Developer & AI Enthusiast
                </p>
              </div>
              
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Building innovative solutions at the intersection of web development and artificial intelligence. 
                Currently creating impactful projects while pursuing excellence in technology.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-muted-foreground hover:text-mint transition-all duration-300 hover:scale-110 transform"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Academic Skills */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Technical Skills</h4>
              <ul className="space-y-2">
                {footerLinks.skills.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-mint transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Passion Projects */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Projects</h4>
              <ul className="space-y-2">
                {footerLinks.projects.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-mint transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-mint transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Jur'at Nortojiyev. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Tashkent, Uzbekistan
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Available for freelance work
              </span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-mint text-primary-foreground p-3 rounded-full shadow-mint hover:shadow-lg transition-all duration-300 hover:scale-110 transform z-40"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;