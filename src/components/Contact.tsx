import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Globe,
  Send,
  type LucideIcon,
} from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

import { getSiteSettings } from '../services/strapi';

import {
  getRegionalContact,
  type SiteSettings,
} from '../lib/getRegionalContact';

import { getHostname } from '../lib/getHostname';

import {
  trackContactAndNavigate,
  trackContactClick,
  type ContactChannel,
} from '../lib/googleAdsContacts';

import { trackGoogleAdsLead } from '../lib/googleAdsLead';

type LeadApiResponse = {
  success: boolean;
  leadId?: string;
  message?: string;
};

type ContactInfoItem = {
  icon: LucideIcon;
  title: string;
  content: string;
  link?: string;
  channel?: ContactChannel;
  external?: boolean;
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Скрытое антиспам-поле
  const [website, setWebsite] = useState('');

  const [settings, setSettings] =
      useState<SiteSettings | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const contact = getRegionalContact(
      settings,
      getHostname(),
  );

  useEffect(() => {
    async function loadSettings(): Promise<void> {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error(
            'Failed to load contact settings:',
            error,
        );
      }
    }

    loadSettings().catch(console.error);
  }, []);

  const phoneHref = contact?.phone
      ? `tel:${contact.phone.replace(/[^\d+]/g, '')}`
      : '';

  const emailHref = contact?.email
      ? `mailto:${contact.email}`
      : '';

  const contactInfo: ContactInfoItem[] = [
    {
      icon: MapPin,
      title: 'Адрес',
      content: contact?.fullAddress || '',
    },
    {
      icon: Phone,
      title: 'Телефон',
      content: contact?.phone || '',
      link: phoneHref || undefined,
      channel: 'phone',
    },
    {
      icon: Mail,
      title: 'Email',
      content: contact?.email || '',
      link: emailHref || undefined,
      channel: 'email',
    },
    {
      icon: Send,
      title: 'Telegram',
      content: contact?.telegramUrl
          ? 'Написать в Telegram'
          : '',
      link: contact?.telegramUrl || undefined,
      channel: 'telegram',
      external: true,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: contact?.whatsappUrl
          ? contact.whatsappUrl.replace(
              'https://wa.me/',
              '+',
          )
          : '',
      link: contact?.whatsappUrl || undefined,
      channel: 'whatsapp',
      external: true,
    },
    {
      icon: Globe,
      title: 'Сайт',
      content: settings?.websiteUrl || '',
      link: settings?.websiteUrl || undefined,
      external: true,
    },
    {
      icon: Clock,
      title: 'Контактное лицо',
      content: settings?.contactPerson || '',
    },
  ].filter((item) => Boolean(item.content));

  const handleContactClick = (
      event: React.MouseEvent<HTMLAnchorElement>,
      item: ContactInfoItem,
  ): void => {
    if (!item.link || !item.channel) {
      return;
    }

    if (
        item.channel === 'phone' ||
        item.channel === 'email'
    ) {
      event.preventDefault();

      trackContactAndNavigate(
          item.channel,
          item.link,
      );

      return;
    }

    trackContactClick(item.channel);
  };

  const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();
    const cleanMessage = formData.message.trim();

    if (cleanName.length < 2) {
      setSubmitError('Укажите ваше имя.');
      return;
    }

    if (!cleanEmail && !cleanPhone) {
      setSubmitError('Укажите email или телефон.');
      return;
    }

    if (
        cleanEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            cleanEmail,
        )
    ) {
      setSubmitError('Проверьте правильность email.');
      return;
    }

    if (cleanMessage.length < 3) {
      setSubmitError('Введите сообщение.');
      return;
    }

    const payload = {
      requestType: 'contact_form',
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      comment: cleanMessage,
      productTitle: '',
      pageUrl: window.location.href,
      website,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let result: LeadApiResponse;

      try {
        result = JSON.parse(
            responseText,
        ) as LeadApiResponse;
      } catch {
        throw new Error(
            'Сервер вернул некорректный ответ.',
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
            result.message ||
            'Не удалось отправить сообщение.',
        );
      }

      /*
       * Главная Google Ads-конверсия формы.
       * Срабатывает только после успешной отправки
       * письма через Vercel и Resend.
       */
      if (result.leadId) {
        trackGoogleAdsLead(result.leadId);
      }

      setSubmitSuccess(
          'Спасибо! Сообщение успешно отправлено. Мы свяжемся с вами в ближайшее рабочее время.',
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });

      setWebsite('');
    } catch (error) {
      console.error(
          'Contact form sending error:',
          error,
      );

      setSubmitError(
          error instanceof Error
              ? error.message
              : 'Не удалось отправить сообщение.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <section
          id="contact"
          className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Свяжитесь с нами
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {settings?.legalName ||
                  'ООО "Аграрис Текник"'}{' '}
              — мы всегда готовы ответить на ваши
              вопросы и обсудить сотрудничество
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl mb-6 text-gray-900">
                Контактная информация
              </h3>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info) => {
                  const Icon = info.icon;

                  return (
                      <div
                          key={info.title}
                          className="flex gap-4"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-green-700" />
                        </div>

                        <div>
                          <h4 className="text-gray-900 mb-1">
                            {info.title}
                          </h4>

                          {info.link ? (
                              <a
                                  href={info.link}
                                  onClick={(event) =>
                                      handleContactClick(
                                          event,
                                          info,
                                      )
                                  }
                                  className="text-gray-600 hover:text-green-700 transition-colors"
                                  target={
                                    info.external
                                        ? '_blank'
                                        : undefined
                                  }
                                  rel={
                                    info.external
                                        ? 'noopener noreferrer'
                                        : undefined
                                  }
                              >
                                {info.content}
                              </a>
                          ) : (
                              <p className="text-gray-600">
                                {info.content}
                              </p>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                <h4 className="text-lg mb-3 text-gray-900">
                  График работы офиса
                </h4>

                <div className="space-y-2 text-gray-700">
                  <p>
                    {contact?.workingHours ||
                        'График работы будет добавлен позже'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl mb-6 text-gray-900">
                Отправить сообщение
              </h3>

              <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
              >
                <div>
                  <label
                      htmlFor="name"
                      className="block mb-2 text-gray-700"
                  >
                    Ваше имя
                  </label>

                  <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Введите ваше имя"
                      value={formData.name}
                      disabled={isSubmitting}
                      onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                      }
                      required
                  />
                </div>

                <div>
                  <label
                      htmlFor="email"
                      className="block mb-2 text-gray-700"
                  >
                    Email
                  </label>

                  <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      disabled={isSubmitting}
                      onChange={(event) =>
                          setFormData({
                            ...formData,
                            email: event.target.value,
                          })
                      }
                  />
                </div>

                <div>
                  <label
                      htmlFor="phone"
                      className="block mb-2 text-gray-700"
                  >
                    Телефон
                  </label>

                  <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+375 (29) 123-45-67"
                      value={formData.phone}
                      disabled={isSubmitting}
                      onChange={(event) =>
                          setFormData({
                            ...formData,
                            phone: event.target.value,
                          })
                      }
                  />
                </div>

                <div>
                  <label
                      htmlFor="message"
                      className="block mb-2 text-gray-700"
                  >
                    Сообщение
                  </label>

                  <Textarea
                      id="message"
                      name="message"
                      placeholder="Расскажите о вашем запросе..."
                      rows={5}
                      value={formData.message}
                      disabled={isSubmitting}
                      onChange={(event) =>
                          setFormData({
                            ...formData,
                            message: event.target.value,
                          })
                      }
                      required
                  />
                </div>

                {/* Скрытое антиспам-поле */}
                <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(event) =>
                        setWebsite(event.target.value)
                    }
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-10000px',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                />

                {submitError && (
                    <div
                        role="alert"
                        className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                    >
                      {submitError}
                    </div>
                )}

                {submitSuccess && (
                    <div
                        role="status"
                        className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
                    >
                      {submitSuccess}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        Boolean(submitSuccess)
                    }
                    className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                      ? 'Отправляем…'
                      : submitSuccess
                          ? 'Сообщение отправлено'
                          : 'Отправить сообщение'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}