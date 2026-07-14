export type SiteRegionCode = 'by' | 'ru' | 'kz';

export type SiteRegionConfig = {
    code: SiteRegionCode;
    hostname: string;
    baseUrl: string;

    htmlLang: string;
    ogLocale: string;

    countryName: string;
    countryLocative: string;

    siteName: string;
    logoUrl: string;
};

export const SITE_REGIONS: Record<
    SiteRegionCode,
    SiteRegionConfig
> = {
    by: {
        code: 'by',
        hostname: 'agraristech.by',
        baseUrl: 'https://agraristech.by',

        htmlLang: 'ru-BY',
        ogLocale: 'ru_BY',

        countryName: 'Беларусь',
        countryLocative: 'Беларуси',

        siteName: 'AGRARIS TECH',
        logoUrl: 'https://agraristech.by/logo.png',
    },

    ru: {
        code: 'ru',
        hostname: 'agraris.ru',
        baseUrl: 'https://agraris.ru',

        htmlLang: 'ru-RU',
        ogLocale: 'ru_RU',

        countryName: 'Россия',
        countryLocative: 'России',

        siteName: 'AGRARIS TECH',
        logoUrl: 'https://agraris.ru/logo.png',
    },

    kz: {
        code: 'kz',
        hostname: 'agraris.tech',
        baseUrl: 'https://agraris.tech',

        htmlLang: 'ru-KZ',
        ogLocale: 'ru_KZ',

        countryName: 'Казахстан',
        countryLocative: 'Казахстане',

        siteName: 'AGRARIS TECH',
        logoUrl: 'https://agraris.tech/logo.png',
    },
};

function normalizeHostname(hostname: string): string {
    return hostname
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split(':')[0];
}

function isLocalHostname(hostname: string): boolean {
    return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0'
    );
}

function isRegionCode(
    value: string | undefined,
): value is SiteRegionCode {
    return (
        value === 'by' ||
        value === 'ru' ||
        value === 'kz'
    );
}

export function getCurrentRegion(
    hostname?: string,
): SiteRegionConfig {
    const currentHostname = normalizeHostname(
        hostname ||
        (
            typeof window !== 'undefined'
                ? window.location.hostname
                : ''
        ),
    );

    /*
     * Используется только для локальной проверки:
     *
     * VITE_SITE_REGION=by
     * VITE_SITE_REGION=ru
     * VITE_SITE_REGION=kz
     */
    const forcedRegion = (
        import.meta.env.VITE_SITE_REGION as
            | string
            | undefined
    )
        ?.trim()
        .toLowerCase();

    if (
        isLocalHostname(currentHostname) &&
        isRegionCode(forcedRegion)
    ) {
        return SITE_REGIONS[forcedRegion];
    }

    const matchedRegion = Object.values(
        SITE_REGIONS,
    ).find(
        (region) =>
            normalizeHostname(region.hostname) ===
            currentHostname,
    );

    return matchedRegion || SITE_REGIONS.by;
}

export function normalizePath(
    pathname: string,
): string {
    if (!pathname || pathname === '/') {
        return '/';
    }

    return `/${pathname
        .replace(/^\/+/, '')
        .replace(/\/+$/, '')}`;
}

export function buildRegionalUrl(
    region: SiteRegionConfig,
    pathname: string,
): string {
    const normalizedPath =
        normalizePath(pathname);

    if (normalizedPath === '/') {
        return `${region.baseUrl}/`;
    }

    return `${region.baseUrl}${normalizedPath}`;
}

export function getAlternateUrls(
    pathname: string,
): Array<{
    hrefLang: string;
    href: string;
}> {
    return Object.values(SITE_REGIONS).map(
        (region) => ({
            hrefLang: region.htmlLang,
            href: buildRegionalUrl(
                region,
                pathname,
            ),
        }),
    );
}

export function makeAbsoluteUrl(
    url: string,
    baseUrl: string,
): string {
    try {
        return new URL(url, baseUrl).toString();
    } catch {
        return url;
    }
}

export function stripHtml(
    value: string,
): string {
    return value
        .replace(
            /<script[\s\S]*?<\/script>/gi,
            ' ',
        )
        .replace(
            /<style[\s\S]*?<\/style>/gi,
            ' ',
        )
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&laquo;/gi, '«')
        .replace(/&raquo;/gi, '»')
        .replace(/\s+/g, ' ')
        .trim();
}

export function truncateText(
    value: string,
    maxLength = 160,
): string {
    const cleanValue = value
        .replace(/\s+/g, ' ')
        .trim();

    if (cleanValue.length <= maxLength) {
        return cleanValue;
    }

    const shortened = cleanValue.slice(
        0,
        maxLength - 1,
    );

    const lastSpaceIndex =
        shortened.lastIndexOf(' ');

    const endIndex =
        lastSpaceIndex > 100
            ? lastSpaceIndex
            : maxLength - 1;

    return `${shortened.slice(0, endIndex)}…`;
}

export function serializeJsonLd(
    value: unknown,
): string {
    return JSON.stringify(value).replace(
        /</g,
        '\\u003c',
    );
}