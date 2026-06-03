import { Hero } from '../components/Hero';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tractor, Combine, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {getAllActiveProducts, getAllCategories, getBrands,getTopBrands, getRootCategories} from '../services/strapi';
import {AppPageLoader} from "../components/AppPageLoader";
import {useLeadModal} from "../contexts/LeadModalContext";

export function Home() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openCallback } = useLeadModal();
  const featuredEquipment = [
    {
      icon: Tractor,
      title: 'Тракторы',
      description: 'Мощные и надежные тракторы для любых работ',
      count: '20+ моделей',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Combine,
      title: 'Комбайны',
      description: 'Современные зерноуборочные комбайны',
      count: '20+ моделей',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Truck,
      title: 'Прицепное оборудование',
      description: 'Полный спектр навесного оборудования',
      count: '20+ позиций',
      image: 'https://images.unsplash.com/photo-1639334189162-4b25b8aa4ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY2MDE1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];


  useEffect(() => {
    async function loadBrands() {
      try {
        setLoading(true);
        const data = await getTopBrands();
        setBrands(data);
        await new Promise((resolve) => setTimeout(resolve, 100));

      } catch (error) {
        console.error('Failed to load catalog data:', error);
      }finally {
        setLoading(false);
      }
    }
    loadBrands().then();
  }, []);

  // if (loading) {
  //   return <AppPageLoader />;
  // }

  return (
      <div>
        <Hero />

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

            <div className="grid md:grid-cols-3 gap-8">
              {featuredEquipment.map((item, index) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={index}
                        className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow border-gray-200"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <CardHeader className="flex flex-col flex-grow pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <Icon className="w-8 h-8 text-green-700" />
                          <Badge className="bg-green-700">{item.count}</Badge>
                        </div>

                        <CardTitle className="text-gray-900">{item.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
                Поставляем технику ведущих брендов
              </h2>
              <p className="text-lg text-gray-600">
                Работаем напрямую с производителями
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brands.slice(0, 8).map((brand:any) => (
                  <div
                      key={brand.id}
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24"
                  >
                    <span className="text-gray-700">{brand.name}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>

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
                <button className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-green-700 hover:bg-gray-100 transition-colors">
                  Связаться с нами
                </button>
              </Link>
              <button onClick={openCallback} className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-white hover:bg-green-800 transition-colors">
                Заказать звонок
              </button>
            </div>
          </div>
        </section>
      </div>
  );
}