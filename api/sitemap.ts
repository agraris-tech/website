const ALLOWED_HOSTS = new Set([
    'agraristech.by',
    'agraris.ru',
    'agraris.tech',
]);

type SitemapEntry = {
    url: string;
    lastModified?: string;
};

type StrapiProduct = {
    slug?: string;
    updatedAt?: string;

    attributes?: {
        slug?: string;
        updatedAt?: string;
    };
};

function getCurrentHost(req: any): string {
    const forwardedHost = req.headers['x-forwarded-host'];

    const rawHost =
        (
            Array.isArray(forwardedHost)
                ? forwardedHost[0]
                : forwardedHost
        ) ||
        req.headers.host ||
        'agraristech.by';

    const cleanHost = String(rawHost)
        .split(',')[0]
        .trim()
        .toLowerCase()
        .replace(/^www\./, '')
        .split(':')[0];

    return ALLOWED_HOSTS.has(cleanHost)
        ? cleanHost
        : 'agraristech.by';
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function normalizeDate(
    value?: string,
): string | undefined {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return date.toISOString();
}

function getStrapiBaseUrl(): string | null {
    const configuredUrl =
        process.env.STRAPI_URL ||
        process.env.STRAPI_API_URL ||
        process.env.VITE_STRAPI_URL ||
        "";

    const cleanUrl = configuredUrl
        .trim()
        .replace(/\/+$/, '');

    if (!cleanUrl) {
        return null;
    }

    /*
     * Можно указать:
     * https://example.strapiapp.com
     *
     * или:
     * https://example.strapiapp.com/api
     */
    return cleanUrl.endsWith('/api')
        ? cleanUrl
        : `${cleanUrl}/api`;
}

async function getAllProductEntries(
    baseUrl: string,
): Promise<SitemapEntry[]> {
    const strapiBaseUrl = getStrapiBaseUrl();

    if (!strapiBaseUrl) {
        throw new Error(
            'Не указана переменная STRAPI_URL или VITE_STRAPI_URL',
        );
    }

    const entries: SitemapEntry[] = [];

    let currentPage = 1;
    let pageCount = 1;

    do {
        const params = new URLSearchParams();

        params.set('fields[0]', 'slug');
        params.set('fields[1]', 'updatedAt');

        params.set(
            'pagination[page]',
            String(currentPage),
        );

        params.set(
            'pagination[pageSize]',
            '100',
        );

        /*
         * Чтобы в sitemap попадали только опубликованные товары.
         * Для Strapi 5 параметр обычно поддерживается.
         */
        params.set('status', 'published');

        const requestUrl =
            `${strapiBaseUrl}/products?${params.toString()}`;

        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (process.env.STRAPI_API_TOKEN) {
            headers.Authorization =
                `Bearer ${process.env.STRAPI_API_TOKEN}`;
        }

        const response = await fetch(requestUrl, {
            headers,
        });

        if (!response.ok) {
            const responseText =
                await response.text();

            throw new Error(
                `Strapi вернул ${response.status}: ${responseText}`,
            );
        }

        const payload = await response.json();

        const products: StrapiProduct[] =
            Array.isArray(payload?.data)
                ? payload.data
                : [];

        products.forEach((rawProduct) => {
            /*
             * Strapi 5:
             * rawProduct.slug
             *
             * Strapi 4:
             * rawProduct.attributes.slug
             */
            const product =
                rawProduct.attributes ||
                rawProduct;

            const slug =
                product.slug?.trim();

            if (!slug) {
                return;
            }

            entries.push({
                url:
                    `${baseUrl}/catalog/` +
                    encodeURIComponent(slug),

                lastModified:
                    normalizeDate(
                        product.updatedAt,
                    ),
            });
        });

        pageCount = Number(
            payload?.meta?.pagination?.pageCount ||
            1,
        );

        currentPage += 1;
    } while (currentPage <= pageCount);

    return entries;
}

function createUrlXml(
    entry: SitemapEntry,
): string {
    const lastModifiedXml =
        entry.lastModified
            ? `
    <lastmod>${escapeXml(
                entry.lastModified,
            )}</lastmod>`
            : '';

    return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastModifiedXml}
  </url>`;
}

export default async function handler(
    req: any,
    res: any,
) {
    try {
        const host = getCurrentHost(req);
        const baseUrl = `https://${host}`;

        const staticEntries: SitemapEntry[] = [
            {
                url: `${baseUrl}/`,
            },
            {
                url: `${baseUrl}/about`,
            },
            {
                url: `${baseUrl}/catalog`,
            },
            {
                url: `${baseUrl}/contact`,
            },
            {
                url: `${baseUrl}/news`,
            },
        ];

        const productEntries =
            await getAllProductEntries(
                baseUrl,
            );

        /*
         * Удаляем возможные дубли.
         */
        const uniqueEntries = new Map<
            string,
            SitemapEntry
        >();

        [
            ...staticEntries,
            ...productEntries,
        ].forEach((entry) => {
            uniqueEntries.set(
                entry.url,
                entry,
            );
        });

        const entries = [
            ...uniqueEntries.values(),
        ];

        const xml =
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            entries
                .map(createUrlXml)
                .join('\n') +
            `\n</urlset>`;

        res.setHeader(
            'Content-Type',
            'application/xml; charset=utf-8',
        );

        res.setHeader(
            'Cache-Control',
            'public, max-age=0, s-maxage=900, stale-while-revalidate=3600',
        );

        return res
            .status(200)
            .send(xml);
    } catch (error) {
        console.error(
            'Sitemap generation failed:',
            error,
        );

        return res
            .status(500)
            .send(
                'Failed to generate sitemap',
            );
    }
}