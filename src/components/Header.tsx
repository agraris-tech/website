import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from './ui/button';

import {
  getTopBrands,
  getSiteSettings,
} from '../services/strapi';

import { useLeadModal } from '../contexts/LeadModalContext';
import { useCart } from '../contexts/CartContext';

import {
  getRegionalContact,
  type SiteSettings,
} from '../lib/getRegionalContact';

import { getHostname } from '../lib/getHostname';

import {
  trackContactAndNavigate,
} from '../lib/googleAdsContacts';

// @ts-ignore
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';

type BrandItem = {
  id: number;
  name: string;
};

type NavItem = {
  label: string;
  href: string;
  hasSubmenu?: boolean;
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [equipmentMenuOpen, setEquipmentMenuOpen] =
      useState(false);

  const [settings, setSettings] =
      useState<SiteSettings | null>(null);

  const [brands, setBrands] = useState<BrandItem[]>([]);

  const location = useLocation();

  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const { openCallback } = useLeadModal();

  const contact = getRegionalContact(
      settings,
      getHostname(),
  );

  const phoneHref = contact?.phone
      ? `tel:${contact.phone.replace(/[^\d+]/g, '')}`
      : '';

  const emailHref = contact?.email
      ? `mailto:${contact.email}`
      : '';

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const [siteSettings, brandItems] =
            await Promise.all([
              getSiteSettings(),
              getTopBrands(5),
            ]);

        setSettings(siteSettings);
        setBrands(brandItems);
      } catch (error) {
        console.error(
            'Failed to load header data:',
            error,
        );
      }
    }

    loadHeaderData().catch(console.error);
  }, []);

  const navItems: NavItem[] = [
    {
      label: 'Главная',
      href: '/',
    },
    {
      label: 'О нас',
      href: '/about',
    },
    {
      label: 'Каталог',
      href: '/catalog',
    },
    {
      label: 'Новости',
      href: '/news',
    },
    {
      label: 'Контакты',
      href: '/contact',
    },
  ];

  const equipmentCategories = [
    {
      label: 'Новая техника',
      href: '/catalog?type=new',
    },
    {
      label: 'Техника Б/У',
      href: '/catalog?type=used',
    },
  ];

  return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-100 py-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                {contact?.phone && (
                    {contact?.phone && phoneHref && (
                        <a
                            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                            href={phoneHref}
                            onClick={(event) => {
                              event.preventDefault();

                              trackContactAndNavigate(
                                  'phone',
                                  phoneHref,
                              );
                            }}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors"
                        >
                          <Phone className="w-4 h-4"/>
                          <span>{contact.phone}</span>

                          <span>
                                        {contact.phone}
                                    </span>
                        </a>
                    )}

                {contact?.email && (
                {contact?.email && emailHref && (
                  <a
                  href={`mailto:${contact.email}`}
                   href={emailHref}
                   onClick={(event) => {
                     event.preventDefault();

                     trackContactAndNavigate(
                         'email',
                         emailHref,
                     );
                   }}
                   className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors"
              >
                <Mail className="w-4 h-4"/>
                <span>{contact.email}</span>

                <span>
                                        {contact.email}
                                    </span>
              </a>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {contact?.workingHours || ''}
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="flex justify-between items-center">
            <Link
                to="/"
                className="flex items-center gap-3"
            >
              <img
                  src={logo}
                  alt="Agraris Logo"
                  className="w-12 h-12 object-contain"
              />

              <div>
                <h1 className="text-xl text-green-700">
                  {settings?.companyName ||
                      'AGRARIS'}
                </h1>

                <p className="text-xs text-gray-600">
                  {settings?.companySubtitle ||
                      'Сельхозтехника'}
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex gap-8 items-center">
              {navItems.map((item) =>
                  item.hasSubmenu ? (
                      <div
                          key={item.label}
                          className="relative"
                          onMouseEnter={() =>
                              setEquipmentMenuOpen(
                                  true,
                              )
                          }
                          onMouseLeave={() =>
                              setEquipmentMenuOpen(
                                  false,
                              )
                          }
                      >
                        <Link
                            to={item.href}
                            className={`flex items-center gap-1 transition-colors ${
                                location.pathname ===
                                item.href
                                    ? 'text-green-700'
                                    : 'text-gray-700 hover:text-green-700'
                            }`}
                        >
                          {item.label}

                          <ChevronDown className="w-4 h-4"/>
                        </Link>

                        {equipmentMenuOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                              <div
                                  className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8"
                                  style={{
                                    width: '600px',
                                  }}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="text-sm text-gray-400 mb-6 uppercase tracking-wide">
                                      Категории
                                    </h3>

                                    <ul className="space-y-8">
                                      {equipmentCategories.map(
                                          (
                                              category,
                                          ) => (
                                              <li
                                                  key={
                                                    category.label
                                                  }
                                              >
                                                <Link
                                                    to={
                                                      category.href
                                                    }
                                                    className="block text-gray-800 hover:text-green-700 transition-colors text-[17px] leading-7"
                                                >
                                                  {
                                                    category.label
                                                  }
                                                </Link>
                                              </li>
                                          ),
                                      )}
                                    </ul>
                                  </div>

                                  <div className="border-l border-gray-100 pl-8">
                                    <h3 className="text-sm text-gray-400 mb-6 uppercase tracking-wide">
                                      Бренды
                                    </h3>

                                    <ul className="grid grid-cols-2 gap-x-20 gap-y-8">
                                      {brands.map(
                                          (
                                              brand,
                                          ) => (
                                              <li
                                                  key={
                                                    brand.id
                                                  }
                                              >
                                                <Link
                                                    to={`/catalog?brand=${encodeURIComponent(
                                                        brand.name,
                                                    )}`}
                                                    className="block text-gray-800 hover:text-green-700 transition-colors text-[17px] leading-7 whitespace-nowrap"
                                                >
                                                  {
                                                    brand.name
                                                  }
                                                </Link>
                                              </li>
                                          ),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                        )}
                      </div>
                  ) : (
                      <Link
                          key={item.label}
                          to={item.href}
                          className={`transition-colors ${
                              location.pathname ===
                              item.href
                                  ? 'text-green-700'
                                  : 'text-gray-700 hover:text-green-700'
                          }`}
                      >
                        {item.label}
                      </Link>
                  ),
              )}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button
                  onClick={openCallback}
                  className="bg-green-700 hover:bg-green-800"
              >
                {contact?.callbackButtonText ||
                    'Заказать звонок'}
              </Button>
            </div>

            <button
                type="button"
                aria-label={
                  mobileMenuOpen
                      ? 'Закрыть меню'
                      : 'Открыть меню'
                }
                className="md:hidden p-2"
                onClick={() =>
                    setMobileMenuOpen(
                        !mobileMenuOpen,
                    )
                }
            >
              {mobileMenuOpen ? (
                  <X className="w-6 h-6"/>
              ) : (
                  <Menu className="w-6 h-6"/>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
        <nav className="md:hidden py-4 border-t border-gray-100">
          {navItems.map((item) =>
              item.hasSubmenu ? (
                  <div key={item.label}>
                    <button
                        type="button"
                        className="w-full text-left py-3 text-gray-700 hover:text-green-700 transition-colors flex items-center justify-between"
                        onClick={() =>
                            setEquipmentMenuOpen(
                                !equipmentMenuOpen,
                            )
                        }
                    >
                      {item.label}

                      <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                              equipmentMenuOpen
                                  ? 'rotate-180'
                                  : ''
                          }`}
                      />
                    </button>

                    {equipmentMenuOpen && (
                        <div className="pl-4 pb-2 space-y-2">
                          <div className="text-sm text-gray-500 mb-2">
                            Категории:
                          </div>

                          {equipmentCategories.map(
                              (category) => (
                                  <Link
                                      key={
                                        category.label
                                      }
                                      to={
                                        category.href
                                      }
                                      className="block py-2 text-gray-600 hover:text-green-700 transition-colors"
                                      onClick={() =>
                                          setMobileMenuOpen(
                                              false,
                                          )
                                      }
                                  >
                                    {
                                      category.label
                                    }
                                  </Link>
                              ),
                          )}

                          <div className="text-sm text-gray-500 mt-3 mb-2">
                            Бренды:
                          </div>

                          {brands.map(
                              (brand) => (
                                  <Link
                                      key={
                                        brand.id
                                      }
                                      to={`/catalog?brand=${encodeURIComponent(
                                          brand.name,
                                      )}`}
                                      className="block py-2 text-gray-600 hover:text-green-700 transition-colors"
                                      onClick={() =>
                                          setMobileMenuOpen(
                                              false,
                                          )
                                      }
                                  >
                                    {
                                      brand.name
                                    }
                                  </Link>
                              ),
                          )}
                        </div>
                    )}
                  </div>
              ) : (
                  <Link
                      key={item.label}
                      to={item.href}
                      className={`block py-3 transition-colors ${
                          location.pathname ===
                          item.href
                              ? 'text-green-700'
                              : 'text-gray-700 hover:text-green-700'
                      }`}
                      onClick={() =>
                          setMobileMenuOpen(false)
                      }
                  >
                    {item.label}
                  </Link>
              ),
          )}

          <Link
              to="/cart"
              className={`flex items-center justify-between py-3 transition-colors ${
                  location.pathname === '/cart'
                      ? 'text-green-700'
                      : 'text-gray-700 hover:text-green-700'
              }`}
              onClick={() =>
                  setMobileMenuOpen(false)
              }
          >
            <span>Корзина</span>

            {totalItems > 0 && (
                <span className="bg-green-700 text-white text-xs rounded-full px-2 py-1">
                                    {totalItems}
                                </span>
            )}
          </Link>

          <Button
              onClick={openCallback}
              className="w-full mt-4 bg-green-700 hover:bg-green-800"
          >
            {contact?.callbackButtonText ||
                'Заказать звонок'}
          </Button>
        </nav>
        )}
      </div>
</header>
)
  ;
}