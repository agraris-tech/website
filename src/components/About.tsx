import { Award, Users, TrendingUp, MapPin } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Award, value: '11+', label: 'Лет на рынке' },
    { icon: Users, value: '500+', label: 'Довольных клиентов' },
    { icon: TrendingUp, value: '300+', label: 'Единиц техники продано' },
    { icon: MapPin, value: '3', label: 'Страны-поставщики' },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              С 2014 года
            </div>
            <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">
              ООО "Аграрис Текник"
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              В сотрудничестве с немецкой компанией <span className="text-green-700">Export von Kraftwagen Anlagen u. Maschinen Deutschland</span> мы предлагаем качественную сельскохозяйственную технику из Германии, Голландии и других стран Европы.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Наша специализация — поставка новой и б/у техники от лучших европейских производителей. Мы обеспечиваем полную предпродажную подготовку, предоставляем гарантию и профессиональные консультации специалистов при подборе оптимального варианта для вашего хозяйства.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <Icon className="w-8 h-8 text-green-700 mb-3" />
                    <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1639334189162-4b25b8aa4ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY2MDE1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Сельскохозяйственная техника"
              className="rounded-lg shadow-xl w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-green-700 text-white p-6 rounded-lg shadow-xl max-w-xs">
              <p className="text-lg">
                Партнерство с ведущими европейскими поставщиками
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}