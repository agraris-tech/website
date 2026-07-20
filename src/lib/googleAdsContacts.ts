export type ContactChannel =
    | 'phone'
    | 'email'
    | 'telegram'
    | 'whatsapp';

type GtagFunction = (
    command: string,
    eventName: string,
    parameters?: Record<string, unknown>,
) => void;

type WindowWithGtag = Window & {
    gtag?: GtagFunction;
};

const CONTACT_CONVERSIONS: Record<ContactChannel, string> = {
    phone: 'AW-18176485543/nIe_CJGpxtMcEKfRnNtD',
    email: 'AW-18176485543/nM0kCJSpxtMcEKfRnNtD',
    telegram: 'AW-18176485543/xmMnCOO_ytMcEKfRnNtD',
    whatsapp: 'AW-18176485543/CRUwCOa_ytMcEKfRnNtD',
};

function getGtag(): GtagFunction | undefined {
    return (window as WindowWithGtag).gtag;
}

/**
 * Отправляет конверсию в Google Ads.
 *
 * value: 1 и currency: USD указаны в созданных Google тегах.
 * Это не означает списание 1 доллара за клик — это только
 * условная ценность конверсии внутри отчётов Google Ads.
 */
function sendContactConversion(
    channel: ContactChannel,
    callback?: () => void,
): void {
    const gtag = getGtag();

    if (typeof gtag !== 'function') {
        console.warn(
            `Google tag не загружен. Конверсия ${channel} не отправлена.`,
        );

        callback?.();
        return;
    }

    const parameters: Record<string, unknown> = {
        send_to: CONTACT_CONVERSIONS[channel],
        value: 1.0,
        currency: 'USD',
    };

    if (callback) {
        parameters.event_callback = callback;
        parameters.event_timeout = 800;
    }

    gtag('event', 'conversion', parameters);
}

/**
 * Для ссылок, которые открываются в новой вкладке:
 * Telegram и WhatsApp.
 */
export function trackContactClick(
    channel: 'telegram' | 'whatsapp',
): void {
    sendContactConversion(channel);
}

/**
 * Для ссылок tel: и mailto:.
 *
 * Сначала отправляется конверсия, затем открывается
 * приложение телефона или электронной почты.
 */
export function trackContactAndNavigate(
    channel: 'phone' | 'email',
    href: string,
): void {
    let navigationStarted = false;

    const navigate = () => {
        if (navigationStarted) {
            return;
        }

        navigationStarted = true;
        window.location.href = href;
    };

    sendContactConversion(channel, navigate);

    // Резервный переход, если Google заблокирован
    // или event_callback не был вызван.
    window.setTimeout(navigate, 900);
}