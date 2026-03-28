import { Tractor, Combine, Truck, Cog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function Equipment() {
  const equipmentCategories = [
    {
      icon: Tractor,
      title: 'Тракторы',
      description: 'Мощные и надежные тракторы для любых сельскохозяйственных работ',
      models: ['50-100 л.с.', '100-200 л.с.', '200+ л.с.'],
      badge: 'Новые и Б/У'
    },
    {
      icon: Combine,
      title: 'Комбайны',
      description: 'Зерноуборочные и кормоуборочные комбайны последнего поколения',
      models: ['Зерноуборочные', 'Кормоуборочные', 'Картофелеуборочные'],
      badge: 'В наличии'
    },
    {
      icon: Truck,
      title: 'Прицепное оборудование',
      description: 'Широкий ассортимент навесного и прицепного оборудования',
      models: ['Плуги', 'Сеялки', 'Культиваторы', 'Прицепы'],
      badge: 'Новые'
    },
    {
      icon: Cog,
      title: 'Запчасти и сервис',
      description: 'Оригинальные запчасти и профессиональное обслуживание',
      models: ['Запчасти', 'ТО', 'Ремонт', 'Диагностика'],
      badge: 'Всегда в наличии'
    }
  ];

  return (
    <section id="equipment" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
            Наша техника
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Широкий выбор сельскохозяйственной техники от мировых лидеров
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {equipmentCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-8 h-8 text-green-700" />
                    </div>
                    <Badge className="bg-green-700">{category.badge}</Badge>
                  </div>
                  <CardTitle className="text-gray-900">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.models.map((model, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {model}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Brands section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl mb-8 text-center text-gray-900">
            Официальный дилер ведущих брендов
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['John Deere', 'Case IH', 'New Holland', 'Claas', 'Fendt', 'Massey Ferguson', 'Deutz-Fahr', 'Valtra'].map((brand, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                <span className="text-gray-700">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
