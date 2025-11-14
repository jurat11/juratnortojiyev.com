import { Linkedin, Mail, ArrowUp } from 'lucide-react';
import { memo } from 'react';
import TelegramIcon from './ui/telegram-icon';

const Footer = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jur-at-nortojiyev-5399b034a/',
      icon: <Linkedin className="w-4 h-4" />
    },
    {
      name: 'Telegram',
      href: 'https://t.me/jurat1',
      icon: <TelegramIcon className="w-4 h-4" />
    },
    {
      name: 'Email',
      href: 'mailto:juratnortojiyev@unlockadmissions.uz',
      icon: <Mail className="w-4 h-4" />
    }
  ];

  return (
    <footer className="border-t border-gray-200 relative z-20" style={{ backgroundColor: '#F0F0F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm font-garamond" style={{ color: '#A0332B' }}>
            © {new Date().getFullYear()} Jurat Nortojiev
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:opacity-70"
                style={{ color: '#A0332B' }}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-red text-white p-3 rounded-full shadow-lg hover:bg-red-dark transition-all duration-300 hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default memo(Footer);