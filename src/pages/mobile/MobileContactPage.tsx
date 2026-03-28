import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export function MobileContactPage() {
  return (
    <div className="bg-white">
      {/* Hero - Mobile */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-green-700 to-green-600 text-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Send className="w-4 h-4" />
            <span className="text-sm">Связь</span>
          </div>
          <h1 className="text-3xl mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-green-100">
            Мы всегда готовы помочь
          </p>
        </div>
      </section>

      {/* Quick Contact - Mobile */}
      <section className="py-6 px-4 -mt-8 relative z-10">
        <div className="space-y-3">
          <a 
            href="tel:+375295254437" 
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Позвонить</div>
              <div className="text-gray-900">+375 (29) 525-44-37</div>
            </div>
          </a>

          <a 
            href="mailto:agraristech2@gmail.com" 
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="text-gray-900 text-sm">agraristech2@gmail.com</div>
            </div>
          </a>

          <a 
            href="https://wa.me/375295254437" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">WhatsApp</div>
              <div className="text-gray-900">Написать сообщение</div>
            </div>
          </a>
        </div>
      </section>

      {/* Office Info - Mobile */}
      <section className="py-10 px-4 bg-gray-50">
        <h2 className="text-2xl mb-6 text-gray-900">Наш офис</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Адрес</p>
                  <p className="text-gray-900 text-sm">
                    Брестский район, Чернинский с/с, 95, 1,2 км Юго-Западнее д.Харитоны
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Режим работы</p>
                  <p className="text-gray-900">Пн-Пт: 9:00 - 18:00</p>
                  <p className="text-gray-900">Сб: 10:00 - 15:00</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Контактное лицо</p>
                <p className="text-gray-900">Алексей</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact Form - Mobile */}
      <section className="py-10 px-4 bg-white">
        <h2 className="text-2xl mb-6 text-gray-900">Написать нам</h2>
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ваше имя</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Телефон</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="+375 (29) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Сообщение</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
                  placeholder="Расскажите, что вас интересует..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 transition-colors"
              >
                Отправить сообщение
              </button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Map - Mobile */}
      <section className="py-10 px-4 bg-gray-50">
        <h2 className="text-2xl mb-6 text-gray-900">Как нас найти</h2>
        <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500 p-4">
            <MapPin className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">Интерактивная карта</p>
            <p className="text-xs text-gray-400 mt-2">Брестский район</p>
          </div>
        </div>
      </section>
    </div>
  );
}
