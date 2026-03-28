import { Hero } from '../components/Hero';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tractor, Combine, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const featuredEquipment = [
    {
      icon: Tractor,
      title: 'Тракторы',
      description: 'Мощные и надежные тракторы для любых работ',
      count: '50+ моделей',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Combine,
      title: 'Комбайны',
      description: 'Современные зерноуборочные комбайны',
      count: '30+ моделей',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Truck,
      title: 'Прицепное оборудование',
      description: 'Полный спектр навесного оборудования',
      count: '100+ позиций',
      image: 'https://images.unsplash.com/photo-1639334189162-4b25b8aa4ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY2MDE1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Featured Equipment Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Каталог техники
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Широкий выбор новой и б/у сельскохозяйственной техники
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredEquipment.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Icon className="w-8 h-8 text-green-700" />
                      <Badge className="bg-green-700">{item.count}</Badge>
                    </div>
                    <CardTitle className="text-gray-900">{item.title}</CardTitle>
                    <CardDescription className="text-gray-600">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/equipment">
                      <Button variant="outline" className="w-full">
                        Смотреть каталог
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/equipment">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Посмотреть весь каталог
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Официальный дилер ведущих брендов
            </h2>
            <p className="text-lg text-gray-600">
              Работаем напрямую с производителями
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['John Deere', 'Case IH', 'New Holland', 'Claas', 'Fendt', 'Massey Ferguson', 'Deutz-Fahr', 'Valtra'].map((brand, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24">
                <span className="text-gray-700">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Нужна консультация по выбору техники?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-white text-green-700 hover:bg-gray-100 border-white">
                Связаться с нами
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-800">
              Заказать звонок
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
