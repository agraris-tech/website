import { CheckCircle2 } from 'lucide-react';

export function Advantages() {
  const advantages = [
    {
      title: 'Официальный дилер',
      description: 'Работаем напрямую с производителями, гарантируем оригинальность техники'
    },
    {
      title: 'Выгодные цены',
      description: 'Конкурентные цены на новую и б/у технику, гибкая система скидок'
    },
    {
      title: 'Финансирование',
      description: 'Помощь в оформлении лизинга и кредита на выгодных условиях'
    },
    {
      title: 'Гарантия качества',
      description: 'Предпродажная подготовка и гарантия на всю реализуемую технику'
    },
    {
      title: 'Сервисное обслуживание',
      description: 'Собственный сервисный центр с квалифицированными специалистами'
    },
    {
      title: 'Trade-in',
      description: 'Принимаем вашу старую технику в зачет при покупке новой'
    }
  ];

  return (
    <section id="advantages" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
            Почему выбирают нас
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Agraris — это надежный партнер в развитии вашего агробизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <div key={index} className="flex gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle2 className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}