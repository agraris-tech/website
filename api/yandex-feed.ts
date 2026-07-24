const STRAPI_ORIGIN =
    'https://cozy-action-02025ea19f.strapiapp.com';

const STRAPI_API_URL =
    `${STRAPI_ORIGIN}/api`;

const SITE_URL =
    'https://agraris.ru';

const DEFAULT_CATEGORY_ID =
    '9000000';

type StrapiRelation = {
    id?: number;
    documentId?: string;
    name?: string;
    slug?: string;

    attributes?: {
        name?: string;
        slug?: string;
    };
};

type StrapiMedia = {
    url?: string;

    attributes?: {
        url?: string;
    };
};

type StrapiProduct = {
    id?: number;
    documentId?: string;

    title?: string;
    slug?: string;

    shortDescription?: string;
    description?: string;

    priceBase?: number | null;
    baseCurrency?: string;

    availability?: string;
    isActive?: boolean;

    type?: 'new' | 'used';

    year?: number | null;
    sku?: string;

    brand?: StrapiRelation | null;
    category?: StrapiRelation | null;
    mainImage?: StrapiMedia | null;

    attributes?: Omit<
        StrapiProduct,
        'attributes'
    >;
};

type CurrencyRate = {
    baseCurrency?: string;
    rubRate?: number | null;

    attributes?: {
        baseCurrency?: string;
        rubRate?: number | null;
    };
};

type FeedProduct = {
    id: string;
    title: string;
    slug: string;

    description: string;

    priceRub: number;

    imageUrl: string;

    brandName: string;
    categoryId: string;
    categoryName: string;

    type: 'new' | 'used';
    year: number | null;
    sku: string;
};

