import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
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
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

// Данные о технике (копия из ProductPage)
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
    description: 'Трактор John Deere 6155R представляет собой идеальное сочетание мощности, производительности и комфорта. Оснащенный современным двигателем мощностью 155 л.с., он идеально подходит для широкого спектра сельскохозяйственных работ.',
    specifications: {
      'Мощность двигателя': '155 л.с. / 114 кВт',
      'Объем двигателя': '4.5 л',
      'Количество цилиндров': '4',
      'Трансмиссия': 'AutoPowr CVT',
      'Максимальная скорость': '50 км/ч',
      'Вес': '6200 кг'
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
    description: 'Зерноуборочный комбайн Case IH Axial-Flow 7150 - это передовая техника для эффективной уборки зерновых культур. Мощный двигатель 360 л.с. и роторная система обмолота.',
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
    description: 'Мощный трактор New Holland T7.270 2020 года в отличном состоянии. Полностью обслужен и готов к работе.',
    specifications: {
      'Мощность двигателя': '270 л.с. / 199 кВт',
      'Год выпуска': '2020',
      'Моточасы': '1850',
      'Трансмиссия': 'Auto Command CVT',
      'Максимальная скорость': '50 км/ч',
      'Вес': '8500 кг'
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
    description: 'Премиальный комбайн Claas Lexion 760 2019 года. Отличное техническое состояние.',
    specifications: {
      'Мощность двигателя': '435 л.с. / 320 кВт',
      'Год выпуска': '2019',
      'Моточасы': '980',
      'Ширина жатки': '9.2 м',
      'Объем бункера': '12000 л',
      'Тип молотилки': 'Гибридная APS'
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
    description: 'Fendt 936 Vario - флагманская модель известного немецкого производителя. Легендарная трансмиссия Vario.',
    specifications: {
      'Мощность двигателя': '360 л.с. / 265 кВт',
      'Объем двигателя': '7.8 л',
      'Количество цилиндров': '6',
      'Трансмиссия': 'Vario CVT',
      'Максимальная скорость': '60 км/ч',
      'Вес': '10800 кг'
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
    description: 'Современный трактор серии 7S от Massey Ferguson сочетает в себе проверенную надежность и инновационные технологии.',
    specifications: {
      'Мощность двигателя': '180 л.с. / 132 кВт',
      'Объем двигателя': '6.6 л',
      'Количество цилиндров': '4',
      'Трансмиссия': 'Dyna-6',
      'Максимальная скорость': '40 км/ч',
      'Вес': '7200 кг'
    },
    warranty: '24 месяца или 2000 моточасов',
    deliveryTime: '2-4 недели с момента заказа'
  }
};

export function MobileProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = id ? equipmentData[id] : null;

  if (!product) {
    return (
      <div className="px-4 py-12 text-center">
        <h2 className="text-lg mb-4">Товар не найден</h2>
        <Button size="sm" onClick={() => navigate('/equipment')}>
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
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 py-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/equipment')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[280px] bg-gray-100">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {product.images.map((_: any, index: number) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-white w-5' 
                  : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4 bg-white">
        <div className="mb-2">
          <Badge className={product.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
            {product.condition}
          </Badge>
          <span className="ml-2 text-xs text-gray-500">{product.brand}</span>
        </div>

        <h1 className="text-2xl mb-2">{product.name}</h1>
        
        <div className="text-2xl text-green-700 mb-3">{product.price}</div>

        <p className="text-sm text-gray-600 mb-4">
          {product.description}
        </p>

        <div className="flex gap-2 mb-4">
          <Button 
            className="flex-1 bg-green-700 hover:bg-green-800"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            В корзину
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/contact')}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 py-2">
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="specs" className="bg-white rounded-lg border px-4">
            <AccordionTrigger className="text-sm">
              Характеристики
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-600">{key}:</span>
                    <span className="text-xs text-gray-900">{value as string}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="info" className="bg-white rounded-lg border px-4">
            <AccordionTrigger className="text-sm">
              Доставка и оплата
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-green-700 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">Информация для заказа</div>
                    <p className="text-xs text-gray-600">
                      Свяжитесь с нами для оформления заказа
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-blue-700 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">Условия оплаты</div>
                    <p className="text-xs text-gray-600">
                      Наличный и безналичный расчет
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-orange-700 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">Доставка</div>
                    <p className="text-xs text-gray-600">
                      {product.deliveryTime}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-700 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">Гарантия</div>
                    <p className="text-xs text-gray-600">
                      {product.warranty}
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="manufacturer" className="bg-white rounded-lg border px-4">
            <AccordionTrigger className="text-sm">
              Производитель
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-xs text-gray-600">Производитель:</span>
                  <span className="text-xs">{product.manufacturer}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-xs text-gray-600">Категория:</span>
                  <span className="text-xs capitalize">
                    {product.category === 'tractor' ? 'Трактор' : 'Комбайн'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-xs text-gray-600">Гарантия:</span>
                  <span className="text-xs">{product.warranty}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contacts" className="bg-white rounded-lg border px-4">
            <AccordionTrigger className="text-sm">
              Контакты и график работы
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">График работы</div>
                    <div className="text-xs text-gray-600">
                      Пн-Пт: 9:00 - 18:00<br />
                      Сб: 10:00 - 15:00<br />
                      Вс: Выходной
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs mb-1">Адрес</div>
                    <div className="text-xs text-gray-600">
                      г. Минск, ул. Промышленная, 5
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <a href="tel:+375291234567" className="text-xs text-green-700">
                    +375 (29) 123-45-67
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <a href="mailto:info@agraris.by" className="text-xs text-green-700">
                    info@agraris.by
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
