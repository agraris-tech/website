const YANDEX_METRIKA_SCRIPT_ID =
    'agraris-yandex-metrika';

const YANDEX_METRIKA_SCRIPT_URL =
    'https://mc.yandex.ru/metrika/tag.js';

const COUNTER_BY_HOSTNAME: Record<
    string,
    number
> = {
    'agraristech.by':
        109855426,

    'agraris.ru':
        110733966,

    'agraris.tech':
        110734172,
};

export type YandexContactChannel =
    | 'phone'
    | 'email'
    | 'telegram'
    | 'whatsapp';

export type YandexLeadType =
    | 'lead'
    | 'product_offer'
    | 'callback'
    | 'contact_form';

export type YandexGoalId =
    | 'lead_success'
    | 'phone_click'
    | 'email_click'
    | 'whatsapp_click'
    | 'telegram_click';

type YandexMetrikaFunction = {
    (...args: unknown[]): void;

    a?: unknown[][];
    l?: number;
};

type YandexMetrikaHitOptions = {
    title?: string;
    referer?: string;
};

declare global {
    interface Window {
        ym?: YandexMetrikaFunction;

        __AGRARIS_YM_INITIALIZED__?: Record<
            string,
            boolean
        >;
    }
}

let lastTrackedUrl = '';

let previousTrackedUrl =
    typeof document !== 'undefined'
        ? document.referrer
        : '';

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

export function getYandexMetrikaCounterId(
    hostname?: string,
): number | null {
    if (
        typeof window ===
        'undefined' &&
        !hostname
    ) {
        return null;
    }

    const normalizedHostname =
        normalizeHostname(
            hostname ||
            window.location.hostname,
        );

    return (
        COUNTER_BY_HOSTNAME[
            normalizedHostname
            ] || null
    );
}

function ensureYmQueue():
    YandexMetrikaFunction {
    if (
        typeof window.ym ===
        'function'
    ) {
        return window.ym;
    }

    const ym = ((
        ...args: unknown[]
    ) => {
        ym.a =
            ym.a || [];

        ym.a.push(args);
    }) as YandexMetrikaFunction;

    ym.l =
        Date.now();

    window.ym =
        ym;

    return ym;
}

function loadYandexMetrikaScript():
    void {
    if (
        document.getElementById(
            YANDEX_METRIKA_SCRIPT_ID,
        )
    ) {
        return;
    }

    const script =
        document.createElement(
            'script',
        );

    script.id =
        YANDEX_METRIKA_SCRIPT_ID;

    script.async =
        true;

    script.src =
        YANDEX_METRIKA_SCRIPT_URL;

    document.head.appendChild(
        script,
    );
}

export function initYandexMetrika():
    number | null {
    if (
        typeof window ===
        'undefined' ||
        typeof document ===
        'undefined'
    ) {
        return null;
    }

    const counterId =
        getYandexMetrikaCounterId();

    /*
     * На localhost и неизвестных
     * доменах Метрику не запускаем.
     */
    if (!counterId) {
        return null;
    }

    const initializationKey =
        String(counterId);

    window
        .__AGRARIS_YM_INITIALIZED__ =
        window
            .__AGRARIS_YM_INITIALIZED__ ||
        {};

    if (
        window
            .__AGRARIS_YM_INITIALIZED__[
            initializationKey
            ]
    ) {
        return counterId;
    }

    const ym =
        ensureYmQueue();

    loadYandexMetrikaScript();

    /*
     * defer отключает автоматическую
     * отправку первого просмотра.
     *
     * Просмотры SPA отправляет
     * MetrikaRouteTracker.
     */
    ym(
        counterId,
        'init',
        {
            defer:
                true,

            webvisor:
                true,

            clickmap:
                true,

            trackLinks:
                true,

            accurateTrackBounce:
                true,

            ecommerce:
                'dataLayer',
        },
    );

    window
        .__AGRARIS_YM_INITIALIZED__[
        initializationKey
        ] = true;

    return counterId;
}

export function trackYandexPageView(
    url = window.location.href,
    title = document.title,
): boolean {
    const counterId =
        initYandexMetrika();

    if (
        !counterId ||
        typeof window.ym !==
        'function'
    ) {
        return false;
    }

    /*
     * Защита от двойного просмотра
     * одного URL, включая StrictMode.
     */
    if (
        lastTrackedUrl === url
    ) {
        return false;
    }

    const options:
        YandexMetrikaHitOptions = {
        title:
            title ||
            document.title,
    };

    if (previousTrackedUrl) {
        options.referer =
            previousTrackedUrl;
    }

    window.ym(
        counterId,
        'hit',
        url,
        options,
    );

    previousTrackedUrl =
        url;

    lastTrackedUrl =
        url;

    return true;
}

export function trackYandexGoal(
    goalId: YandexGoalId,
    parameters?: Record<
        string,
        unknown
    >,
): boolean {
    const counterId =
        initYandexMetrika();

    if (
        !counterId ||
        typeof window.ym !==
        'function'
    ) {
        return false;
    }

    window.ym(
        counterId,
        'reachGoal',
        goalId,
        parameters || {},
    );

    return true;
}

function getLeadStorageKey(
    counterId: number,
    leadId: string,
): string {
    return [
        'agraris',
        'ym',
        counterId,
        'lead_success',
        leadId,
    ].join(':');
}

/*
 * Вызывается только после
 * успешной отправки заявки
 * и получения leadId от сервера.
 */
export function trackYandexLeadSuccess(
    leadId: string,
    leadType:
        YandexLeadType = 'lead',
): boolean {
    if (
        typeof window ===
        'undefined'
    ) {
        return false;
    }

    const cleanLeadId =
        leadId.trim();

    if (!cleanLeadId) {
        return false;
    }

    const counterId =
        getYandexMetrikaCounterId();

    if (!counterId) {
        return false;
    }

    const storageKey =
        getLeadStorageKey(
            counterId,
            cleanLeadId,
        );

    /*
     * Не отправляем одну заявку
     * повторно в пределах вкладки.
     */
    try {
        if (
            window.sessionStorage
                .getItem(storageKey) ===
            '1'
        ) {
            return false;
        }
    } catch {
        /*
         * sessionStorage может быть
         * недоступен в браузере.
         */
    }

    const sent =
        trackYandexGoal(
            'lead_success',
            {
                lead_id:
                cleanLeadId,

                lead_type:
                leadType,

                page_url:
                window.location.href,
            },
        );

    if (sent) {
        try {
            window.sessionStorage
                .setItem(
                    storageKey,
                    '1',
                );
        } catch {
            /*
             * На достижение цели
             * это не влияет.
             */
        }
    }

    return sent;
}

const CONTACT_GOAL_BY_CHANNEL:
    Record<
        YandexContactChannel,
        YandexGoalId
    > = {
    phone:
        'phone_click',

    email:
        'email_click',

    whatsapp:
        'whatsapp_click',

    telegram:
        'telegram_click',
};

export function trackYandexContactGoal(
    channel:
        YandexContactChannel,
): boolean {
    return trackYandexGoal(
        CONTACT_GOAL_BY_CHANNEL[
            channel
            ],
        {
            contact_channel:
            channel,

            page_url:
                typeof window !==
                'undefined'
                    ? window
                        .location
                        .href
                    : '',
        },
    );
}