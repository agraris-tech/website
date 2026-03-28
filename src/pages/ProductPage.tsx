import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Shield,
  Package,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

// Данные о технике
const equipmentData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'John Deere 6155R',
    category: 'tractor',
    type: 'new',
    brand: 'John Deere',
    manufacturer: 'John Deere (США)',
    power: '155 л.с.',
    price: 'По запросу',
    condition: 'Новая',
    images: [
      'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1633966097065-c4273b9b5cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZW5naW5lJTIwZmFybXxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1646465579874-aae437cb2cdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwY2FiaW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Трактор John Deere 6155R представляет собой идеальное сочетание мощности, производительности и комфорта. Оснащенный современным двигателем мощностью 155 л.с., он идеально подходит для широкого спектра сельскохозяйственных работ. Трактор комплектуется новейшей системой управления, обеспечивающей точность и экономичность работы.',
    specifications: {
      'Мощность двигателя': '155 л.с. / 114 кВт',
      'Объем двигателя': '4.5 л',
      'Количество цилиндров': '4',
      'Трансмиссия': 'AutoPowr CVT',
      'Максимальная скорость': '50 км/ч',
      'Вес': '6200 кг',
      'Колесная база': '2700 мм'
    },
    warranty: '24 месяца или 2000 моточасов',
    deliveryTime: '2-4 недели с момента заказа'
  },
  '2': {
    id: 2,
    name: 'Case IH Axial-Flow 7150',
    category: 'combine',
    type: 'new',
    brand: 'Case IH',
    manufacturer: 'Case IH (США)',
    power: '360 л.с.',
    price: 'По запросу',
    condition: 'Новая',
    images: [
      'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1633966097065-c4273b9b5cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZW5naW5lJTIwZmFybXxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Зерноуборочный комбайн Case IH Axial-Flow 7150 - это передовая техника для эффективной уборки зерновых культур. Мощный двигатель 360 л.с. и роторная система обмолота обеспечивают высокую производительность и качество обработки зерна.',
    specifications: {
      'Мощность двигателя': '360 л.с. / 265 кВт',
      'Ширина жатки': '7.6 м',
      'Объем бункера': '10400 л',
      'Тип молотилки': 'Роторная Axial-Flow',
      'Система очистки': '5-ступенчатая',
      'Вес': '14500 кг'
    },
    warranty: '24 месяца или 1500 моточасов',
    deliveryTime: '3-5 недель с момента заказа'
  },
  '3': {
    id: 3,
    name: 'New Holland T7.270',
    category: 'tractor',
    type: 'used',
    brand: 'New Holland',
    manufacturer: 'New Holland (Италия)',
    power: '270 л.с.',
    price: '€85,000',
    condition: 'Б/У, 2020 г.',
    images: [
      'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1646465579874-aae437cb2cdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwY2FiaW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Мощный трактор New Holland T7.270 2020 года в отличном состоянии. Полностью обслужен и готов к работе. Техника из Германии, один владелец, полная сервисная история. Оснащен системой точного земледелия и современной кабиной с климат-контролем.',
    specifications: {
      'Мощность двигателя': '270 л.с. / 199 кВт',
      'Год выпуска': '2020',
      'Моточасы': '1850',
      'Трансмиссия': 'Auto Command CVT',
      'Максимальная скорость': '50 км/ч',
      'Вес': '8500 кг',
      'Страна происхождения': 'Германия'
    },
    warranty: '12 месяцев',
    deliveryTime: '1-2 недели с момента заказа'
  },
  '4': {
    id: 4,
    name: 'Claas Lexion 760',
    category: 'combine',
    type: 'used',
    brand: 'Claas',
    manufacturer: 'Claas (Германия)',
    power: '435 л.с.',
    price: '€150,000',
    condition: 'Б/У, 2019 г.',
    images: [
      'https://images.unsplash.com/photo-1635174815475-1c624f86808b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3R8ZW58MXx8fHwxNzY2MDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1633966097065-c4273b9b5cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZW5naW5lJTIwZmFybXxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Премиальный комбайн Claas Lexion 760 2019 года. Отличное техническое состояние, регулярное обслуживание у официального дилера. Комплектуется широкозахватной жаткой. Система автоматического управления APS Synflow Hybrid обеспечивает максимальную производительность.',
    specifications: {
      'Мощность двигателя': '435 л.с. / 320 кВт',
      'Год выпуска': '2019',
      'Моточасы': '980',
      'Ширина жатки': '9.2 м',
      'Объем бункера': '12000 л',
      'Тип молотилки': 'Гибридная APS',
      'Страна происхождения': 'Германия'
    },
    warranty: '12 месяцев',
    deliveryTime: '2-3 недели с момента заказа'
  },
  '5': {
    id: 5,
    name: 'Fendt 936 Vario',
    category: 'tractor',
    type: 'new',
    brand: 'Fendt',
    manufacturer: 'Fendt (Германия)',
    power: '360 л.с.',
    price: 'По запросу',
    condition: 'Новая',
    images: [
      'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1646465579874-aae437cb2cdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwY2FiaW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1633966097065-c4273b9b5cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZW5naW5lJTIwZmFybXxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Fendt 936 Vario - флагманская модель известного немецкого производителя. Легендарная трансмиссия Vario, непревзойденный комфорт и технологичность делают этот трактор лучшим выбором для профессионального фермерства. Система автоматического управления VarioGuide.',
    specifications: {
      'Мощность двигателя': '360 л.с. / 265 кВт',
      'Объем двигателя': '7.8 л',
      'Количество цилиндров': '6',
      'Трансмиссия': 'Vario CVT',
      'Максимальная скорость': '60 км/ч',
      'Вес': '10800 кг',
      'Подъемная сила': '10600 кг'
    },
    warranty: '24 месяца или 2000 моточасов',
    deliveryTime: '3-6 недель с момента заказа'
  },
  '6': {
    id: 6,
    name: 'Massey Ferguson 7S.180',
    category: 'tractor',
    type: 'new',
    brand: 'Massey Ferguson',
    manufacturer: 'Massey Ferguson (Франция)',
    power: '180 л.с.',
    price: 'По запросу',
    condition: 'Новая',
    images: [
      'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGV0YWlscyUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NjY1MDczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1646465579874-aae437cb2cdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwY2FiaW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MDczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Современный трактор серии 7S от Massey Ferguson сочетает в себе проверенную надежность и инновационные технологии. Идеальное решение для средних и крупных хозяйств. Эргономичная кабина и простое управление.',
    specifications: {
      'Мощность двигателя': '180 л.с. / 132 кВт',
      'Объем двигателя': '6.6 л',
      'Количество цилиндров': '4',
      'Трансмиссия': 'Dyna-6',
      'Максимальная скорость': '40 км/ч',
      'Вес': '7200 кг',
      'Подъемная сила': '7400 кг'
    },
    warranty: '24 месяца или 2000 моточасов',
    deliveryTime: '2-4 недели с момента заказа'
  }
};

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = id ? equipmentData[id] : null;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl mb-4">Товар не найден</h2>
        <Button onClick={() => navigate('/equipment')}>
          Вернуться к каталогу
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
      power: product.power,
      condition: product.condition,
    });
    toast.success(`${product.name} добавлен в корзину`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/equipment')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к каталогу
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="relative h-[500px] bg-gray-100">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-green-700 ring-2 ring-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - фото ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge className={product.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
                {product.condition}
              </Badge>
              <span className="ml-3 text-gray-500">{product.brand}</span>
            </div>

            <h1 className="text-4xl mb-4">{product.name}</h1>
            
            <div className="text-4xl text-green-700 mb-6">{product.price}</div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-4 mb-8">
              <Button 
                size="lg"
                className="flex-1 bg-green-700 hover:bg-green-800"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Добавить в корзину
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Связаться
              </Button>
            </div>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-4">Технические характеристики</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-900">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h4 className="mb-2">Информация для заказа</h4>
                  <p className="text-sm text-gray-600">
                    Для заказа свяжитесь с нами по телефону или заполните форму заявки. Мы подберем оптимальную комплектацию.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h4 className="mb-2">Условия оплаты</h4>
                  <p className="text-sm text-gray-600">
                    Наличный и безналичный расчет. Возможна рассрочка платежа. Принимаем оплату в BYN и EUR.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <h4 className="mb-2">Доставка</h4>
                  <p className="text-sm text-gray-600">
                    {product.deliveryTime}. Организуем доставку по всей Беларуси и СНГ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h4 className="mb-2">Гарантия</h4>
                  <p className="text-sm text-gray-600">
                    {product.warranty}. Полное сервисное обслуживание.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manufacturer & Contacts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl mb-6">Производитель</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Производитель</div>
                  <div className="text-lg">{product.manufacturer}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Категория</div>
                  <div className="text-lg capitalize">
                    {product.category === 'tractor' ? 'Трактор' : 'Комбайн'}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Состояние</div>
                  <div className="text-lg">{product.condition}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Гарантия</div>
                  <div className="text-lg">{product.warranty}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl mb-6">Контакты и график работы</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="mb-2">График работы</div>
                    <div className="text-sm text-gray-600">
                      Пн-Пт: 9:00 - 18:00<br />
                      Сб: 10:00 - 15:00<br />
                      Вс: Выходной
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="mb-2">Адрес</div>
                    <div className="text-sm text-gray-600">
                      Республика Беларусь,<br />
                      г. Минск, ул. Промышленная, 5
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="mb-2">Телефон</div>
                    <a href="tel:+375291234567" className="text-sm text-green-700 hover:underline">
                      +375 (29) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="mb-2">Email</div>
                    <a href="mailto:info@agraris.by" className="text-sm text-green-700 hover:underline">
                      info@agraris.by
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
