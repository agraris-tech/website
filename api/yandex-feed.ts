const STRAPI_ORIGIN =
    'https://cozy-action-02025ea19f.strapiapp.com';

const STRAPI_API_URL =
    `${STRAPI_ORIGIN}/api`;

const SITE_URL =
    'https://agraris.ru';

const DEFAULT_CATEGORY_ID =
    '9000000';

const DEFAULT_CATEGORY_NAME =
    'Сельскохозяйственная техника';

/*
 * Не передаём в рекламный фид
 * условные и слишком низкие цены.
 *
 * Это отделяет крупную технику
 * от дешёвых запчастей.
 */
const MIN_EQUIPMENT_PRICE_RUB =
    100_000;

/*
 * Категории, которые не должны
 * участвовать в этой рекламной кампании.
 */
const EXCLUDED_CATEGORY_IDS =
    new Set<string>([
        '64', // Запчасти Grimme
        '69', // Строительная техника
        '75', // Запчасти Sipma
        '76', // Запчасти ANNA Z644
    ]);

const EXCLUDED_CATEGORY_NAME_PARTS = [
    'запчаст',
    'строительная техника',
];

type ProductCondition =
    | 'Новая'
    | 'Б/У'
    | null;

type ProductType =
    | 'new'
    | 'used';

type StrapiRelation = {
    data?:
        | StrapiRelation
        | null;

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
    data?:
        | StrapiMedia
        | null;

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

    priceBase?:
        | number
        | string
        | null;

    baseCurrency?: string;

    availability?: string;

    isActive?: boolean;

    type?: ProductType;

    year?:
        | number
        | string
        | null;

    sku?: string;

    brand?:
        | StrapiRelation
        | null;

    category?:
        | StrapiRelation
        | null;

    mainImage?:
        | StrapiMedia
        | null;

    attributes?: Omit<
        StrapiProduct,
        'attributes'
    >;
};