function escapeXml(
    value: unknown,
): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function stripHtml(
    value: string,
): string {
    return value
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function truncateText(
    value: string,
    maxLength = 3000,
): string {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(
        0,
        maxLength - 1,
    ).trim()}…`;
}

function getRelationValue(
    relation?: StrapiRelation | null,
): StrapiRelation | null {
    if (!relation) {
        return null;
    }

    return relation.attributes
        ? {
            ...relation,
            ...relation.attributes,
        }
        : relation;
}

function getMediaUrl(
    media?: StrapiMedia | null,
): string {
    if (!media) {
        return '';
    }

    const rawUrl =
        media.attributes?.url ||
        media.url ||
        '';

    if (!rawUrl) {
        return '';
    }

    if (
        rawUrl.startsWith('https://') ||
        rawUrl.startsWith('http://')
    ) {
        return rawUrl;
    }

    return `${STRAPI_ORIGIN}${
        rawUrl.startsWith('/')
            ? ''
            : '/'
    }${rawUrl}`;
}

function normalizeAvailability(
    value?: string,
): {
    available: boolean;
    preorder: boolean;
} {
    const normalized =
        String(value || '')
            .trim()
            .toLowerCase();

    if (
        normalized.includes(
            'нет в наличии',
        ) ||
        normalized.includes(
            'продан',
        ) ||
        normalized.includes(
            'продано',
        ) ||
        normalized.includes(
            'out of stock',
        )
    ) {
        return {
            available: false,
            preorder: false,
        };
    }

    if (
        normalized.includes(
            'под заказ',
        ) ||
        normalized.includes(
            'предзаказ',
        ) ||
        normalized.includes(
            'preorder',
        )
    ) {
        return {
            available: true,
            preorder: true,
        };
    }

    return {
        available: true,
        preorder: false,
    };
}

function getYmlDate(): string {
    return new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');
}

async function fetchCurrencyRate():
    Promise<number | null> {
    const response = await fetch(
        `${STRAPI_API_URL}/currency-rates`,
        {
            headers: {
                Accept:
                    'application/json',
            },
        },
    );

    if (!response.ok) {
        return null;
    }

    const payload =
        await response.json();

    const rawItem =
        Array.isArray(payload?.data)
            ? payload.data[0]
            : payload?.data;

    if (!rawItem) {
        return null;
    }

    const item: CurrencyRate =
        rawItem.attributes
            ? {
                ...rawItem,
                ...rawItem.attributes,
            }
            : rawItem;

    const rate =
        Number(item.rubRate);

    return Number.isFinite(rate) &&
    rate > 0
        ? rate
        : null;
}

function convertToRub(
    price: number,
    currency: string,
    rubRate: number | null,
): number | null {
    const normalizedCurrency =
        currency
            .trim()
            .toUpperCase();

    if (
        normalizedCurrency === 'RUB' ||
        normalizedCurrency === 'RUR'
    ) {
        return price;
    }

    if (
        normalizedCurrency === 'EUR' &&
        rubRate
    ) {
        return price * rubRate;
    }

    return null;
}

async function fetchAllProducts(
    rubRate: number | null,
): Promise<FeedProduct[]> {
    const products: FeedProduct[] = [];

    let currentPage = 1;
    let pageCount = 1;

    do {
        const params =
            new URLSearchParams();

        params.set(
            'pagination[page]',
            String(currentPage),
        );

        params.set(
            'pagination[pageSize]',
            '100',
        );

        params.set(
            'filters[isActive][$eq]',
            'true',
        );

        params.set(
            'status',
            'published',
        );

        params.set(
            'sort[0]',
            'publishedAt:desc',
        );

        params.set(
            'populate[0]',
            'brand',
        );

        params.set(
            'populate[1]',
            'category',
        );

        params.set(
            'populate[2]',
            'mainImage',
        );

        const response = await fetch(
            `${STRAPI_API_URL}/products?${params.toString()}`,
            {
                headers: {
                    Accept:
                        'application/json',
                },
            },
        );

        if (!response.ok) {
            const errorText =
                await response.text();

            throw new Error(
                `Strapi products error ${response.status}: ${errorText}`,
            );
        }

        const payload =
            await response.json();

        const items: StrapiProduct[] =
            Array.isArray(payload?.data)
                ? payload.data
                : [];

        for (
            const rawItem of items
            ) {
            const item =
                rawItem.attributes
                    ? {
                        ...rawItem,
                        ...rawItem.attributes,
                    }
                    : rawItem;

            if (
                item.isActive === false
            ) {
                continue;
            }

            const title =
                String(
                    item.title || '',
                ).trim();

            const slug =
                String(
                    item.slug || '',
                ).trim();

            const priceBase =
                Number(item.priceBase);

            const imageUrl =
                getMediaUrl(
                    item.mainImage,
                );

            if (
                !title ||
                !slug ||
                !Number.isFinite(
                    priceBase,
                ) ||
                priceBase <= 0 ||
                !imageUrl
            ) {
                continue;
            }

            const availability =
                normalizeAvailability(
                    item.availability,
                );

            if (
                !availability.available
            ) {
                continue;
            }

            const priceRub =
                convertToRub(
                    priceBase,
                    item.baseCurrency ||
                    'EUR',
                    rubRate,
                );

            if (
                !priceRub ||
                !Number.isFinite(
                    priceRub,
                ) ||
                priceRub <= 0
            ) {
                continue;
            }

            const brand =
                getRelationValue(
                    item.brand,
                );

            const category =
                getRelationValue(
                    item.category,
                );

            const categoryId =
                category?.id
                    ? String(
                        category.id,
                    )
                    : DEFAULT_CATEGORY_ID;

            const categoryName =
                String(
                    category?.name ||
                    'Сельскохозяйственная техника',
                ).trim();

            const rawDescription =
                String(
                    item.shortDescription ||
                    item.description ||
                    '',
                );

            const description =
                truncateText(
                    stripHtml(
                        rawDescription,
                    ) ||
                    `${title}. Подбор, проверка и доставка по России.`,
                );

            products.push({
                id:
                    String(
                        item.documentId ||
                        item.id ||
                        slug,
                    ),

                title,
                slug,
                description,

                priceRub:
                    Math.round(
                        priceRub,
                    ),

                imageUrl,

                brandName:
                    String(
                        brand?.name ||
                        '',
                    ).trim(),

                categoryId,
                categoryName,

                type:
                    item.type === 'new'
                        ? 'new'
                        : 'used',

                year:
                    Number.isFinite(
                        Number(item.year),
                    )
                        ? Number(
                            item.year,
                        )
                        : null,

                sku:
                    String(
                        item.sku ||
                        '',
                    ).trim(),
            });
        }

        pageCount =
            Number(
                payload?.meta
                    ?.pagination
                    ?.pageCount,
            ) || 1;

        currentPage += 1;
    } while (
        currentPage <= pageCount
        );

    return products;
}

function createFeedXml(
    products: FeedProduct[],
): string {
    const categoryMap =
        new Map<
            string,
            string
        >();

    products.forEach(
        (product) => {
            categoryMap.set(
                product.categoryId,
                product.categoryName,
            );
        },
    );

    if (
        !categoryMap.has(
            DEFAULT_CATEGORY_ID,
        )
    ) {
        categoryMap.set(
            DEFAULT_CATEGORY_ID,
            'Сельскохозяйственная техника',
        );
    }

    const categoriesXml =
        Array.from(
            categoryMap.entries(),
        )
            .map(
                ([
                     id,
                     name,
                 ]) =>
                    `      <category id="${escapeXml(
                        id,
                    )}">${escapeXml(
                        name,
                    )}</category>`,
            )
            .join('\n');

    const offersXml =
        products
            .map((product) => {
                const pageUrl =
                    `${SITE_URL}/catalog/` +
                    encodeURIComponent(
                        product.slug,
                    );

                const trackingUrl =
                    `${pageUrl}` +
                    `?utm_source=yandex` +
                    `&utm_medium=cpc` +
                    `&utm_campaign={campaign_id}` +
                    `&utm_content=feed_${encodeURIComponent(
                        product.slug,
                    )}_{ad_id}_{source_type}_{device_type}` +
                    `&utm_term={keyword}`;

                const condition =
                    product.type ===
                    'new'
                        ? 'Новая'
                        : 'Б/У';

                const optionalXml = [
                    product.brandName
                        ? `        <vendor>${escapeXml(
                            product.brandName,
                        )}</vendor>`
                        : '',

                    product.sku
                        ? `        <vendorCode>${escapeXml(
                            product.sku,
                        )}</vendorCode>`
                        : '',

                    product.year
                        ? `        <param name="Год">${escapeXml(
                            product.year,
                        )}</param>`
                        : '',

                    `        <param name="Состояние">${escapeXml(
                        condition,
                    )}</param>`,
                ]
                    .filter(Boolean)
                    .join('\n');

                return `      <offer id="${escapeXml(
                    product.id,
                )}" available="true">
        <url>${escapeXml(
                    trackingUrl,
                )}</url>
        <price>${product.priceRub}</price>
        <currencyId>RUB</currencyId>
        <categoryId>${escapeXml(
                    product.categoryId,
                )}</categoryId>
        <picture>${escapeXml(
                    product.imageUrl,
                )}</picture>
        <name>${escapeXml(
                    product.title,
                )}</name>
        <description>${escapeXml(
                    product.description,
                )}</description>
