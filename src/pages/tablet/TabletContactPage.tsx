import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export function TabletContactPage() {
  return (
    <div className="bg-white">
      {/* Hero - Tablet */}
      <section className="relative overflow-hidden py-16 px-6 bg-gradient-to-br from-gray-50 via-green-50 to-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 border-4 border-green-700 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-green-700 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
              <Send className="w-4 h-4" />
              <span className="text-sm">Мы всегда на связи</span>
            </div>
            <h1 className="text-5xl mb-6 text-gray-900">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              ООО "Аграрис Текник" готово ответить на все ваши вопросы
            </p>
            
            {/* Quick Contact Options */}
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              <a href="tel:+375295254437" className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200">
                <Phone className="w-10 h-10 text-green-700 mx-auto mb-4" />
                <div className="text-sm text-gray-600 mb-2">Позвонить</div>
                <div className="text-gray-900">+375 (29) 525-44-37</div>
              </a>
              <a href="mailto:agraristech2@gmail.com" className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200">
                <Mail className="w-10 h-10 text-green-700 mx-auto mb-4" />
                <div className="text-sm text-gray-600 mb-2">Email</div>
                <div className="text-gray-900 text-sm">agraristech2@gmail.com</div>
              </a>
              <a href="https://wa.me/375295254437" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200">
                <MessageCircle className="w-10 h-10 text-green-700 mx-auto mb-4" />
                <div className="text-sm text-gray-600 mb-2">WhatsApp</div>
                <div className="text-gray-900">Написать</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Office & Form - Tablet */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Office Info */}
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Наш офис</h2>
              <Card className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <MapPin className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Адрес</p>
                        <p className="text-gray-900">
                          Брестский район, Чернинский с/с, 95, 1,2 км Юго-Западнее д.Харитоны
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Phone className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Телефон</p>
                        <a href="tel:+375295254437" className="text-gray-900 hover:text-green-700 transition-colors">
                          +375 (29) 525-44-37
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Mail className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Email</p>
                        <a href="mailto:agraristech2@gmail.com" className="text-gray-900 hover:text-green-700 transition-colors">
                          agraristech2@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Clock className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Режим работы</p>
                        <p className="text-gray-900">Пн-Пт: 9:00 - 18:00</p>
                        <p className="text-gray-900">Сб: 10:00 - 15:00</p>
                      </div>
                    </div>

                    <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-sm text-gray-600 mb-2">Контактное лицо</p>
                      <p className="text-xl text-gray-900">Алексей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Написать нам</h2>
              <Card className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <form className="space-y-6">
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
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
                        placeholder="Расскажите, что вас интересует..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-green-700 text-white py-4 px-6 rounded-lg hover:bg-green-800 transition-colors"
                    >
                      Отправить сообщение
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map - Tablet */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 text-gray-900">
              Как нас найти
            </h2>
            <p className="text-xl text-gray-600">
              Мы находимся в Брестском районе
            </p>
          </div>
          
          <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
            <div className="text-center text-gray-500 p-8">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl mb-2">Интерактивная карта</p>
              <p className="text-sm text-gray-600 mb-4">Брестский район, Чернинский с/с, 95</p>
              <p className="text-sm text-gray-500">1,2 км Юго-Западнее д.Харитоны, Брест, Беларусь</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