type CurrencyRate = {
    id?: number;

    baseCurrency?: string;

    rubRate?:
        | number
        | string
        | null;

    attributes?: {
        baseCurrency?: string;

        rubRate?:
            | number
            | string
            | null;
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

    condition: ProductCondition;

    year: number | null;

    sku: string;
};

function escapeXml(
    value: unknown,
): string {
    return String(
        value ?? '',
    )
        .replace(
            /&/g,
            '&amp;',
        )
        .replace(
            /</g,
            '&lt;',
        )
        .replace(
            />/g,
            '&gt;',
        )
        .replace(
            /"/g,
            '&quot;',
        )
        .replace(
            /'/g,
            '&apos;',
        );
}

function cleanText(
    value: unknown,
): string {
    return String(
        value ?? '',
    )
        .replace(
            /<script[\s\S]*?<\/script>/gi,
            ' ',
        )
        .replace(
            /<style[\s\S]*?<\/style>/gi,
            ' ',
        )
        .replace(
            /<[^>]+>/g,
            ' ',
        )
        .replace(
            /&nbsp;/gi,
            ' ',
        )
        .replace(
            /&amp;/gi,
            '&',
        )
        .replace(
            /&quot;/gi,
            '"',
        )
        .replace(
            /&#39;/gi,
            "'",
        )
        .replace(
            /&ndash;/gi,
            '–',
        )
        .replace(
            /&mdash;/gi,
            '—',
        )
        .replace(
            /&sup3;/gi,
            '³',
        )
        .replace(
            /\s+/g,
            ' ',
        )
        .trim();
}

function normalizeHostnameUrl(
    rawUrl: string,
): string {
    if (!rawUrl) {
        return '';
    }

    if (
        rawUrl.startsWith(
            'https://',
        ) ||
        rawUrl.startsWith(
            'http://',
        )
    ) {
        return rawUrl;
    }

    return (
        STRAPI_ORIGIN +
        (
            rawUrl.startsWith(
                '/',
            )
                ? ''
                : '/'
        ) +
        rawUrl
    );
}

function getRelationValue(
    relation?:
        | StrapiRelation
        | null,
): StrapiRelation | null {
    if (!relation) {
        return null;
    }

    const rawRelation =
        relation.data ||
        relation;

    if (!rawRelation) {
        return null;
    }

    return {
        ...rawRelation,

        ...(
            rawRelation.attributes ||
            {}
        ),
    };
}

function getMediaUrl(
    media?:
        | StrapiMedia
        | null,
): string {
    if (!media) {
        return '';
    }

    const rawMedia =
        media.data ||
        media;

    if (!rawMedia) {
        return '';
    }

    const rawUrl =
        rawMedia.attributes?.url ||
        rawMedia.url ||
        '';

    return normalizeHostnameUrl(
        rawUrl,
    );
}

function getCategoryId(
    category:
        | StrapiRelation
        | null,
): string {
    const numericId =
        Number(category?.id);

    if (
        Number.isInteger(
            numericId,
        ) &&
        numericId > 0
    ) {
        return String(
            numericId,
        );
    }

    return DEFAULT_CATEGORY_ID;
}

function isExcludedCategory(
    categoryId: string,
    categoryName: string,
): boolean {
    if (
        EXCLUDED_CATEGORY_IDS.has(
            categoryId,
        )
    ) {
        return true;
    }

    const normalizedName =
        categoryName
            .toLowerCase()
            .trim();

    return EXCLUDED_CATEGORY_NAME_PARTS
        .some(
            (part) =>
                normalizedName.includes(
                    part,
                ),
        );
}

function isProductAvailable(
    availability?: string,
): boolean {
    const normalized =
        cleanText(
            availability,
        )
            .toLowerCase()
            .replace(
                /[_-]+/g,
                ' ',
            );

    if (!normalized) {
        return true;
    }

    const unavailableMarkers = [
        'нет в наличии',
        'не доступен',
        'недоступен',
        'продан',
        'продано',
        'out of stock',
        'unavailable',
        'sold',
    ];

    return !unavailableMarkers
        .some(
            (marker) =>
                normalized.includes(
                    marker,
                ),
        );
}

function getProductCondition(
    type?: ProductType,
): ProductCondition {
    if (type === 'new') {
        return 'Новая';
    }

    if (type === 'used') {
        return 'Б/У';
    }

    return null;
}

function getProductYear(
    value:
        | number
        | string
        | null
        | undefined,
): number | null {
    const year =
        Number(value);

    const maximumYear =
        new Date()
            .getUTCFullYear() +
        1;

    if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > maximumYear
    ) {
        return null;
    }

    return year;
}

function getYmlDate(): string {
    return new Date()
        .toISOString()
        .slice(
            0,
            16,
        )
        .replace(
            'T',
            ' ',
        );
}

function normalizeCurrencyCode(
    value?: string,
): string {
    const currency =
        cleanText(
            value ||
            'EUR',
        )
            .toUpperCase();

    if (currency === 'RUR') {
        return 'RUB';
    }

    return currency;
}

function createNeutralDescription(
    product: {
        title: string;
        categoryName: string;
        brandName: string;
        year: number | null;
        condition:
            ProductCondition;
    },
): string {
    const parts: string[] = [
        product.title,
        `Категория: ${product.categoryName}.`,
    ];

    if (product.brandName) {
        parts.push(
            `Производитель: ${product.brandName}.`,
        );
    }

    if (product.year) {
        parts.push(
            `Год выпуска: ${product.year}.`,
        );
    }

    if (product.condition) {
        parts.push(
            `Состояние: ${product.condition}.`,
        );
    }

    return parts
        .join(' ')
        .replace(
            /\s+/g,
            ' ',
        )
        .trim()
        .slice(
            0,
            3000,
        );
}

function getOfferId(
    product: StrapiProduct,
    slug: string,
): string {
    const rawId =
        cleanText(
            product.documentId ||
            product.id ||
            slug,
        );

    return rawId
        .slice(
            0,
            100,
        );
}

