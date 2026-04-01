import { About } from '../components/About';
import { Advantages } from '../components/Advantages';
import { Award, Target, Users, Shield, Building2, Globe2, CheckCircle2, Handshake, ArrowRight } from 'lucide-react';
import {useEffect, useState} from "react";
import {AppPageLoader} from "../components/AppPageLoader";

export function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Качество',
      description: 'Только проверенная европейская техника с гарантией качества'
    },
    {
      icon: Target,
      title: 'Индивидуальный подход',
      description: 'Консультации специалистов при подборе оптимального варианта'
    },
    {
      icon: Users,
      title: 'Профессионализм',
      description: 'Опытная команда с глубокими знаниями рынка агротехники'
    },
    {
      icon: Shield,
      title: 'Надежность',
      description: 'Предпродажная подготовка и полное гарантийное обслуживание'
    }
  ];

  const companyInfo = [
    {
      icon: Building2,
      title: 'Организационно-правовая форма',
      value: 'Общество с ограниченной ответственностью',
      details: 'ООО "Аграрис Текник"'
    },
    {
      icon: Globe2,
      title: 'Год основания',
      value: '2014',
      details: '11 лет успешной работы на рынке'
    },
    {
      icon: CheckCircle2,
      title: 'Уставной фонд',
      value: '10 тыс. USD - 50 тыс. USD',
      details: 'Стабильная финансовая основа'
    },
    {
      icon: Handshake,
      title: 'Партнерство',
      value: 'Export von Kraftwagen',
      details: 'Немецкая компания-партнер'
    }
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AppPageLoader />;
  }

  return (
    <div>
      {/* Page Header - New Design */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">ООО "Аграрис Текник"</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
                О компании<br/>
                <span className="text-green-700">Agraris</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Европейская сельскохозяйственная техника в Беларуси с 2014 года
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#company-info" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors">
                  Узнать больше
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
                  Связаться с нами
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-600 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1758873115193-bc8eab1b87bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeSUyMGZpZWxkfGVufDF8fHx8MTc2NjA1ODkxNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Сельскохозяйственная техника"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <About />

      {/* Company Information Cards */}
      <section id="company-info" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Информация о компании
            </h2>
            <p className="text-xl text-gray-600">
              Официальные данные и структура организации
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm text-gray-500 mb-2">{info.title}</h3>
                  <p className="text-gray-900 mb-1">{info.value}</p>
                  <p className="text-sm text-gray-600">{info.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
              <h3 className="text-2xl mb-4 text-gray-900">Наша миссия</h3>
              <p className="text-lg text-gray-600">
                Обеспечивать сельскохозяйственные предприятия Беларуси, России и Казахстана качественной европейской
                техникой, способствуя развитию современного и эффективного аграрного сектора. Мы стремимся быть надежным
                партнером, предлагая не только технику, но и комплексную поддержку на всех этапах сотрудничества.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-300">
              <h3 className="text-2xl mb-4 text-gray-900">Наше видение</h3>
              <p className="text-lg text-gray-600">
                Стать ведущим поставщиком европейской сельскохозяйственной техники в Беларуси, России и Казахстане,
                признанным за высочайшие стандарты обслуживания, прозрачность в бизнесе и долгосрочные партнерские
                отношения. Мы верим в индивидуальный подход к каждому клиенту и профессиональную экспертизу.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Наши преимущества
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Почему выбирают ООО "Аграрис Текник"
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-700" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Advantages />

      {/* History Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Наша история
            </h2>
            <p className="text-xl text-gray-600">
              Путь развития компании с 2014 года
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                year: '2014',
                title: 'Основание компании',
                description: 'Создание ООО "Аграрис Текник" и начало партнерства с немецкой компанией Export von Kraftwagen Anlagen u. Maschinen Deutschland'
              },
              {
                year: '2015',
                title: 'Первые поставки',
                description: 'Успешные поставки техники из Германии и Голландии, формирование базы постоянных клиентов'
              },
              {
                year: '2017',
                title: 'Расширение ассортимента',
                description: 'Добавление новых брендов и категорий техники: тракторов, комбайнов, прицепного оборудования'
              },
              {
                year: '2019',
                title: 'Развитие сервиса',
                description: 'Внедрение программы предпродажной подготовки и гарантийного обслуживания техники'
              },
              {
                year: '2021',
                title: 'Цифровизация',
                description: 'Запуск онлайн-каталога и системы удаленного подбора техники для клиентов'
              },
              {
                year: '2025',
                title: 'Укрепление позиций',
                description: 'Более 500 довольных клиентов, надежный партнер аграриев Беларуси'
              }
            ].map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    {milestone.year}
                  </div>
                </div>
                <div className="pt-3 flex-1">
                  <h3 className="text-xl mb-2 text-gray-900">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}