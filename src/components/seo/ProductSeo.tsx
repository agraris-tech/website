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

type ProductSeoProps = {
    product: {
        documentId?: string;

        title: string;
        slug: string;

        description?: string;
        shortDescription?: string;

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

    /*
     * Цена и валюта приходят из уже
     * существующей логики ProductPage.
     */
    displayPrice: number | null;
    displayCurrency: string;
};

function getSchemaAvailability(
    availability?: string,
): string | undefined {
    if (!availability) {
        return undefined;
    }

    const normalized =
        availability.toLowerCase();

    if (
        normalized.includes('нет в наличии') ||
        normalized.includes('продан') ||
        normalized.includes('продано') ||
        normalized.includes('out of stock')
    ) {
        return 'https://schema.org/OutOfStock';
    }

    if (
        normalized.includes('под заказ') ||
        normalized.includes('предзаказ') ||
        normalized.includes('preorder')
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

    const canonicalUrl = buildRegionalUrl(
        region,
        pathname,
    );

    const alternateUrls =
        getAlternateUrls(pathname);

    const conditionSuffix =
        product.type === 'used' &&
        !/б\/?\s*у|бывш/i.test(product.title)
            ? ' б/у'
            : '';

    const yearSuffix =
        product.year &&
        !product.title.includes(
            String(product.year),
        )
            ? ` ${product.year} г.`
            : '';

    const productSeoName =
        `${product.title}` +
        `${conditionSuffix}` +
        `${yearSuffix}`;

    const seoTitle =
        `${productSeoName} — купить в ` +
        `${region.countryLocative} | AGRARIS`;

    const plainDescription = stripHtml(
        product.shortDescription ||
        product.description ||
        '',
    );

    const seoDescription = truncateText(
        `Купить ${productSeoName} в ` +
        `${region.countryLocative}. ` +
        `${
            plainDescription ||
            'Фото, технические характеристики, цена и условия поставки.'
        } AGRARIS.`,
    );

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

        name: product.title,
        url: canonicalUrl,

        description: seoDescription,

        itemCondition,

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
                '@type': 'Organization',

                name: region.siteName,
                url: region.baseUrl,

                areaServed: {
                    '@type': 'Country',
                    name:
                    region.countryName,
                },
            },
        };

        if (schemaAvailability) {
            offer.availability =
                schemaAvailability;
        }

        productSchema.offers = offer;
    }

    const structuredData = {
        '@context': 'https://schema.org',

        '@graph': [
            productSchema,

            {
                '@type': 'BreadcrumbList',

                '@id':
                    `${canonicalUrl}` +
                    '#breadcrumbs',

                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Главная',

                        item:
                            `${region.baseUrl}/`,
                    },

                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Каталог',

                        item:
                            `${region.baseUrl}` +
                            '/catalog',
                    },

                    {
                        '@type': 'ListItem',
                        position: 3,

                        name: product.title,
                        item: canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <Helmet prioritizeSeoTags>
            <html lang={region.htmlLang}/>

            <title>{seoTitle}</title>

            <meta
                name="description"
                content={seoDescription}
            />

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
                        href={alternate.href}
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
                        content={primaryImage}
                    />

                    <meta
                        property="og:image:alt"
                        content={product.title}
                    />
                </>
            )}

            {hasPrice && (
                <>
                    <meta
                        property="product:price:amount"
                        content={String(
                            displayPrice.toFixed(2),
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
                    content={primaryImage}
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