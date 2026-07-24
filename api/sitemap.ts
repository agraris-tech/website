const ALLOWED_HOSTS = new Set([
    'agraristech.by',
    'agraris.ru',
    'agraris.tech',
]);

const DEFAULT_STRAPI_API_URL =
    'https://cozy-action-02025ea19f.strapiapp.com/api';

const PAGE_SIZE = 100;
const MAX_PAGES = 1000;

type SitemapEntry = {
    url: string;
    lastModified?: string;
};

type StrapiRecord = {
    slug?: unknown;
    updatedAt?: unknown;

    /*
     * Совместимость со Strapi 4.
     * В Strapi 5 поля обычно находятся
     * непосредственно в объекте.
     */
    attributes?: {
        slug?: unknown;
        updatedAt?: unknown;
    };
};

type StrapiPagination = {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
};

type StrapiCollectionResponse = {
    data?: StrapiRecord[];

    meta?: {
        pagination?: StrapiPagination;
    };
};

type CollectionSitemapOptions = {
    strapiBaseUrl: string;
    baseUrl: string;
    endpoint: string;
    pathPrefix: string;
};

function getCurrentHost(
    req: any,
): string {
    const forwardedHost =
        req.headers['x-forwarded-host'];

    const rawHost =
        (
            Array.isArray(
                forwardedHost,
            )
                ? forwardedHost[0]
                : forwardedHost
        ) ||
        req.headers.host ||
        'agraristech.by';

    const cleanHost =
        String(rawHost)
            .split(',')[0]
            .trim()
            .toLowerCase()
            .replace(/^www\./, '')
            .split(':')[0];

    return ALLOWED_HOSTS.has(
        cleanHost,
    )
        ? cleanHost
        : 'agraristech.by';
}

function getStrapiBaseUrl(): string {
    const configuredUrl =
        process.env.STRAPI_URL ||
        process.env.STRAPI_API_URL ||
        process.env.VITE_STRAPI_URL ||
        DEFAULT_STRAPI_API_URL;

    const cleanUrl =
        configuredUrl
            .trim()
            .replace(/\/+$/, '');

    if (!cleanUrl) {
        return DEFAULT_STRAPI_API_URL;
    }

    return cleanUrl.endsWith('/api')
        ? cleanUrl
        : `${cleanUrl}/api`;
}

function getRequestHeaders(): Record<
    string,
    string
