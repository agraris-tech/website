import { Equipment } from '../components/Equipment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Tractor, ArrowRight, Shield, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

export function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const equipmentList = [
    {
      id: 1,
      name: 'John Deere 6155R',
      category: 'tractor',
      type: 'new',
      brand: 'John Deere',
      power: '155 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      condition: 'Новая'
    },
    {
      id: 2,
      name: 'Case IH Axial-Flow 7150',
      category: 'combine',
      type: 'new',
      brand: 'Case IH',
      power: '360 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      condition: 'Новая'
    },
    {
      id: 3,
      name: 'New Holland T7.270',
      category: 'tractor',
      type: 'used',
      brand: 'New Holland',
      power: '270 л.с.',
      price: '€85,000',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      condition: 'Б/У, 2020 г.'
    },
    {
      id: 4,
      name: 'Claas Lexion 760',
      category: 'combine',
      type: 'used',
      brand: 'Claas',
      power: '435 л.с.',
      price: '€150,000',
      image: 'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      condition: 'Б/У, 2019 г.'
    },
    {
      id: 5,
      name: 'Fendt 936 Vario',
      category: 'tractor',
      type: 'new',
      brand: 'Fendt',
      power: '360 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      condition: 'Новая'
    },
    {
      id: 6,
      name: 'Massey Ferguson 7S.180',
      category: 'tractor',
      type: 'new',
      brand: 'Massey Ferguson',
      power: '180 л.с.',
      price: 'По запросу',
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
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

  return (
    <div>
      {/* Page Header - New Design */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 opacity-95"></div>
          <img
            src="https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjYwNTg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
              <Tractor className="w-4 h-4" />
              <span className="text-sm">Новая и б/у техника</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Каталог техники
            </h1>
            <p className="text-xl mb-10 text-green-100">
              Качественная европейская сельскохозяйственная техника от ведущих производителей
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="text-3xl mb-2">50+</div>
                <div className="text-sm text-green-100">Единиц в наличии</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <div className="text-3xl mb-2">8</div>
                <div className="text-sm text-green-100">Ведущих брендов</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl col-span-2 md:col-span-1">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6" />
                  <div className="text-lg">Гарантия</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Equipment />

      {/* Equipment Catalog */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="new">Новая</TabsTrigger>
              <TabsTrigger value="used">Б/У</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipmentList.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={item.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
                          {item.condition}
                        </Badge>
                        <span className="text-sm text-gray-500">{item.brand}</span>
                      </div>
                      <CardTitle className="text-gray-900">{item.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Мощность: {item.power}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl text-green-700">{item.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-700 hover:bg-green-800"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          В корзину
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/equipment/${item.id}`)}>
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipmentList.filter(item => item.type === 'new').map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-700">{item.condition}</Badge>
                        <span className="text-sm text-gray-500">{item.brand}</span>
                      </div>
                      <CardTitle className="text-gray-900">{item.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Мощность: {item.power}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl text-green-700">{item.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-700 hover:bg-green-800"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          В корзину
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/equipment/${item.id}`)}>
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="used">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipmentList.filter(item => item.type === 'used').map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-blue-600">{item.condition}</Badge>
                        <span className="text-sm text-gray-500">{item.brand}</span>
                      </div>
                      <CardTitle className="text-gray-900">{item.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Мощность: {item.power}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl text-green-700">{item.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-700 hover:bg-green-800"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          В корзину
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/equipment/${item.id}`)}>
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}