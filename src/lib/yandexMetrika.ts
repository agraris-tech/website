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
        ym?:
            YandexMetrikaFunction;

        dataLayer?:
            unknown[];

        __AGRARIS_YM_INITIALIZED__?:
            Record<
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

    ym.l = Date.now();

    window.ym = ym;

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

    script.async = true;

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
     * На localhost Метрику
     * не запускаем, чтобы тесты
     * не попадали в статистику.
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
     * defer: true отключает
     * автоматическую отправку
     * первого просмотра.
     *
     * Все просмотры отправляет
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
     * Защита от двойного вызова
     * одного маршрута, в том числе
     * в React StrictMode.
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