> {
    const headers: Record<
        string,
        string
    > = {
        Accept: 'application/json',
    };

    /*
     * Токен необязателен, если Public Role
     * имеет разрешение find для products
     * и news-articles.
     */
    if (
        process.env.STRAPI_API_TOKEN
    ) {
        headers.Authorization =
            `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    return headers;
}

function escapeXml(
    value: string,
): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getString(
    value: unknown,
): string {
    return typeof value === 'string'
        ? value.trim()
        : '';
}

function normalizeDate(
    value: unknown,
): string | undefined {
    if (
        typeof value !== 'string' ||
        !value.trim()
    ) {
        return undefined;
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return undefined;
    }

    return date.toISOString();
}

function unwrapStrapiRecord(
    record: StrapiRecord,
): {
    slug: string;
    updatedAt?: string;
} {
    const source =
        record.attributes ||
        record;

    return {
        slug:
            getString(
                source.slug,
            ),

        updatedAt:
            normalizeDate(
                source.updatedAt,
            ),
    };
}

async function fetchStrapiJson(
    requestUrl: string,
): Promise<StrapiCollectionResponse> {
    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => {
                controller.abort();
            },
            15000,
        );

    try {
        const response =
            await fetch(
                requestUrl,
                {
                    headers:
                        getRequestHeaders(),

                    signal:
                    controller.signal,
                },
            );

        if (!response.ok) {
            const responseText =
                await response.text();

            throw new Error(
                `Strapi ${response.status} для ${requestUrl}: ${responseText}`,
            );
        }

        return (
            await response.json()
        ) as StrapiCollectionResponse;
    } finally {
        clearTimeout(timeout);
    }
}

async function getAllCollectionEntries({
                                           strapiBaseUrl,
                                           baseUrl,
                                           endpoint,
                                           pathPrefix,
                                       }: CollectionSitemapOptions): Promise<
    SitemapEntry[]
> {
    const entries:
        SitemapEntry[] = [];

    let currentPage = 1;
    let pageCount = 1;

    do {
        if (
            currentPage > MAX_PAGES
        ) {
            throw new Error(
                `Превышен лимит страниц Strapi для ${endpoint}`,
            );
        }

        const params =
            new URLSearchParams();

        /*
         * Берём только поля,
         * необходимые Sitemap.
         */
        params.set(
            'fields[0]',
            'slug',
        );

        params.set(
            'fields[1]',
            'updatedAt',
        );

        /*
         * Только записи, включённые
         * на сайте.
         */
        params.set(
            'filters[isActive][$eq]',
            'true',
        );

        /*
         * Только опубликованные записи.
         * Черновики в Sitemap не попадут.
         */
        params.set(
            'status',
            'published',
        );

        params.set(
            'pagination[page]',
            String(currentPage),
        );

        params.set(
            'pagination[pageSize]',
            String(PAGE_SIZE),
        );

        params.set(
            'pagination[withCount]',
            'true',
        );

        /*
         * Стабильный порядок выдачи.
         */
        params.set(
            'sort[0]',
            'updatedAt:desc',
        );

        const requestUrl =
            `${strapiBaseUrl}` +
            `/${endpoint}` +
            `?${params.toString()}`;

        const payload =
            await fetchStrapiJson(
                requestUrl,
            );

        const records =
            Array.isArray(
                payload.data,
            )
                ? payload.data
                : [];

        records.forEach(
            (record) => {
                const item =
                    unwrapStrapiRecord(
                        record,
                    );

                if (!item.slug) {
                    return;
                }

                entries.push({
                    url:
                        `${baseUrl}` +
                        `${pathPrefix}/` +
                        encodeURIComponent(
                            item.slug,
                        ),

                    lastModified:
                    item.updatedAt,
                });
            },
        );

        const receivedPageCount =
            Number(
                payload.meta
                    ?.pagination
                    ?.pageCount,
            );

        pageCount =
            Number.isFinite(
                receivedPageCount,
            ) &&
            receivedPageCount > 0
                ? receivedPageCount
                : 1;

        currentPage += 1;
    } while (
        currentPage <= pageCount
        );

    return entries;
}

function createUrlXml(
    entry: SitemapEntry,
): string {
    const lastModifiedXml =
        entry.lastModified
            ? [
                '',
                '    <lastmod>',
                escapeXml(
                    entry.lastModified,
                ),
                '</lastmod>',
            ].join('')
            : '';

    return [
        '  <url>',
        `    <loc>${escapeXml(
            entry.url,
        )}</loc>${lastModifiedXml}`,
        '  </url>',
    ].join('\n');
}

function deduplicateEntries(
    entries: SitemapEntry[],
): SitemapEntry[] {
    const uniqueEntries =
        new Map<
            string,
            SitemapEntry
        >();

    entries.forEach(
        (entry) => {
            const existing =
                uniqueEntries.get(
                    entry.url,
                );

            /*
             * При дубле сохраняем запись
             * с более свежим lastmod.
             */
            if (!existing) {
                uniqueEntries.set(
                    entry.url,
                    entry,
                );

                return;
            }

            const existingTime =
                existing.lastModified
                    ? new Date(
                        existing.lastModified,
                    ).getTime()
                    : 0;

            const entryTime =
                entry.lastModified
                    ? new Date(
                        entry.lastModified,
                    ).getTime()
                    : 0;

            if (
                entryTime >
                existingTime
            ) {
                uniqueEntries.set(
                    entry.url,
                    entry,
                );
            }
        },
    );

    return [
        ...uniqueEntries.values(),
    ];
}

export default async function handler(
    req: any,
    res: any,
) {
    if (
        req.method !== 'GET' &&
        req.method !== 'HEAD'
    ) {
        res.setHeader(
            'Allow',
            'GET, HEAD',
        );

        return res
            .status(405)
            .send(
                'Method Not Allowed',
            );
    }

    try {
        const host =
            getCurrentHost(req);

        const baseUrl =
            `https://${host}`;

        const strapiBaseUrl =
            getStrapiBaseUrl();

        const staticEntries:
            SitemapEntry[] = [
            {
                url: `${baseUrl}/`,
            },
            {
                url:
                    `${baseUrl}/about`,
            },
            {
                url:
                    `${baseUrl}/catalog`,
            },
            {
                url:
                    `${baseUrl}/contact`,
            },
            {
                url:
                    `${baseUrl}/news`,
            },
        ];


        const [
            productEntries,
            newsEntries,
        ] = await Promise.all([
            getAllCollectionEntries({
                strapiBaseUrl,
                baseUrl,

                endpoint:
                    'products',

                pathPrefix:
                    '/catalog',
            }),

            getAllCollectionEntries({
                strapiBaseUrl,
                baseUrl,

                endpoint:
                    'news-articles',

                pathPrefix:
                    '/news',
            }),
        ]);

        const dynamicEntries = [
            ...productEntries,
            ...newsEntries,
        ].sort(
            (first, second) =>
                first.url.localeCompare(
                    second.url,
                    'ru',
                ),
        );

        const entries =
            deduplicateEntries([
                ...staticEntries,
                ...dynamicEntries,
            ]);

        const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',

            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',

            entries
                .map(createUrlXml)
                .join('\n'),

            '</urlset>',
        ].join('\n');

        res.setHeader(
            'Content-Type',
            'application/xml; charset=utf-8',
        );


        res.setHeader(
            'Cache-Control',
            'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
        );

        res.setHeader(
            'X-Content-Type-Options',
            'nosniff',
        );

        if (
            req.method === 'HEAD'
        ) {
            return res
                .status(200)
                .end();
        }

        return res
            .status(200)
            .send(xml);
    } catch (error) {
        console.error(
            'Sitemap generation failed:',
            error,
        );

        res.setHeader(
            'Content-Type',
            'text/plain; charset=utf-8',
        );

        res.setHeader(
            'Cache-Control',
            'no-store',
        );

        res.setHeader(
            'Retry-After',
            '300',
        );

        return res
            .status(503)
            .send(
                'Sitemap temporarily unavailable',
            );
    }
}