${optionalXml}
      </offer>`;
            })
            .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${getYmlDate()}">
  <shop>
    <name>AGRARIS</name>
    <company>AGRARIS</company>
    <url>${SITE_URL}</url>

    <currencies>
      <currency id="RUB" rate="1"/>
    </currencies>

    <categories>
${categoriesXml}
    </categories>

    <offers>
${offersXml}
    </offers>
  </shop>
</yml_catalog>`;
}

export default async function handler(
    req: any,
    res: any,
) {
    if (
        req.method !== 'GET'
    ) {
        res.setHeader(
            'Allow',
            'GET',
        );

        return res
            .status(405)
            .send(
                'Method Not Allowed',
            );
    }

    try {
        const rubRate =
            await fetchCurrencyRate();

        const products =
            await fetchAllProducts(
                rubRate,
            );

        const xml =
            createFeedXml(
                products,
            );

        res.setHeader(
            'Content-Type',
            'application/xml; charset=utf-8',
        );

        res.setHeader(
            'Cache-Control',
            'public, s-maxage=1800, stale-while-revalidate=3600',
        );

        return res
            .status(200)
            .send(xml);
    } catch (error) {
        console.error(
            'Yandex feed error:',
            error,
        );

        return res
            .status(500)
            .send(
                'Failed to generate Yandex feed',
            );
    }
}