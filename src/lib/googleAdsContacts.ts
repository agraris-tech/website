import {
    sendGoogleAdsConversion,
} from './googleAds';

export type ContactChannel =
    | 'phone'
    | 'email'
    | 'telegram'
    | 'whatsapp';

const CONTACT_CONVERSIONS:
    Record<
        ContactChannel,
        string
    > = {
    phone:
        'AW-18176485543/nIe_CJGpxtMcEKfRnNtD',

    email:
        'AW-18176485543/nM0kCJSpxtMcEKfRnNtD',

    telegram:
        'AW-18176485543/xmMnCOO_ytMcEKfRnNtD',

    whatsapp:
        'AW-18176485543/CRUwCOa_ytMcEKfRnNtD',
};

function sendContactConversion(
    channel: ContactChannel,
    callback?: () => void,
): boolean {
    return sendGoogleAdsConversion(
        {
            send_to:
                CONTACT_CONVERSIONS[
                    channel
                    ],

            value:
                1.0,

            currency:
                'USD',
        },

        callback,
    );
}

/*
 * Telegram и WhatsApp обычно
 * открываются обычной ссылкой
 * или в новой вкладке.
 */
export function trackContactClick(
    channel:
        | 'telegram'
        | 'whatsapp',
): void {
    sendContactConversion(
        channel,
    );
}

/*
 * Для tel: и mailto:
 *
 * На agraristech.by сначала
 * отправляем Google Ads-конверсию,
 * затем открываем приложение.
 *
 * На agraris.ru и agraris.tech
 * Google Ads не запускается,
 * но переход выполняется сразу.
 */
export function trackContactAndNavigate(
    channel:
        | 'phone'
        | 'email',

    href: string,
): void {
    let navigationStarted =
        false;

    const navigate = () => {
        if (navigationStarted) {
            return;
        }

        navigationStarted =
            true;

        window.location.href =
            href;
    };

    const conversionSent =
        sendContactConversion(
            channel,
            navigate,
        );

    /*
     * На доменах без Google Ads
     * не ждём callback.
     */
    if (!conversionSent) {
        navigate();
        return;
    }

    /*
     * Резервный переход, если
     * Google заблокирован или
     * callback не выполнился.
     */
    window.setTimeout(
        navigate,
        900,
    );
}