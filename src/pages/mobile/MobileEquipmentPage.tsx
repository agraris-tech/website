import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tractor, Shield, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';

export function MobileEquipmentPage() {
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
      {/* Hero - Mobile */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-green-700 to-green-600 text-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Tractor className="w-4 h-4" />
            <span className="text-sm">Каталог</span>
          </div>
          <h1 className="text-3xl mb-4">
            Наша техника
          </h1>
          <p className="text-green-100 mb-6">
            Качественная европейская сельхозтехника
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-1">50+</div>
              <div className="text-xs text-green-100">Единиц в наличии</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-1">8</div>
              <div className="text-xs text-green-100">Ведущих брендов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter - Mobile */}
      <section className="py-6 px-4 bg-gray-50 sticky top-0 z-40">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Фильтр:</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-green-700' : ''}
            size="sm"
          >
            Все
          </Button>
          <Button
            onClick={() => setFilter('new')}
            variant={filter === 'new' ? 'default' : 'outline'}
            className={filter === 'new' ? 'bg-green-700' : ''}
            size="sm"
          >
            Новая
          </Button>
          <Button
            onClick={() => setFilter('used')}
            variant={filter === 'used' ? 'default' : 'outline'}
            className={filter === 'used' ? 'bg-green-700' : ''}
            size="sm"
          >
            Б/У
          </Button>
        </div>
      </section>

      {/* Equipment List - Mobile */}
      <section className="py-6 px-4">
        <div className="space-y-4">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="overflow-hidden" onClick={() => navigate(`/catalog/${item.id}`)}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={item.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
                    {item.condition}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.brand}</span>
                </div>
                <h3 className="text-lg mb-2 text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Мощность: {item.power}
                </p>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xl text-green-700">{item.price}</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-700 hover:bg-green-800" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/catalog/${item.id}`);
                      }}
                    >
                      Подробнее
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Banner - Mobile */}
      <section className="py-8 px-4 bg-green-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-green-700 mx-auto mb-4" />
          <h3 className="text-lg mb-2 text-gray-900">Гарантия качества</h3>
          <p className="text-sm text-gray-600">
            Вся техника проходит тщательную проверку перед продажей
          </p>
        </div>
      </section>
    </div>
  );
}