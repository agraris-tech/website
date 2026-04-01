import { Contact } from '../components/Contact';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import {getAllActiveProducts, getAllCategories, getRootCategories, getSiteSettings} from '../services/strapi';
import {AppPageLoader} from "../components/AppPageLoader";

type SiteSettings = {
  companyName?: string;
  legalName?: string;
  phone?: string;
  email?: string;
  whatsappUrl?: string;
  workHours?: string;
  addressShort?: string;
  fullAddress?: string;
  websiteUrl?: string;
  contactPerson?: string;
  callbackButtonText?: string;

  contactPageTitle?: string;
  contactPageSubtitle?: string;
  contactBadgeText?: string;

  officeCity?: string;
  officeRegionLabel?: string;

  mapTitle?: string;
  mapSubtitle?: string;
  mapEmbedUrl?: string;
  mapAddressLabel?: string;
};

export function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 200));
        const data = await getSiteSettings();
        setSettings(data);

      } catch (error) {
        console.error('Failed to load catalog data:', error);
      }finally {
        setLoading(false);
      }
    }

    loadSettings().then();
  }, []);

  if (loading) {
    return <AppPageLoader />;
  }

  return (
      <div>
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50 to-white"></div>

          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-72 h-72 border-4 border-green-700 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-green-700 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                <Send className="w-4 h-4" />
                <span className="text-sm">
                {settings?.contactBadgeText || 'Мы всегда на связи'}
              </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
                {settings?.contactPageTitle || 'Свяжитесь с нами'}
              </h1>

              <p className="text-xl text-gray-600 mb-10">
                {settings?.contactPageSubtitle ||
                    `${settings?.legalName || 'ООО "Аграрис Текник"'} готово ответить на все ваши вопросы и подобрать оптимальное решение`}
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {settings?.phone && (
                    <a
                        href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Phone className="w-8 h-8 text-green-700 mx-auto mb-3" />
                      <div className="text-sm text-gray-600 mb-1">Позвонить</div>
                      <div className="text-gray-900">{settings.phone}</div>
                    </a>
                )}

                {settings?.email && (
                    <a
                        href={`mailto:${settings.email}`}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Mail className="w-8 h-8 text-green-700 mx-auto mb-3" />
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <div className="text-gray-900">{settings.email}</div>
                    </a>
                )}

                {settings?.whatsappUrl && (
                    <a
                        href={settings.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <MessageCircle className="w-8 h-8 text-green-700 mx-auto mb-3" />
                      <div className="text-sm text-gray-600 mb-1">WhatsApp</div>
                      <div className="text-gray-900">Написать</div>
                    </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <Contact />

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
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-2">
                      {settings?.officeCity || 'Брест'}
                    </h3>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {settings?.officeRegionLabel || 'Главный офис'}
                  </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {settings?.fullAddress && (
                        <div className="flex gap-4">
                          <MapPin className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Адрес</p>
                            <p className="text-gray-700">{settings.fullAddress}</p>
                          </div>
                        </div>
                    )}

                    {settings?.phone && (
                        <div className="flex gap-4">
                          <Phone className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Телефон</p>
                            <a
                                href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                                className="text-gray-700 hover:text-green-700 transition-colors"
                            >
                              {settings.phone}
                            </a>
                          </div>
                        </div>
                    )}

                    {settings?.email && (
                        <div className="flex gap-4">
                          <Mail className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <a
                                href={`mailto:${settings.email}`}
                                className="text-gray-700 hover:text-green-700 transition-colors"
                            >
                              {settings.email}
                            </a>
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {settings?.whatsappUrl && (
                        <div className="flex gap-4">
                          <MessageCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
                            <a
                                href={settings.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-700 transition-colors"
                            >
                              {settings.whatsappUrl.replace('https://wa.me/', '+')}
                            </a>
                          </div>
                        </div>
                    )}

                    {settings?.workHours && (
                        <div className="flex gap-4">
                          <Clock className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Режим работы</p>
                            <p className="text-gray-700">{settings.workHours}</p>
                          </div>
                        </div>
                    )}

                    {settings?.contactPerson && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600 mb-1">Контактное лицо</p>
                          <p className="text-gray-900">{settings.contactPerson}</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
                {settings?.mapTitle || 'Как нас найти'}
              </h2>
              <p className="text-xl text-gray-600">
                {settings?.mapSubtitle || 'Мы находимся в Брестском районе'}
              </p>
            </div>

            {settings?.mapEmbedUrl ? (
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  <iframe
                      src={settings.mapEmbedUrl}
                      width="100%"
                      height="450"
                      loading="lazy"
                      style={{ border: 0 }}
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Карта офиса"
                  />
                </div>
            ) : (
                <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-gray-500 p-8">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg mb-2">Интерактивная карта</p>
                    <p className="text-sm text-gray-600 mb-4">
                      {settings?.mapAddressLabel || settings?.addressShort || 'Адрес офиса'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {settings?.fullAddress || 'Адрес будет добавлен позже'}
                    </p>
                  </div>
                </div>
            )}
          </div>
        </section>
      </div>
  );
}