async function fetchCurrencyRates():
    Promise<Map<string, number>> {
    const params =
        new URLSearchParams();

    params.set(
        'pagination[pageSize]',
        '100',
    );

    params.set(
        'status',
        'published',
    );

    const response =
        await fetch(
            `${STRAPI_API_URL}/currency-rates?${params.toString()}`,
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
            `Strapi currency rates error ${response.status}: ${errorText}`,
        );
    }

    const payload =
        await response.json();

    const rawItems:
        CurrencyRate[] =
        Array.isArray(
            payload?.data,
        )
            ? payload.data
            : payload?.data
                ? [
                    payload.data,
                ]
                : [];

    const rates =
        new Map<
            string,
            number
        >();

    rates.set(
        'RUB',
        1,
    );

    for (
        const rawItem of rawItems
        ) {
        const item:
            CurrencyRate =
            rawItem.attributes
                ? {
                    ...rawItem,
                    ...rawItem.attributes,
                }
                : rawItem;

        const currency =
            normalizeCurrencyCode(
                item.baseCurrency,
            );

        const rubRate =
            Number(
                item.rubRate,
            );

        if (
            !currency ||
            !Number.isFinite(
                rubRate,
            ) ||
            rubRate <= 0
        ) {
            continue;
        }

        rates.set(
            currency,
            rubRate,
        );
    }

    /*
     * Большая часть каталога AGRARIS
     * хранится в EUR. Не генерируем
     * неполный фид без курса.
     */
    if (
        !rates.has(
            'EUR',
        )
    ) {
        throw new Error(
            'EUR to RUB currency rate is missing',
        );
    }

    return rates;
}

function convertToRub(
    price: number,
    currency: string,
    rates:
        Map<string, number>,
): number | null {
    const normalizedCurrency =
        normalizeCurrencyCode(
            currency,
        );

    const rubRate =
        rates.get(
            normalizedCurrency,
        );

    if (
        !rubRate ||
        !Number.isFinite(
            rubRate,
        ) ||
        rubRate <= 0
    ) {
        return null;
    }

    const convertedPrice =
        price *
        rubRate;

    if (
        !Number.isFinite(
            convertedPrice,
        ) ||
        convertedPrice <= 0
    ) {
        return null;
    }

    return Math.round(
        convertedPrice,
    );
}

