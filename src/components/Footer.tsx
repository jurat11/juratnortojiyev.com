import { Linkedin, Mail, ArrowUp } from 'lucide-react';
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
    <footer className="bg-background border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Footer Content */}
        <div className="py-3 flex items-center justify-between">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            Nortojiyev Jur'at © {new Date().getFullYear()}
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-mint text-primary-foreground p-3 rounded-full shadow-mint hover:shadow-lg transition-all duration-300 hover:scale-110 transform z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;