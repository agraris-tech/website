import { Menu, X, Phone, Mail, ChevronDown, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [equipmentMenuOpen, setEquipmentMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navItems = [
    { label: 'Главная', href: '/' },
    { label: 'О нас', href: '/about' },
    { 
      label: 'Техника', 
      href: '/equipment',
      hasSubmenu: true
    },
    { label: 'Контакты', href: '/contact' },
  ];

  const brands = [
    'John Deere',
    'Case IH',
    'New Holland',
    'Claas',
    'Fendt',
    'Massey Ferguson',
    'Deutz-Fahr',
    'Valtra'
  ];

  const equipmentCategories = [
    { label: 'Новая техника', href: '/equipment#new' },
    { label: 'Техника Б/У', href: '/equipment#used' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <a href="tel:+375295254437" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+375 (29) 525-44-37</span>
              </a>
              <a href="mailto:agraristech2@gmail.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors">
                <Mail className="w-4 h-4" />
                <span>agraristech2@gmail.com</span>
              </a>
            </div>
            <div className="text-sm text-gray-600">
              Пн-Пт: 9:00 - 18:00
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Agraris Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl text-green-700">AGRARIS</h1>
                <p className="text-xs text-gray-600">Сельхозтехника</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 items-center">
              {navItems.map((item) => (
                item.hasSubmenu ? (
                  <div 
                    key={item.label} 
                    className="relative"
                    onMouseEnter={() => setEquipmentMenuOpen(true)}
                    onMouseLeave={() => setEquipmentMenuOpen(false)}
                  >
                    <Link 
                      to={item.href}
                      className={`flex items-center gap-1 transition-colors ${
                        location.pathname === item.href ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    {equipmentMenuOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-4 px-6 min-w-[500px] grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm text-gray-500 mb-3">Категории</h3>
                          <ul className="space-y-2">
                            {equipmentCategories.map((category) => (
                              <li key={category.label}>
                                <a href={category.href} className="text-gray-700 hover:text-green-700 transition-colors block">
                                  {category.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-500 mb-3">Бренды</h3>
                          <ul className="space-y-2">
                            {brands.map((brand) => (
                              <li key={brand}>
                                <a href={`/equipment#brand-${brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-700 hover:text-green-700 transition-colors block">
                                  {brand}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`transition-colors ${
                      location.pathname === item.href ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className={`w-6 h-6 ${location.pathname === '/cart' ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Button className="bg-green-700 hover:bg-green-800">
                Заказать звонок
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              item.hasSubmenu ? (
                <div key={item.label}>
                  <button 
                    className="w-full text-left py-3 text-gray-700 hover:text-green-700 transition-colors flex items-center justify-between"
                    onClick={() => setEquipmentMenuOpen(!equipmentMenuOpen)}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${equipmentMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {equipmentMenuOpen && (
                    <div className="pl-4 pb-2 space-y-2">
                      <div className="text-sm text-gray-500 mb-2">Категории:</div>
                      {equipmentCategories.map((category) => (
                        <a
                          key={category.label}
                          href={category.href}
                          className="block py-2 text-gray-600 hover:text-green-700 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.label}
                        </a>
                      ))}
                      <div className="text-sm text-gray-500 mt-3 mb-2">Бренды:</div>
                      {brands.map((brand) => (
                        <a
                          key={brand}
                          href={`/equipment#brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-2 text-gray-600 hover:text-green-700 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {brand}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block py-3 transition-colors ${
                    location.pathname === item.href ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              to="/cart"
              className={`flex items-center justify-between py-3 transition-colors ${
                location.pathname === '/cart' ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Корзина</span>
              {totalItems > 0 && (
                <span className="bg-green-700 text-white text-xs rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button className="w-full mt-4 bg-green-700 hover:bg-green-800">
              Заказать звонок
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}