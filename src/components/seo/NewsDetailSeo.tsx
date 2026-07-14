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

export type NewsDetailSeoArticle = {
    title: string;
    slug: string;

    description?: string;
    shortDescription?: string;
    excerpt?: string;
    content?: string;

    image?: string;

    publishedAt?: string;
    updatedAt?: string;

    authorName?: string;
    categoryName?: string;
};

type NewsDetailSeoProps = {
    article: NewsDetailSeoArticle;
};

export default function NewsDetailSeo({
                                          article,
                                      }: NewsDetailSeoProps) {
    const region = getCurrentRegion();

    const pathname =
        `/news/${article.slug}`;

    const canonicalUrl = buildRegionalUrl(
        region,
        pathname,
    );

    const alternateUrls =
        getAlternateUrls(pathname);

    const plainDescription = stripHtml(
        article.shortDescription ||
        article.excerpt ||
        article.description ||
        article.content ||
        '',
    );

    const seoTitle =
        `${article.title} | AGRARIS`;

    const seoDescription = truncateText(
        plainDescription ||
        `${article.title}. Новости и материалы о сельскохозяйственной технике от AGRARIS.`,
    );

    const imageUrl = article.image
        ? makeAbsoluteUrl(
            article.image,
            region.baseUrl,
        )
        : region.logoUrl;

    const structuredData = {
        '@context': 'https://schema.org',

        '@type': 'NewsArticle',

        '@id': `${canonicalUrl}#article`,

        headline: article.title,
        description: seoDescription,

        url: canonicalUrl,

        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
        },

        image: [imageUrl],

        inLanguage: region.htmlLang,

        ...(article.publishedAt
            ? {
                datePublished:
                article.publishedAt,
            }
            : {}),

        ...(article.updatedAt
            ? {
                dateModified:
                article.updatedAt,
            }
            : {}),

        ...(article.categoryName
            ? {
                articleSection:
                article.categoryName,
            }
            : {}),

        author: {
            '@type': 'Organization',

            name:
                article.authorName ||
                region.siteName,

            url: region.baseUrl,
        },

        publisher: {
            '@type': 'Organization',

            '@id':
                `${region.baseUrl}` +
                '/#organization',

            name: region.siteName,
            url: region.baseUrl,

            logo: {
                '@type': 'ImageObject',
                url: region.logoUrl,
            },
        },
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
                content="index, follow, max-image-preview:large, max-snippet:-1"
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
                content="article"
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

            <meta
                property="og:image"
                content={imageUrl}
            />

            <meta
                property="og:image:alt"
                content={article.title}
            />

            {article.publishedAt && (
                <meta
                    property="article:published_time"
                    content={
                        article.publishedAt
                    }
                />
            )}

            {article.updatedAt && (
                <meta
                    property="article:modified_time"
                    content={
                        article.updatedAt
                    }
                />
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

            <meta
                name="twitter:image"
                content={imageUrl}
            />

            <script type="application/ld+json">
                {serializeJsonLd(
                    structuredData,
                )}
            </script>
        </Helmet>
    );
}