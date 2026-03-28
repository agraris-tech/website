import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tractor, Shield, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';

export function TabletEquipmentPage() {
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const equipmentList = [
    {
      id: 1,
      name: 'John Deere 6155R',
      brand: 'John Deere',
      power: '155 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'new',
      condition: 'Новая'
    },
    {
      id: 2,
      name: 'Case IH Axial-Flow 7150',
      brand: 'Case IH',
      power: '360 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'new',
      condition: 'Новая'
    },
    {
      id: 3,
      name: 'New Holland T7.270',
      brand: 'New Holland',
      power: '270 л.с.',
      price: '€85,000',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'used',
      condition: 'Б/У, 2020 г.'
    },
    {
      id: 4,
      name: 'Claas Lexion 760',
      brand: 'Claas',
      power: '435 л.с.',
      price: '€150,000',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'used',
      condition: 'Б/У, 2019 г.'
    },
    {
      id: 5,
      name: 'Fendt 936 Vario',
      brand: 'Fendt',
      power: '360 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'new',
      condition: 'Новая'
    },
    {
      id: 6,
      name: 'Massey Ferguson 7S.180',
      brand: 'Massey Ferguson',
      power: '180 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'new',
      condition: 'Новая'
    }
  ];

  const handleAddToCart = (item: typeof equipmentList[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      power: item.power,
      condition: item.condition,
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  const filteredEquipment = filter === 'all' 
    ? equipmentList 
    : equipmentList.filter(item => item.type === filter);

  return (
    <div className="bg-white">
      {/* Hero - Tablet */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 opacity-95"></div>
          <img
            src="https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjYwNTg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
              <Tractor className="w-4 h-4" />
              <span className="text-sm">Новая и б/у техника</span>
            </div>
            <h1 className="text-5xl mb-6">
              Каталог техники
            </h1>
            <p className="text-xl mb-12 text-green-100 max-w-2xl mx-auto">
              Качественная европейская сельскохозяйственная техника от ведущих производителей
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="text-4xl mb-2">50+</div>
                <div className="text-sm text-green-100">Единиц в наличии</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="text-4xl mb-2">8</div>
                <div className="text-sm text-green-100">Ведущих брендов</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-8 h-8" />
                  <div className="text-xl">Гарантия</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter - Tablet */}
      <section className="py-8 px-6 bg-gray-50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Фильтр по состоянию:</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                className={filter === 'all' ? 'bg-green-700' : ''}
              >
                Вся техника
              </Button>
              <Button
                onClick={() => setFilter('new')}
                variant={filter === 'new' ? 'default' : 'outline'}
                className={filter === 'new' ? 'bg-green-700' : ''}
              >
                Новая
              </Button>
              <Button
                onClick={() => setFilter('used')}
                variant={filter === 'used' ? 'default' : 'outline'}
                className={filter === 'used' ? 'bg-green-700' : ''}
              >
                Б/У
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid - Tablet */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={item.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
                      {item.condition}
                    </Badge>
                    <span className="text-sm text-gray-500">{item.brand}</span>
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 mb-4">
                    Мощность: {item.power}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl text-green-700">{item.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-green-700 hover:bg-green-800" 
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      В корзину
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/equipment/${item.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner - Tablet */}
      <section className="py-16 px-6 bg-green-700 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <Shield className="w-16 h-16 mb-6" />
              <h3 className="text-3xl mb-4">Гарантия качества</h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Каждая единица техники проходит тщательную проверку перед продажей. Мы предоставляем полный пакет документов и гарантийное обслуживание.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-sm text-green-100 mb-1">Техническая проверка</div>
                <div className="text-xl">100% техники проверено</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-sm text-green-100 mb-1">Документация</div>
                <div className="text-xl">Полный пакет докментов</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-sm text-green-100 mb-1">Поддержка</div>
                <div className="text-xl">Сервисное обслуживание</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}