import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Phone, Mail, Tractor, Users, Award, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';

export function MobileHomePage() {
  const brands = [
    'John Deere', 'Case IH', 'New Holland', 'Claas',
    'Fendt', 'Massey Ferguson', 'Deutz-Fahr', 'Valtra'
  ];

  const features = [
    { icon: Shield, title: 'Гарантия качества', description: 'Европейская техника' },
    { icon: Users, title: 'Опыт', description: 'С 2014 года' },
    { icon: Award, title: 'Лучшие бренды', description: '8 производителей' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Mobile */}
      <section className="relative pt-6 pb-12 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="text-center mb-6">
          <img src={logo} alt="Agraris" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl mb-3 text-gray-900">
            Agraris
          </h1>
          <p className="text-gray-600 mb-6">
            Европейская сельхозтехника в Беларуси
          </p>
          <div className="flex flex-col gap-3">
            <a href="tel:+375295254437" className="w-full bg-green-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
            <Link to="/catalog" className="w-full border-2 border-green-700 text-green-700 py-3 px-6 rounded-lg flex items-center justify-center gap-2">
              Каталог техники
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Сельхозтехника"
            className="w-full h-48 object-cover"
          />
        </div>
      </section>

      {/* Features - Mobile */}
      <section className="py-10 px-4 bg-white">
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brands - Mobile */}
      <section className="py-10 px-4 bg-gray-50">
        <h2 className="text-2xl text-center mb-6 text-gray-900">Наши бренды</h2>
        <div className="grid grid-cols-2 gap-3">
          {brands.map((brand) => (
            <div key={brand} className="bg-white p-4 rounded-lg text-center shadow-sm">
              <p className="text-sm text-gray-700">{brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats - Mobile */}
      <section className="py-10 px-4 bg-green-700 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">Почему мы?</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <div className="text-3xl mb-2">10+</div>
            <div className="text-sm text-green-100">Лет на рынке</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <div className="text-3xl mb-2">500+</div>
            <div className="text-sm text-green-100">Довольных клиентов</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <div className="text-3xl mb-2">50+</div>
            <div className="text-sm text-green-100">Единиц техники</div>
          </div>
        </div>
      </section>

      {/* CTA - Mobile */}
      <section className="py-10 px-4 bg-white">
        <Card className="border-2 border-green-700">
          <CardContent className="p-6">
            <h3 className="text-xl mb-4 text-gray-900 text-center">Нужна консультация?</h3>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Свяжитесь с нами удобным способом
            </p>
            <div className="space-y-3">
              <a href="tel:+375295254437" className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-700" />
                <div>
                  <div className="text-sm text-gray-600">Телефон</div>
                  <div className="text-gray-900">+375 (29) 525-44-37</div>
                </div>
              </a>
              <a href="mailto:agraristech2@gmail.com" className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-700" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-gray-900">agraristech2@gmail.com</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
