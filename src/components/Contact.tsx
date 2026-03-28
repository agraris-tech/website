import { MapPin, Phone, Mail, Clock, MessageCircle, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Адрес',
      content: 'Брестский район, Чернинский с/с, 95, 1,2 км Юго-Западнее д.Харитоны, Брест, Беларусь'
    },
    {
      icon: Phone,
      title: 'Телефон',
      content: '+375 (29) 525-44-37',
      link: 'tel:+375295254437'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'agraristech2@gmail.com',
      link: 'mailto:agraristech2@gmail.com'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: '+375295254437',
      link: 'https://wa.me/375295254437'
    },
    {
      icon: Globe,
      title: 'Сайт',
      content: 'agraris.by',
      link: 'https://agraris.by'
    },
    {
      icon: Clock,
      title: 'Контактное лицо',
      content: 'Алексей'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
            Свяжитесь с нами
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ООО "Аграрис Текник" — мы всегда готовы ответить на ваши вопросы и обсудить сотрудничество
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl mb-6 text-gray-900">Контактная информация</h3>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">{info.title}</h4>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-gray-600 hover:text-green-700 transition-colors"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
              <h4 className="text-lg mb-3 text-gray-900">График работы офиса</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота</span>
                  <span>10:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Воскресенье</span>
                  <span>Выходной</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl mb-6 text-gray-900">Отправить сообщение</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">Ваше имя</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-gray-700">Телефон</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+375 (29) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-gray-700">Сообщение</label>
                <Textarea
                  id="message"
                  placeholder="Расскажите о вашем запросе..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                Отправить сообщение
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}