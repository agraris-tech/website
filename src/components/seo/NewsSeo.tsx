import { Helmet } from 'react-helmet-async';

import {
    buildRegionalUrl,
    getAlternateUrls,
    getCurrentRegion,
    makeAbsoluteUrl,
    serializeJsonLd,
} from './seoConfig';

type NewsSeoProps = {
    page?: number;
};

const DEFAULT_BASE_URL =
    'https://agraristech.by';

const REGIONAL_CONTENT = {
    by: {
        title:
            'Новости сельскохозяйственной техники в Беларуси | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в Беларуси.',

        keywords:
            'новости сельхозтехники Беларусь, рынок сельхозтехники, сельскохозяйственная техника в Беларуси, обзоры сельхозтехники, техника AGRARIS, подержанная сельхозтехника из Европы',
    },

    ru: {
        title:
            'Новости сельскохозяйственной техники в России | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в России.',

        keywords:
            'новости сельхозтехники Россия, рынок сельхозтехники, сельскохозяйственная техника в России, обзоры сельхозтехники, техника AGRARIS, подержанная сельхозтехника из Европы',
    },

    kz: {
        title:
            'Новости сельскохозяйственной техники в Казахстане | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в Казахстане.',

        keywords:
            'новости сельхозтехники Казахстан, рынок сельхозтехники, сельскохозяйственная техника в Казахстане, обзоры сельхозтехники, техника AGRARIS, подержанная сельхозтехника из Европы',
    },
} as const;

type RegionalContentCode =
    keyof typeof REGIONAL_CONTENT;

function createKeywordList(
    value: string,
): string[] {
    return value
        .split(',')
        .map(
            (keyword) =>
                keyword.trim(),
        )
        .filter(Boolean);
}

export default function NewsSeo({
                                    page = 1,
                                }: NewsSeoProps) {
    const region =
        getCurrentRegion();

    const content =
        REGIONAL_CONTENT[
            region.code as RegionalContentCode
            ] || REGIONAL_CONTENT.by;

    const currentPage =
        Number.isFinite(page) &&
        page > 1
            ? Math.floor(page)
            : 1;

    const pageQuery =
        currentPage > 1
            ? `?page=${currentPage}`
            : '';

    const baseUrl =
        region.baseUrl.replace(
            /\/+$/,
            '',
        );

    const baseCanonicalUrl =
        buildRegionalUrl(
            region,
            '/news',
        );

    const canonicalUrl =
        `${baseCanonicalUrl}${pageQuery}`;

    /*
     * Удаляем возможный старый
     * x-default из seoConfig,
     * чтобы не получить дубликат.
     */
    const regionalAlternateUrls =
        getAlternateUrls('/news')
            .filter(
                (alternate) =>
                    alternate.hrefLang !==
                    'x-default',
            )
            .map(
                (alternate) => ({
                    ...alternate,

                    href:
                        `${alternate.href}${pageQuery}`,
                }),
            );

    const alternateUrls = [
        ...regionalAlternateUrls,

        {
            hrefLang:
                'x-default',

            href:
                `${DEFAULT_BASE_URL}/news${pageQuery}`,
        },
    ];

    const baseTitle =
        content.title.replace(
            /\s*\|\s*AGRARIS\s*$/i,
            '',
        );

    const seoTitle =
        currentPage > 1
            ? `${baseTitle} — страница ${currentPage} | AGRARIS`
            : content.title;

    const seoDescription =
        currentPage > 1
            ? `${content.description} Страница ${currentPage}.`
            : content.description;

    const seoKeywords =
        content.keywords;

    const keywordList =
        createKeywordList(
            seoKeywords,
        );

    const socialImageUrl =
        makeAbsoluteUrl(
            region.logoUrl,
            baseUrl,
        );

    const structuredData = {
        '@context':
            'https://schema.org',

        '@type':
            'CollectionPage',

        '@id':
            `${canonicalUrl}#news`,

        name:
        seoTitle,

        description:
        seoDescription,

        keywords:
        keywordList,

        url:
        canonicalUrl,

        inLanguage:
        region.htmlLang,

        isPartOf: {
            '@type':
                'WebSite',

            '@id':
                `${baseUrl}/#website`,

            url:
            baseUrl,

            name:
            region.siteName,
        },

        about: {
            '@type':
                'Thing',

            name:
                'Сельскохозяйственная техника',
        },

        publisher: {
            '@type':
                'Organization',

            '@id':
                `${baseUrl}/#organization`,

            name:
            region.siteName,

            url:
            baseUrl,

            logo: {
                '@type':
                    'ImageObject',

                url:
                socialImageUrl,
            },
        },
    };

    return (
        <Helmet prioritizeSeoTags>
            <html
                lang={
                    region.htmlLang
                }
            />

            <title>
                {seoTitle}
            </title>

            <meta
                name="description"
                content={
                    seoDescription
                }
            />

            <meta
                name="keywords"
                content={
                    seoKeywords
                }
            />

            <meta
                name="robots"
                content="index, follow, max-image-preview:large, max-snippet:-1"
            />

            <link
                rel="canonical"
                href={
                    canonicalUrl
                }
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
                content="website"
            />

            <meta
                property="og:site_name"
                content={
                    region.siteName
                }
            />

            <meta
                property="og:locale"
                content={
                    region.ogLocale
                }
            />

            <meta
                property="og:title"
                content={
                    seoTitle
                }
            />

            <meta
                property="og:description"
                content={
                    seoDescription
                }
            />

            <meta
                property="og:url"
                content={
                    canonicalUrl
                }
            />

            <meta
                property="og:image"
                content={
                    socialImageUrl
                }
            />

            <meta
                property="og:image:alt"
                content="Новости сельскохозяйственной техники AGRARIS"
            />

            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={
                    seoTitle
                }
            />

            <meta
                name="twitter:description"
                content={
                    seoDescription
                }
            />

            <meta
                name="twitter:image"
                content={
                    socialImageUrl
                }
            />

            <meta
                name="twitter:image:alt"
                content="Новости сельскохозяйственной техники AGRARIS"
            />

            <script type="application/ld+json">
                {serializeJsonLd(
                    structuredData,
                )}
            </script>
        </Helmet>
    );
}