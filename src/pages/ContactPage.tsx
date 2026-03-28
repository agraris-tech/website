import { Contact } from '../components/Contact';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';

export function ContactPage() {
  const offices = [
    {
      city: 'Брест',
      region: 'Главный офис',
      address: 'Брестский район, Чернинский с/с, 95, 1,2 км Юго-Западнее д.Харитоны',
      phone: '+375 (29) 525-44-37',
      email: 'agraristech2@gmail.com',
      whatsapp: '+375295254437',
      contact: 'Алексей',
      hours: 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00'
    }
  ];

  return (
    <div>
      {/* Page Header - New Design */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50 to-white"></div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 border-4 border-green-700 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-green-700 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
              <Send className="w-4 h-4" />
              <span className="text-sm">Мы всегда на связи</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              ООО "Аграрис Текник" готово ответить на все ваши вопросы и подобрать оптимальное решение
            </p>
            
            {/* Quick Contact Options */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <a href="tel:+375295254437" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <Phone className="w-8 h-8 text-green-700 mx-auto mb-3" />
                <div className="text-sm text-gray-600 mb-1">Позвонить</div>
                <div className="text-gray-900">+375 (29) 525-44-37</div>
              </a>
              <a href="mailto:agraristech2@gmail.com" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <Mail className="w-8 h-8 text-green-700 mx-auto mb-3" />
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <div className="text-gray-900">agraristech2@gmail.com</div>
              </a>
              <a href="https://wa.me/375295254437" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <MessageCircle className="w-8 h-8 text-green-700 mx-auto mb-3" />
                <div className="text-sm text-gray-600 mb-1">WhatsApp</div>
                <div className="text-gray-900">Написать</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Contact />

      {/* Offices Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Наш офис
            </h2>
            <p className="text-xl text-gray-600">
              Расположение и контактная информация
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {offices.map((office, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-2">{office.city}</h3>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {office.region}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Адрес</p>
                        <p className="text-gray-700">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Phone className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Телефон</p>
                        <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-gray-700 hover:text-green-700 transition-colors">
                          {office.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Mail className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <a href={`mailto:${office.email}`} className="text-gray-700 hover:text-green-700 transition-colors">
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <MessageCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${office.whatsapp}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-green-700 transition-colors"
                        >
                          {office.whatsapp}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Режим работы</p>
                        <p className="text-gray-700">{office.hours}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Контактное лицо</p>
                      <p className="text-gray-900">{office.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Как нас найти
            </h2>
            <p className="text-xl text-gray-600">
              Мы находимся в Брестском районе
            </p>
          </div>
          
          <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="text-center text-gray-500 p-8">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg mb-2">Интерактивная карта</p>
              <p className="text-sm text-gray-600 mb-4">Брестский район, Чернинский с/с, 95</p>
              <p className="text-sm text-gray-500">1,2 км Юго-Западнее д.Харитоны, Брест, Беларусь</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}