const GOOGLE_ADS_ID =
    'AW-18176485543';

const GOOGLE_ADS_HOSTNAME =
    'agraristech.by';

const GOOGLE_ADS_SCRIPT_ID =
    'agraris-google-ads-tag';

const GOOGLE_ADS_SCRIPT_URL =
    `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;

export type GoogleAdsGtagFunction = (
    command: string,
    target: unknown,
    parameters?: Record<
        string,
        unknown
    >,
) => void;

type GoogleAdsConversionParameters =
    Record<string, unknown>;

declare global {
    interface Window {
        dataLayer?: unknown[];

        gtag?:
            GoogleAdsGtagFunction;

        __AGRARIS_GOOGLE_ADS_INITIALIZED__?:
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

export function isGoogleAdsEnabled(
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
        currentHostname ===
        GOOGLE_ADS_HOSTNAME
    );
}

function ensureDataLayer():
    unknown[] {
    window.dataLayer =
        window.dataLayer || [];

    return window.dataLayer;
}

function ensureGtag():
    GoogleAdsGtagFunction {
    if (
        typeof window.gtag ===
        'function'
    ) {
        return window.gtag;
    }

    const dataLayer =
        ensureDataLayer();

    const gtag:
        GoogleAdsGtagFunction = (
        command,
        target,
        parameters,
    ) => {
        dataLayer.push([
            command,
            target,
            parameters,
        ]);
    };

    window.gtag =
        gtag;

    return gtag;
}

function loadGoogleAdsScript():
    void {
    if (
        document.getElementById(
            GOOGLE_ADS_SCRIPT_ID,
        )
    ) {
        return;
    }

    const script =
        document.createElement(
            'script',
        );

    script.id =
        GOOGLE_ADS_SCRIPT_ID;

    script.async =
        true;

    script.src =
        GOOGLE_ADS_SCRIPT_URL;

    document.head.appendChild(
        script,
    );
}

export function initGoogleAds():
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
     * Google Ads работает только
     * на белорусском домене.
     */
    if (!isGoogleAdsEnabled()) {
        return false;
    }

    if (
        window
            .__AGRARIS_GOOGLE_ADS_INITIALIZED__
    ) {
        return true;
    }

    const gtag =
        ensureGtag();

    loadGoogleAdsScript();

    gtag(
        'js',
        new Date(),
    );

    gtag(
        'config',
        GOOGLE_ADS_ID,
    );

    window
        .__AGRARIS_GOOGLE_ADS_INITIALIZED__ =
        true;

    return true;
}

export function sendGoogleAdsConversion(
    parameters:
        GoogleAdsConversionParameters,

    callback?: () => void,
): boolean {
    const initialized =
        initGoogleAds();

    if (
        !initialized ||
        typeof window.gtag !==
        'function'
    ) {
        return false;
    }

    const conversionParameters:
        Record<string, unknown> = {
        ...parameters,
    };

    if (callback) {
        conversionParameters
            .event_callback =
            callback;

        conversionParameters
            .event_timeout =
            800;
    }

    window.gtag(
        'event',
        'conversion',
        conversionParameters,
    );

    return true;
}