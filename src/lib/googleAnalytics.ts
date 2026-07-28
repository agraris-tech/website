import {
    initGoogleTag,
} from './googleTag';

export const GOOGLE_ANALYTICS_ID =
    'G-GKBN9XLV29';

const GOOGLE_ANALYTICS_HOSTNAMES =
    new Set<string>([
        'agraristech.by',
        'agraris.ru',
        'agraris.tech',
    ]);

declare global {
    interface Window {
        __AGRARIS_GOOGLE_ANALYTICS_INITIALIZED__?:
            boolean;
    }
}

function normalizeHostname(
    hostname: string,
): string {
    return hostname
        .trim()
        .toLowerCase()
        .replace(
            /^https?:\/\//,
            '',
        )
        .replace(
            /^www\./,
            '',
        )
        .split('/')[0]
        .split(':')[0];
}

export function isGoogleAnalyticsEnabled(
    hostname?: string,
): boolean {
    if (
        typeof window ===
        'undefined' &&
        !hostname
    ) {
        return false;
    }

    const currentHostname =
        normalizeHostname(
            hostname ||
            window.location.hostname,
        );

    return (
        GOOGLE_ANALYTICS_HOSTNAMES
            .has(
                currentHostname,
            )
    );
}

export function initGoogleAnalytics():
    boolean {
    if (
        typeof window ===
        'undefined' ||
        typeof document ===
        'undefined'
    ) {
        return false;
    }

    /*
     * Не отправляем тестовые
     * данные с localhost и
     * Vercel Preview.
     */
    if (
        !isGoogleAnalyticsEnabled()
    ) {
        return false;
    }

    if (
        window
            .__AGRARIS_GOOGLE_ANALYTICS_INITIALIZED__
    ) {
        return true;
    }

    const gtag =
        initGoogleTag(
            GOOGLE_ANALYTICS_ID,
        );

    if (!gtag) {
        return false;
    }

    /*
     * send_page_view не отключаем.
     *
     * Первый просмотр отправит
     * команда config, а переходы
     * React Router будут фиксироваться
     * улучшенной статистикой GA4
     * через изменения History API.
     */
    gtag(
        'config',
        GOOGLE_ANALYTICS_ID,
        {
            cookie_domain:
                'auto',
        },
    );

    window
        .__AGRARIS_GOOGLE_ANALYTICS_INITIALIZED__ =
        true;

    return true;
}

export function sendGoogleAnalyticsEvent(
    eventName: string,
    parameters:
        Record<
            string,
            unknown
        > = {},
): boolean {
    const initialized =
        initGoogleAnalytics();

    if (
        !initialized ||
        typeof window.gtag !==
        'function'
    ) {
        return false;
    }

    /*
     * send_to гарантирует,
     * что событие предназначено
     * именно для GA4, а не для
     * Google Ads.
     */
    window.gtag(
        'event',
        eventName,
        {
            ...parameters,

            send_to:
            GOOGLE_ANALYTICS_ID,
        },
    );

    return true;
}

export function trackGoogleAnalyticsLead(
    parameters:
        Record<
            string,
            unknown
        > = {},
): boolean {
    return sendGoogleAnalyticsEvent(
        'generate_lead',
        parameters,
    );
}

export function trackGoogleAnalyticsContact(
    method:
        | 'phone'
        | 'email'
        | 'whatsapp'
        | 'telegram',
): boolean {
    return sendGoogleAnalyticsEvent(
        'contact',
        {
            method,
        },
    );
}