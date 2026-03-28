import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Phone, Mail, Tractor, Users, Award, ArrowRight, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/d097aa7978abcdcbf60dc711079054870b2deb55.png';

export function TabletHomePage() {
  const brands = [
    'John Deere', 'Case IH', 'New Holland', 'Claas',
    'Fendt', 'Massey Ferguson', 'Deutz-Fahr', 'Valtra'
  ];

  const features = [
    { 
      icon: Shield, 
      title: 'Гарантия качества', 
      description: 'Проверенная европейская техника с полной документацией' 
    },
    { 
      icon: Users, 
      title: 'Опыт работы', 
      description: 'На рынке с 2014 года, партнерство с немецкой компанией' 
    },
    { 
      icon: Award, 
      title: 'Лучшие бренды', 
      description: 'Работаем с 8 ведущими производителями техники' 
    }
  ];

  const services = [
    'Продажа новой техники',
    'Продажа б/у техники',
    'Гарантийное обслуживание',
    'Консультация специалистов',
    'Подбор техники',
    'Помощь в оформлении'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Tablet */}
      <section className="relative pt-12 pb-16 px-6 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <img src={logo} alt="Agraris" className="w-20 h-20 mb-6" />
              <h1 className="text-4xl mb-4 text-gray-900">
                Agraris
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Европейская сельскохозяйственная техника в Беларуси с 2014 года
              </p>
              <div className="flex flex-col gap-4">
                <a href="tel:+375295254437" className="bg-green-700 text-white py-4 px-8 rounded-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors">
                  <Phone className="w-5 h-5" />
                  +375 (29) 525-44-37
                </a>
                <Link to="/equipment" className="border-2 border-green-700 text-green-700 py-4 px-8 rounded-lg flex items-center justify-center gap-3 hover:bg-green-50 transition-colors">
                  Каталог техники
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Сельхозтехника"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Наши преимущества</h2>
          <div className="grid grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-green-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-green-700 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands - Tablet */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Работаем с лучшими брендами</h2>
          <div className="grid grid-cols-4 gap-4">
            {brands.map((brand) => (
              <div key={brand} className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Tractor className="w-8 h-8 text-green-700 mx-auto mb-3" />
                <p className="text-sm text-gray-900">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Tablet */}
      <section className="py-16 px-6 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">Agraris в цифрах</h2>
            <p className="text-green-100">Доверие клиентов - наш главный приоритет</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/20">
              <div className="text-4xl mb-3">10+</div>
              <div className="text-green-100">Лет успешной работы</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/20">
              <div className="text-4xl mb-3">500+</div>
              <div className="text-green-100">Довольных клиентов</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/20">
              <div className="text-4xl mb-3">50+</div>
              <div className="text-green-100">Единиц в наличии</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Наши услуги</h2>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-900">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA - Tablet */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-green-700 shadow-xl">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl mb-3 text-gray-900">Остались вопросы?</h3>
                <p className="text-gray-600">
                  Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <a href="tel:+375295254437" className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <Phone className="w-8 h-8 text-green-700 mb-3" />
                  <div className="text-sm text-gray-600 mb-1">Позвоните нам</div>
                  <div className="text-gray-900">+375 (29) 525-44-37</div>
                </a>
                <a href="mailto:agraristech2@gmail.com" className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <Mail className="w-8 h-8 text-green-700 mb-3" />
                  <div className="text-sm text-gray-600 mb-1">Напишите нам</div>
                  <div className="text-gray-900">agraristech2@gmail.com</div>
                </a>
              </div>
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Пн-Пт: 9:00 - 18:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
