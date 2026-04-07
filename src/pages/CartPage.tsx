import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
        <ShoppingCart className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-3xl mb-4 text-gray-900">Ваша корзина пуста</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Добавьте технику в корзину, чтобы продолжить оформление заказа
        </p>
        <Link to="/catalog">
          <Button className="bg-green-700 hover:bg-green-800">
            Перейти к каталогу
          </Button>
        </Link>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const hasNumericPrices = items.some(item => item.price.match(/[\d,]+/));

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к каталогу
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-gray-900">Корзина</h1>
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Очистить корзину
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          aria-label="Удалить"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{item.condition}</span>
                        <span>•</span>
                        <span>{item.power}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-white rounded transition-colors"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-white rounded transition-colors"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-2xl text-green-700">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl mb-6 text-gray-900">Итого</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Товаров:</span>
                    <span>{items.reduce((total, item) => total + item.quantity, 0)} шт.</span>
                  </div>
                  
                  {hasNumericPrices && totalPrice > 0 && (
                    <div className="flex justify-between text-2xl text-gray-900 pt-4 border-t">
                      <span>Итого:</span>
                      <span className="text-green-700">€{totalPrice.toLocaleString('ru-RU')}</span>
                    </div>
                  )}
                  
                  {!hasNumericPrices && (
                    <div className="text-sm text-gray-600 pt-4 border-t">
                      <p>Цена по запросу. Наш менеджер свяжется с вами для уточнения стоимости.</p>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-green-700 hover:bg-green-800 mb-3">
                  Оформить заказ
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  Наш менеджер свяжется с вами для подтверждения заказа
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
