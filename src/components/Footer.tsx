import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @ts-ignore
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';
import { getBrands, getTopBrands, getSiteSettings } from '../services/strapi';
import { getRegionalContact, type SiteSettings } from '../lib/getRegionalContact';
import { getHostname } from '../lib/getHostname';

type BrandItem = {
  id: number;
  name: string;
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const contact = getRegionalContact(settings, getHostname());

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [siteSettings, brandItems] = await Promise.all([
          getSiteSettings(),
          getTopBrands(5),
        ]);

        setSettings(siteSettings);
        setBrands(brandItems);
      } catch (error) {
        console.error('Failed to load footer data:', error);
      }
    }

    loadFooterData();
  }, []);

  const sectionLinks = [
    { label: 'О компании', href: '/about' },
    { label: 'Новая техника', href: '/catalog?category=selskohozyajstvennaya-tehnika-novaya',state: { scrollToFilters: true } },
    { label: 'Техника Б/У', href: '/catalog?category=selhoztehnika-bu',state: { scrollToFilters: true } },
    { label: 'Запчасти Grimme', href: '/catalog?category=zapchasti-grimme',state: { scrollToFilters: true } },
    { label: 'Контакты', href: '/contact' },
  ];

  const contactActions = [
    {
      icon: Phone,
      label: contact?.phone || '',
      href: contact?.phone ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : '#',
    },
    {
      icon: Mail,
      label: contact?.email || '',
      href: contact?.email ? `mailto:${contact.email}` : '#',
    },
    {
      icon: Send,
      label: 'Telegram',
      href: contact?.telegramUrl || '#',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: contact?.whatsappUrl || '#',
    },
  ].filter((item) => item.label || item.href !== '#');

  return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Agraris Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-xl text-white">{settings?.companyName || 'AGRARIS'}</h3>
                  <p className="text-xs">{settings?.companySubtitle || 'Сельхозтехника'}</p>
                </div>
              </Link>

              <p className="text-sm mb-4">
                {settings?.companyShortDescription ||
                    'ООО "Аграрис Текник" — продажа европейской сельскохозяйственной техники в Беларуси.'}
              </p>

              <div className="flex gap-3">
                {contactActions.map((item, index) => {
                  const Icon = item.icon;
                  const isExternal = item.href.startsWith('http');

                  return (
                      <a
                          key={index}
                          href={item.href}
                          aria-label={item.label}
                          className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4">Разделы</h4>
              <ul className="space-y-2">
                {sectionLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.href} state={link.state} className="text-sm hover:text-green-500 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Бренды</h4>
              <ul className="space-y-2">
                {brands.map((brand:any) => (
                    <li key={brand.id}>
                      <Link
                          to={`/catalog?brand=${encodeURIComponent(brand.name)}`}
                          className="text-sm hover:text-green-500 transition-colors"
                      >
                        {brand.name}
                      </Link>
                    </li>
                ))}

                {brands.length === 0 && (
                    <li className="text-sm text-gray-500">Бренды загружаются...</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Контакты</h4>
              <ul className="space-y-3">
                {contact?.phone && (
                    <li>
                      <a
                          href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                          className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </a>
                    </li>
                )}

                {contact?.email && (
                    <li>
                      <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </a>
                    </li>
                )}

                {contact?.whatsappUrl && (
                    <li>
                      <a
                          href={contact.whatsappUrl}
                          className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </li>
                )}
              </ul>

              <div className="mt-4 text-sm">
                {contact?.addressShort && <p>{contact.addressShort}</p>}
                {contact?.workingHours && <p className="mt-2">{contact.workingHours}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">
                © {currentYear} {settings?.legalName || 'ООО "Аграрис Текник"'}. Все права защищены.
              </p>

              <div className="flex gap-6 text-sm">
                <a
                    href={settings?.privacyPolicyUrl || '#'}
                    className="hover:text-green-500 transition-colors"
                >
                  Политика конфиденциальности
                </a>
                <a
                    href={settings?.termsUrl || '#'}
                    className="hover:text-green-500 transition-colors"
                >
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}