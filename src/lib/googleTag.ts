const GOOGLE_TAG_SCRIPT_ID =
    'agraris-google-tag';

const GOOGLE_TAG_SCRIPT_BASE_URL =
    'https://www.googletagmanager.com/gtag/js';

export type GoogleGtagFunction = (
    command: string,
    target: unknown,
    parameters?: Record<
        string,
        unknown
    >,
) => void;

declare global {
    interface Window {
        dataLayer?: unknown[];

        gtag?:
            GoogleGtagFunction;

        __AGRARIS_GOOGLE_TAG_INITIALIZED__?:
            boolean;
    }
}

function ensureDataLayer():
    unknown[] {
    window.dataLayer =
        window.dataLayer || [];

    return window.dataLayer;
}

export function ensureGtag():
    GoogleGtagFunction {
    if (
        typeof window.gtag ===
        'function'
    ) {
        return window.gtag;
    }

    const dataLayer =
        ensureDataLayer();

    const gtag = function (
        command: string,
        target: unknown,
        parameters?: Record<
            string,
            unknown
        >,
    ): void {
        /*
         * Google gtag.js ожидает
         * объект arguments,
         * как в официальном коде.
         */
        dataLayer.push(
            arguments,
        );
    } as GoogleGtagFunction;

    window.gtag =
        gtag;

    return gtag;
}

function findExistingGoogleTagScript():
    HTMLScriptElement | null {
    return document
        .querySelector<HTMLScriptElement>(
            'script[src*="googletagmanager.com/gtag/js"]',
        );
}

function loadGoogleTagScript(
    tagId: string,
): void {
    if (
        document.getElementById(
            GOOGLE_TAG_SCRIPT_ID,
        )
    ) {
        return;
    }

    /*
     * Не загружаем второй gtag.js,
     * если Google-тег уже добавлен
     * другим модулем.
     */
    if (
        findExistingGoogleTagScript()
    ) {
        return;
    }

    const script =
        document.createElement(
            'script',
        );

    script.id =
        GOOGLE_TAG_SCRIPT_ID;

    script.async =
        true;

    script.src =
        `${GOOGLE_TAG_SCRIPT_BASE_URL}` +
        `?id=${encodeURIComponent(
            tagId,
        )}`;

    document.head.appendChild(
        script,
    );
}

export function initGoogleTag(
    primaryTagId: string,
): GoogleGtagFunction | null {
    if (
        typeof window ===
        'undefined' ||
        typeof document ===
        'undefined'
    ) {
        return null;
    }

    const gtag =
        ensureGtag();

    loadGoogleTagScript(
        primaryTagId,
    );

    /*
     * Команда js должна быть
     * отправлена только один раз,
     * независимо от количества
     * подключённых сервисов Google.
     */
    if (
        !window
            .__AGRARIS_GOOGLE_TAG_INITIALIZED__
    ) {
        gtag(
            'js',
            new Date(),
        );

        window
            .__AGRARIS_GOOGLE_TAG_INITIALIZED__ =
            true;
    }

    return gtag;
}