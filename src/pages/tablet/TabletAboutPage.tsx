import { Building2, Users, Globe2, Award, CheckCircle2, ArrowRight, Shield, Target } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export function TabletAboutPage() {
  const achievements = [
    { year: '2014', title: 'Основание компании', description: 'Начало работы на рынке Беларуси' },
    { year: '2016', title: 'Партнерство с Германией', description: 'Сотрудничество с Export von Kraftwagen' },
    { year: '2020', title: '500+ клиентов', description: 'Достигли важной вехи доверия' },
    { year: '2024', title: '10 лет на рынке', description: 'Юбилейный год компании' }
  ];

  const advantages = [
    'Прямые поставки из Европы',
    'Проверка каждой единицы техники',
    'Полный пакет документов',
    'Официальная гарантия',
    'Помощь в растаможке',
    'Сервисная поддержка',
    'Консультация экспертов',
    'Финансовые решения'
  ];

  const values = [
    { icon: Shield, title: 'Качество', description: 'Проверенная европейская техника' },
    { icon: Users, title: 'Доверие', description: 'Открытые и честные отношения' },
    { icon: Target, title: 'Результат', description: 'Решаем задачи клиентов' }
  ];

  return (
    <div className="bg-white">
      {/* Hero - Tablet */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">ООО "Аграрис Текник"</span>
              </div>
              <h1 className="text-4xl mb-6 text-gray-900">
                О компании<br/>
                <span className="text-green-700">Agraris</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Европейская сельскохозяйственная техника в Беларуси с 2014 года
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors">
                Связаться с нами
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-600 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1758873115193-bc8eab1b87bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeSUyMGZpZWxkfGVufDF8fHx8MTc2NjA1ODkxNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Сельскохозяйственная техника"
                className="relative rounded-2xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Info - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            <Card className="border-2 border-green-100">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-4 text-gray-900">Наша миссия</h2>
                <p className="text-gray-600 leading-relaxed">
                  ООО "Аграрис Текник" — белорусская компания, специализирующаяся на поставке качественной европейской сельскохозяйственной техники. Мы стремимся предоставлять нашим клиентам лучшие решения для развития их бизнеса.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-100">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-4 text-gray-900">Партнерство</h2>
                <p className="text-gray-600 leading-relaxed">
                  С 2014 года мы работаем в тесном партнерстве с немецкой компанией Export von Kraftwagen Anlagen u. Maschinen Deutschland, что позволяет предлагать проверенную технику напрямую из Европы.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values - Tablet */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Наши ценности</h2>
          <div className="grid grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-green-700 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Agraris в цифрах</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="text-5xl text-green-700 mb-3">10+</div>
              <div className="text-gray-600">Лет успешной работы</div>
            </div>
            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="text-5xl text-green-700 mb-3">500+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="text-5xl text-green-700 mb-3">8</div>
              <div className="text-gray-600">Ведущих брендов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Tablet */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">История развития</h2>
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((item, index) => (
              <div key={index} className="flex gap-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-green-700 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages - Tablet */}
      <section className="py-16 px-6 bg-green-700 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-2 gap-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span>{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-green-700">
            <CardContent className="p-10">
              <div className="text-center">
                <Globe2 className="w-16 h-16 text-green-700 mx-auto mb-6" />
                <h3 className="text-2xl mb-4 text-gray-900">Международное партнерство</h3>
                <p className="text-gray-600 mb-8">
                  Мы работаем напрямую с немецкой компанией <strong>Export von Kraftwagen Anlagen u. Maschinen Deutschland</strong>, что гарантирует качество и надежность поставляемой техники.
                </p>
                <a href="/contact" className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-colors">
                  Стать партнером
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
