import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MobileCartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl mb-3 text-gray-900 text-center">Ваша корзина пуста</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
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
    <div className="py-6 bg-gray-50">
      <div className="px-4">
        <div className="mb-6">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            К каталогу
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-gray-900">Корзина</h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 text-sm"
              >
                Очистить
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-grow pr-2">
                        <h3 className="text-gray-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 p-1 flex-shrink-0"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span>{item.condition}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          aria-label="Уменьшить количество"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          aria-label="Увеличить количество"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-green-700">
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
        <Card className="sticky bottom-0 mb-6">
          <CardContent className="p-4">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Товаров:</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)} шт.</span>
              </div>
              
              {hasNumericPrices && totalPrice > 0 && (
                <div className="flex justify-between text-xl text-gray-900 pt-3 border-t">
                  <span>Итого:</span>
                  <span className="text-green-700">€{totalPrice.toLocaleString('ru-RU')}</span>
                </div>
              )}
              
              {!hasNumericPrices && (
                <div className="text-xs text-gray-600 pt-3 border-t">
                  <p>Цена по запросу. Наш менеджер свяжется с вами для уточнения стоимости.</p>
                </div>
              )}
            </div>

            <Button className="w-full bg-green-700 hover:bg-green-800 mb-2">
              Оформить заказ
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Наш менеджер свяжется с вами для подтверждения заказа
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
