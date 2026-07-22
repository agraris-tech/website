import { Helmet } from 'react-helmet-async';

import {
    buildRegionalUrl,
    getAlternateUrls,
    getCurrentRegion,
    makeAbsoluteUrl,
    serializeJsonLd,
    stripHtml,
    truncateText,
} from './seoConfig';

type ProductSeoProduct = {
    documentId?: string;

    title: string;
    slug: string;

    description?: string;
    shortDescription?: string;

    /*
     * Эти поля уже существуют в Strapi.
     * Новые поля в Content-Type создавать не нужно.
     */
    metaTitle?: string | null;
    metaDescription?: string | null;
    searchKeywords?: string | null;

    availability?: string;

    type: 'new' | 'used';

    year?: number | null;
    manufacturer?: string;
    sku?: string;

    brand?: {
        name: string;
    } | null;

    category?: {
        name: string;
        slug?: string;
    } | null;

    images?: string[];
};

type ProductSeoProps = {
    product: ProductSeoProduct;

    /*
     * Цена и валюта приходят из уже
     * существующей логики ProductPage.
     */
    displayPrice: number | null;
    displayCurrency: string;
};

/*
 * Убирает HTML, лишние переносы
 * и пробелы из SEO-полей.
 */
function cleanText(
    value?: string | null,
): string {
    return stripHtml(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

/*
 * Преобразует slug в обычный текст.
 *
 * Например:
 * avtomaticheskij-zapolnitel-grimme-gbf-2023
 *
 * станет:
 * Avtomaticheskij zapolnitel grimme gbf 2023
 */
function slugToText(slug: string): string {
    let decodedSlug = slug;

    try {
        decodedSlug =
            decodeURIComponent(slug);
    } catch {
        decodedSlug = slug;
    }

    const text = decodedSlug
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!text) {
        return '';
    }

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}

/*
 * Удаляет дубли ключевых фраз
 * и приводит разделители к запятым.
 */
function normalizeKeywords(
    value?: string | null,
): string {
    if (!value) {
        return '';
    }

    const keywords = value
        .split(/[,;\n]+/)
        .map((keyword) =>
            cleanText(keyword),
        )
        .filter(Boolean);

    const uniqueKeywords: string[] = [];
    const usedKeywords =
        new Set<string>();

    for (const keyword of keywords) {
        const normalized =
            keyword.toLowerCase();

        if (usedKeywords.has(normalized)) {
            continue;
        }

        usedKeywords.add(normalized);
        uniqueKeywords.push(keyword);
    }

    /*
     * Не создаём слишком длинный
     * meta keywords.
     */
    return uniqueKeywords
        .slice(0, 15)
        .join(', ');
}

/*
 * Автоматическое создание ключевых слов,
 * когда searchKeywords не заполнен в Strapi.
 */
function buildGeneratedKeywords(
    product: ProductSeoProduct,
    productSeoName: string,
    countryName: string,
    countryLocative: string,
): string {
    const productName =
        cleanText(product.title) ||
        slugToText(product.slug) ||
        'Сельскохозяйственная техника';

    const slugText =
        slugToText(product.slug);

    const brandName =
        cleanText(product.brand?.name);

    const manufacturer =
        cleanText(product.manufacturer);

    const categoryName =
        cleanText(product.category?.name);

    const year =
        product.year
            ? String(product.year)
            : '';

    const conditionKeyword =
        product.type === 'used'
            ? `${productName} б/у`
            : `${productName} новая`;

    const generatedKeywords = [
        productSeoName,
        productName,
        slugText,

        brandName,
        manufacturer,
        categoryName,

        year
            ? `${productName} ${year}`
            : '',

        `${productName} купить`,
        `${productName} цена`,
        `${productName} купить в ${countryLocative}`,

        conditionKeyword,

        categoryName
            ? `${categoryName} в ${countryName}`
            : '',
    ]
        .filter(Boolean)
        .join(', ');

    return normalizeKeywords(
        generatedKeywords,
    );
}

function getSchemaAvailability(
    availability?: string,
): string | undefined {
    if (!availability) {
        return undefined;
    }

    /*
     * Благодаря замене подчёркиваний
     * корректно распознаются:
     *
     * in_stock
     * out_of_stock
     * pre_order
     */
    const normalized = availability
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (
        normalized.includes(
            'нет в наличии',
        ) ||
        normalized.includes('продан') ||
        normalized.includes('продано') ||
        normalized.includes(
            'out of stock',
        )
    ) {
        return 'https://schema.org/OutOfStock';
    }

    if (
        normalized.includes('под заказ') ||
        normalized.includes('предзаказ') ||
        normalized.includes('preorder') ||
        normalized.includes('pre order')
    ) {
        return 'https://schema.org/PreOrder';
    }

    if (
        normalized.includes('в наличии') ||
        normalized.includes('доступен') ||
        normalized.includes('in stock')
    ) {
        return 'https://schema.org/InStock';
    }

    return undefined;
}

export default function ProductSeo({
                                       product,
                                       displayPrice,
                                       displayCurrency,
                                   }: ProductSeoProps) {
    const region = getCurrentRegion();

    const pathname =
        `/catalog/${product.slug}`;

    const canonicalUrl =
        buildRegionalUrl(
            region,
            pathname,
        );

    const alternateUrls =
        getAlternateUrls(pathname);

    /*
     * Сначала используем title.
     * Если title по какой-либо причине пустой,
     * берём текст из slug.
     */
    const baseProductName =
        cleanText(product.title) ||
        slugToText(product.slug) ||
        'Сельскохозяйственная техника';

    const conditionSuffix =
        product.type === 'used' &&
        !/б\/?\s*у|бывш/i.test(
            baseProductName,
        )
            ? ' б/у'
            : '';

    const yearSuffix =
        product.year &&
        !baseProductName.includes(
            String(product.year),
        )
            ? ` ${product.year} г.`
            : '';

    const productSeoName =
        `${baseProductName}` +
        `${conditionSuffix}` +
        `${yearSuffix}`;

    /*
     * Старая автоматическая логика.
     * Используется только при пустом
     * metaTitle в Strapi.
     */
    const generatedSeoTitle =
        `${productSeoName} — купить в ` +
        `${region.countryLocative} | AGRARIS`;

    /*
     * metaTitle из Strapi имеет приоритет.
     */
    const customMetaTitle =
        cleanText(product.metaTitle);

    const seoTitle =
        customMetaTitle ||
        generatedSeoTitle;

    const plainDescription =
        cleanText(
            product.shortDescription ||
            product.description ||
            '',
        );

    /*
     * Старая автоматическая логика.
     * Используется только при пустом
     * metaDescription.
     */
    const generatedSeoDescription =
        truncateText(
            `Купить ${productSeoName} в ` +
            `${region.countryLocative}. ` +
            `${
                plainDescription ||
                'Фото, технические характеристики, цена и условия поставки.'
            } AGRARIS.`,
        );

    /*
     * metaDescription из Strapi
     * имеет приоритет.
     */
    const customMetaDescription =
        cleanText(
            product.metaDescription,
        );

    const seoDescription =
        customMetaDescription ||
        generatedSeoDescription;

    /*
     * Сначала пытаемся получить
     * searchKeywords из Strapi.
     */
    const customSearchKeywords =
        normalizeKeywords(
            product.searchKeywords,
        );

    /*
     * Если поле пустое — ключевые слова
     * формируются автоматически.
     */
    const generatedSearchKeywords =
        buildGeneratedKeywords(
            product,
            productSeoName,
            region.countryName,
            region.countryLocative,
        );

    const seoKeywords =
        customSearchKeywords ||
        generatedSearchKeywords;

    const imageUrls = (
        product.images || []
    ).map((image) =>
        makeAbsoluteUrl(
            image,
            region.baseUrl,
        ),
    );

    const primaryImage =
        imageUrls[0] || null;

    const schemaAvailability =
        getSchemaAvailability(
            product.availability,
        );

    const itemCondition =
        product.type === 'new'
            ? 'https://schema.org/NewCondition'
            : 'https://schema.org/UsedCondition';

    const hasPrice =
        displayPrice !== null &&
        Number.isFinite(displayPrice) &&
        displayPrice > 0;

    const productSchema: Record<
        string,
        unknown
    > = {
        '@type': 'Product',

        '@id': `${canonicalUrl}#product`,

        name: baseProductName,
        url: canonicalUrl,

        description: seoDescription,

        itemCondition,

        ...(seoKeywords
            ? {
                keywords: seoKeywords,
            }
            : {}),

        ...(imageUrls.length > 0
            ? {
                image: imageUrls,
            }
            : {}),

        ...(product.sku ||
        product.documentId
            ? {
                sku:
                    product.sku ||
                    product.documentId,
            }
            : {}),

        ...(product.brand?.name
            ? {
                brand: {
                    '@type': 'Brand',

                    name:
                    product.brand.name,
                },
            }
            : {}),

        ...(product.manufacturer
            ? {
                manufacturer: {
                    '@type':
                        'Organization',

                    name:
                    product.manufacturer,
                },
            }
            : {}),

        ...(product.category?.name
            ? {
                category:
                product.category.name,
            }
            : {}),
    };

    if (hasPrice) {
        const offer: Record<
            string,
            unknown
        > = {
            '@type': 'Offer',

            url: canonicalUrl,

            price: Number(
                displayPrice.toFixed(2),
            ),

            priceCurrency:
            displayCurrency,

            itemCondition,

            seller: {
                '@type':
                    'Organization',

                name:
                region.siteName,

                url:
                region.baseUrl,

                areaServed: {
                    '@type':
                        'Country',

                    name:
                    region.countryName,
                },
            },
        };

        if (schemaAvailability) {
            offer.availability =
                schemaAvailability;
        }

        productSchema.offers =
            offer;
    }

    const structuredData = {
        '@context':
            'https://schema.org',

        '@graph': [
            productSchema,

            {
                '@type':
                    'BreadcrumbList',

                '@id':
                    `${canonicalUrl}` +
                    '#breadcrumbs',

                itemListElement: [
                    {
                        '@type':
                            'ListItem',

                        position: 1,
                        name: 'Главная',

                        item:
                            `${region.baseUrl}/`,
                    },

                    {
                        '@type':
                            'ListItem',

                        position: 2,
                        name: 'Каталог',

                        item:
                            `${region.baseUrl}` +
                            '/catalog',
                    },

                    {
                        '@type':
                            'ListItem',

                        position: 3,

                        name:
                        baseProductName,

                        item:
                        canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <Helmet prioritizeSeoTags>
            <html lang={region.htmlLang}/>

            <title>
                {seoTitle}
            </title>

            <meta
                name="description"
                content={seoDescription}
            />

            {seoKeywords && (
                <meta
                    name="keywords"
                    content={seoKeywords}
                />
            )}

            <meta
                name="robots"
                content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            />

            <link
                rel="canonical"
                href={canonicalUrl}
            />

            {alternateUrls.map(
                (alternate) => (
                    <link
                        key={
                            alternate.hrefLang
                        }
                        rel="alternate"
                        hrefLang={
                            alternate.hrefLang
                        }
                        href={
                            alternate.href
                        }
                    />
                ),
            )}

            <meta
                property="og:type"
                content="product"
            />

            <meta
                property="og:site_name"
                content={region.siteName}
            />

            <meta
                property="og:locale"
                content={region.ogLocale}
            />

            <meta
                property="og:title"
                content={seoTitle}
            />

            <meta
                property="og:description"
                content={seoDescription}
            />

            <meta
                property="og:url"
                content={canonicalUrl}
            />

            {primaryImage && (
                <>
                    <meta
                        property="og:image"
                        content={
                            primaryImage
                        }
                    />

                    <meta
                        property="og:image:alt"
                        content={
                            baseProductName
                        }
                    />
                </>
            )}

            {hasPrice && (
                <>
                    <meta
                        property="product:price:amount"
                        content={String(
                            displayPrice.toFixed(
                                2,
                            ),
                        )}
                    />

                    <meta
                        property="product:price:currency"
                        content={
                            displayCurrency
                        }
                    />
                </>
            )}

            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={seoTitle}
            />

            <meta
                name="twitter:description"
                content={seoDescription}
            />

            {primaryImage && (
                <meta
                    name="twitter:image"
                    content={
                        primaryImage
                    }
                />
            )}

            <script type="application/ld+json">
                {serializeJsonLd(
                    structuredData,
                )}
            </script>
        </Helmet>
    );
}