async function fetchAllProducts(
    currencyRates:
        Map<string, number>,
): Promise<FeedProduct[]> {
    const products:
        FeedProduct[] = [];

    const seenOfferIds =
        new Set<string>();

    let currentPage =
        1;

    let pageCount =
        1;

    do {
        const params =
            new URLSearchParams();

        params.set(
            'pagination[page]',
            String(
                currentPage,
            ),
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

        const response =
            await fetch(
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

        const rawItems:
            StrapiProduct[] =
            Array.isArray(
                payload?.data,
            )
                ? payload.data
                : [];

        for (
            const rawItem of rawItems
            ) {
            const item:
                StrapiProduct =
                rawItem.attributes
                    ? {
                        ...rawItem,
                        ...rawItem.attributes,
                    }
                    : rawItem;

            if (
                item.isActive ===
                false
            ) {
                continue;
            }

            if (
                !isProductAvailable(
                    item.availability,
                )
            ) {
                continue;
            }

            const title =
                cleanText(
                    item.title,
                );

            const slug =
                cleanText(
                    item.slug,
                );

            const sourcePrice =
                Number(
                    item.priceBase,
                );

            const imageUrl =
                getMediaUrl(
                    item.mainImage,
                );

            /*
             * Цена 0 или 1 обычно
             * означает «по запросу».
             */
            if (
                !title ||
                !slug ||
                !imageUrl ||
                !Number.isFinite(
                    sourcePrice,
                ) ||
                sourcePrice <= 1
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

            const brandName =
                cleanText(
                    brand?.name,
                );

            const categoryId =
                getCategoryId(
                    category,
                );

            const categoryName =
                cleanText(
                    category?.name ||
                    DEFAULT_CATEGORY_NAME,
                );

            if (
                isExcludedCategory(
                    categoryId,
                    categoryName,
                )
            ) {
                continue;
            }

            const priceRub =
                convertToRub(
                    sourcePrice,
                    item.baseCurrency ||
                    'EUR',
                    currencyRates,
                );

            if (
                !priceRub ||
                priceRub <
                MIN_EQUIPMENT_PRICE_RUB
            ) {
                continue;
            }

            const condition =
                getProductCondition(
                    item.type,
                );

            const year =
                getProductYear(
                    item.year,
                );

            const offerId =
                getOfferId(
                    item,
                    slug,
                );

            if (
                !offerId ||
                seenOfferIds.has(
                    offerId,
                )
            ) {
                continue;
            }

            seenOfferIds.add(
                offerId,
            );

            products.push({
                id:
                offerId,

                title,
                slug,

                description:
                    createNeutralDescription(
                        {
                            title,
                            categoryName,
                            brandName,
                            year,
                            condition,
                        },
                    ),

                priceRub,

                imageUrl,

                brandName,

                categoryId,
                categoryName,

                condition,

                year,

                sku:
                    cleanText(
                        item.sku,
                    ),
            });
        }

        pageCount =
            Number(
                payload?.meta
                    ?.pagination
                    ?.pageCount,
            ) || 1;

        currentPage +=
            1;
    } while (
        currentPage <=
        pageCount
        );

    if (
        products.length ===
        0
    ) {
        throw new Error(
            'No eligible products found for Yandex feed',
        );
    }

    return products;
}

function createTrackingUrl(
    product: FeedProduct,
): string {
    const productUrl =
        `${SITE_URL}/catalog/` +
        encodeURIComponent(
            product.slug,
        );

    const utmContent =
        `feed_${product.slug}` +
        `_{ad_id}` +
        `_{source_type}` +
        `_{device_type}`;

    return (
        productUrl +
        '?utm_source=yandex' +
        '&utm_medium=cpc' +
        '&utm_campaign={campaign_id}' +
        `&utm_content=${encodeURIComponent(
            utmContent,
        )
            /*
             * Возвращаем фигурные скобки
             * динамических параметров.
             */
            .replace(
                /%7B/gi,
                '{',
            )
            .replace(
                /%7D/gi,
                '}',
            )}` +
        '&utm_term={keyword}'
    );
}

function createCategoriesXml(
    products:
        FeedProduct[],
): string {
    const categoryMap =
        new Map<
            string,
            string
        >();

    for (
        const product of products
        ) {
        categoryMap.set(
            product.categoryId,
            product.categoryName,
        );
    }

    return Array.from(
        categoryMap.entries(),
    )
        .sort(
            (
                [firstId],
                [secondId],
            ) =>
                Number(
                    firstId,
                ) -
                Number(
                    secondId,
                ),
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
}

function createOfferXml(
    product:
        FeedProduct,
): string {
    const optionalElements:
        string[] = [];

    if (
        product.brandName
    ) {
        optionalElements.push(
            `        <vendor>${escapeXml(
                product.brandName,
            )}</vendor>`,
        );
    }

    if (
        product.sku
    ) {
        optionalElements.push(
            `        <vendorCode>${escapeXml(
                product.sku,
            )}</vendorCode>`,
        );
    }

    if (
        product.year
    ) {
        optionalElements.push(
            `        <param name="Год выпуска">${escapeXml(
                product.year,
            )}</param>`,
        );
    }

    /*
     * Не подставляем Б/У по умолчанию.
     * Параметр выводится только тогда,
     * когда type заполнен в Strapi.
     */
    if (
        product.condition
    ) {
        optionalElements.push(
            `        <param name="Состояние">${escapeXml(
                product.condition,
            )}</param>`,
        );
    }

    const optionalXml =
        optionalElements.length
            ? `\n${optionalElements.join(
                '\n',
            )}`
            : '';

    return `      <offer id="${escapeXml(
        product.id,
    )}" available="true">
        <url>${escapeXml(
        createTrackingUrl(
            product,
        ),
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
    )}</description>${optionalXml}
      </offer>`;
}

function createFeedXml(
    products:
        FeedProduct[],
): string {
    const categoriesXml =
        createCategoriesXml(
            products,
        );

    const offersXml =
        products
            .map(
                createOfferXml,
            )
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
        req.method !==
        'GET'
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
        const currencyRates =
            await fetchCurrencyRates();

        const products =
            await fetchAllProducts(
                currencyRates,
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

        res.setHeader(
            'X-Content-Type-Options',
            'nosniff',
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