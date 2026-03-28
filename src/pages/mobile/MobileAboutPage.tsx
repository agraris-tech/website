import { Building2, Users, Globe2, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export function MobileAboutPage() {
  const achievements = [
    { year: '2014', title: 'Основание компании', description: 'Начало работы на рынке Беларуси' },
    { year: '2016', title: 'Партнерство с Германией', description: 'Сотрудничество с Export von Kraftwagen' },
    { year: '2020', title: '500+ клиентов', description: 'Достигли важной вехи' },
    { year: '2024', title: '10 лет на рынке', description: 'Юбилей компании' }
  ];

  const advantages = [
    'Прямые поставки из Европы',
    'Проверка каждой единицы техники',
    'Полный пакет документов',
    'Гарантия на всю технику',
    'Помощь в растаможке',
    'Сервисная поддержка'
  ];

  return (
    <div className="bg-white">
      {/* Hero - Mobile */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-green-700 to-green-600 text-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">ООО "Аграрис Текник"</span>
          </div>
          <h1 className="text-3xl mb-4">
            О компании Agraris
          </h1>
          <p className="text-green-100">
            Европейская техника в Беларуси с 2014 года
          </p>
        </div>
      </section>

      {/* Company Info - Mobile */}
      <section className="py-10 px-4">
        <Card className="border-2 border-green-100">
          <CardContent className="p-6">
            <h2 className="text-xl mb-4 text-gray-900">Кто мы?</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              ООО "Аграрис Текник" — белорусская компания, специализирующаяся на поставке качественной европейской сельскохозяйственной техники.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              С 2014 года мы работаем в тесном партнерстве с немецкой компанией Export von Kraftwagen Anlagen u. Maschinen Deutschland, что позволяет нам предлагать клиентам проверенную технику напрямую из Европы.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats - Mobile */}
      <section className="py-10 px-4 bg-gray-50">
        <h2 className="text-2xl text-center mb-6 text-gray-900">Наши достижения</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <div className="text-3xl text-green-700 mb-2">10+</div>
            <div className="text-sm text-gray-600">Лет на рынке</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <div className="text-3xl text-green-700 mb-2">500+</div>
            <div className="text-sm text-gray-600">Довольных клиентов</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <div className="text-3xl text-green-700 mb-2">8</div>
            <div className="text-sm text-gray-600">Ведущих брендов</div>
          </div>
        </div>
      </section>

      {/* Timeline - Mobile */}
      <section className="py-10 px-4 bg-white">
        <h2 className="text-2xl mb-6 text-gray-900">История развития</h2>
        <div className="space-y-4">
          {achievements.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  {item.year}
                </div>
                {index < achievements.length - 1 && (
                  <div className="w-0.5 h-full bg-green-200 my-2"></div>
                )}
              </div>
              <div className="pb-6 flex-1">
                <h3 className="text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages - Mobile */}
      <section className="py-10 px-4 bg-green-700 text-white">
        <h2 className="text-2xl text-center mb-6">Почему выбирают нас</h2>
        <div className="space-y-3">
          {advantages.map((advantage, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-sm">{advantage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership - Mobile */}
      <section className="py-10 px-4 bg-white">
        <Card className="border-2 border-green-700">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Globe2 className="w-12 h-12 text-green-700 mx-auto mb-3" />
              <h3 className="text-xl mb-2 text-gray-900">Международное партнерство</h3>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Мы работаем напрямую с немецкой компанией <strong>Export von Kraftwagen Anlagen u. Maschinen Deutschland</strong>, что гарантирует качество и надежность поставляемой техники.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA - Mobile */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl mb-4 text-gray-900">Готовы к сотрудничеству?</h3>
          <p className="text-sm text-gray-600 mb-6">
            Свяжитесь с нами для консультации
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-green-700 text-white py-3 px-6 rounded-lg">
            Связаться с нами
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
