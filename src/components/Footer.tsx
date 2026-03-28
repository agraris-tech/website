import { Facebook, Instagram, Youtube, Mail, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'О компании', href: '/about' },
      { label: 'Новая техника', href: '/equipment#new' },
      { label: 'Техника Б/У', href: '/equipment#used' },
      { label: 'Контакты', href: '/contact' }
    ],
    brands: [
      { label: 'John Deere', href: '/equipment#brand-john-deere' },
      { label: 'Case IH', href: '/equipment#brand-case-ih' },
      { label: 'New Holland', href: '/equipment#brand-new-holland' },
      { label: 'Claas', href: '/equipment#brand-claas' }
    ],
    contacts: [
      { label: '+375 (29) 525-44-37', href: 'tel:+375295254437', icon: Phone },
      { label: 'agraristech2@gmail.com', href: 'mailto:agraristech2@gmail.com', icon: Mail },
      { label: 'WhatsApp', href: 'https://wa.me/375295254437', icon: MessageCircle }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Agraris Logo" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="text-xl text-white">AGRARIS</h3>
                <p className="text-xs">Сельхозтехника</p>
              </div>
            </Link>
            <p className="text-sm mb-4">
              ООО "Аграрис Текник" — продажа европейской сельскохозяйственной техники в Беларуси с 2014 года.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white mb-4">Разделы</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-sm hover:text-green-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Links */}
          <div>
            <h4 className="text-white mb-4">Бренды</h4>
            <ul className="space-y-2">
              {footerLinks.brands.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-green-500 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Контакты</h4>
            <ul className="space-y-3">
              {footerLinks.contacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <li key={index}>
                    <a 
                      href={contact.href} 
                      className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors"
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      {contact.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 text-sm">
              <p>Брестский район, Чернинский с/с</p>
              <p className="mt-2">Пн-Пт: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} ООО "Аграрис Текник". Все права защищены.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-green-500 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-green-500 transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}