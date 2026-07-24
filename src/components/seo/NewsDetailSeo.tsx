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

const DEFAULT_BASE_URL =
    'https://agraristech.by';

export type NewsDetailSeoArticle = {
    title: string;
    slug: string;

    metaTitle?: string;
    metaDescription?: string;

    excerpt?: string;

    /*
     * Единственное поле content.
     * В нём хранится Markdown.
     */
    content?: string;

    image?: string;
    imageAlt?: string;

    publishedAt?: string;
    updatedAt?: string;

    authorName?: string;
    categoryName?: string;

    searchKeywords?: string;

    schemaType?:
        | 'Article'
        | 'NewsArticle'
        | 'BlogPosting';
};

type NewsDetailSeoProps = {
    article: NewsDetailSeoArticle;
};

function stripMarkdown(
    value: string,
): string {
    return value
        /*
         * Многострочные блоки кода.
         */
        .replace(
            /```[\s\S]*?```/g,
            ' ',
        )

        /*
         * Изображения.
         * Оставляем alt.
         */
        .replace(
            /!\[([^\]]*)]\([^)]*\)/g,
            '$1',
        )

        /*
         * Ссылки.
         * Оставляем текст ссылки.
         */
        .replace(
            /\[([^\]]+)]\([^)]*\)/g,
            '$1',
        )

        /*
         * Заголовки.
         */
        .replace(
            /^\s{0,3}#{1,6}\s+/gm,
            '',
        )

        /*
         * Цитаты.
         */
        .replace(
            /^\s*>\s?/gm,
            '',
        )

        /*
         * Маркированные списки.
         */
        .replace(
            /^\s*[-*+]\s+/gm,
            '',
        )

        /*
         * Нумерованные списки.
         */
        .replace(
            /^\s*\d+[.)]\s+/gm,
            '',
        )

        /*
         * Inline code.
         */
        .replace(
            /`([^`]+)`/g,
            '$1',
        )

        /*
         * Bold, italic, strikethrough.
         */
        .replace(
            /[*_~]/g,
            '',
        )

        /*
         * Нормализуем пробелы.
         */
        .replace(
            /\n+/g,
            ' ',
        )
        .replace(
            /\s+/g,
            ' ',
        )
        .trim();
}

function createKeywordList(
    value?: string,
): string[] {
    if (!value) {
        return [];
    }

    return value
        .split(',')
        .map(
            (keyword) =>
                keyword.trim(),
        )
        .filter(Boolean);
}

export default function NewsDetailSeo({
                                          article,
                                      }: NewsDetailSeoProps) {
    const region =
        getCurrentRegion();

    const baseUrl =
        region.baseUrl.replace(
            /\/+$/,
            '',
        );

    const pathname =
        `/news/${article.slug}`;

    const canonicalUrl =
        buildRegionalUrl(
            region,
            pathname,
        );

    /*
     * Региональные версии статьи.
     */
    const regionalAlternateUrls =
        getAlternateUrls(pathname)
            .filter(
                (alternate) =>
                    alternate.hrefLang !==
                    'x-default',
            );

    /*
     * Беларусь используется
     * как версия по умолчанию.
     */
    const alternateUrls = [
        ...regionalAlternateUrls,

        {
            hrefLang:
                'x-default',

            href:
                `${DEFAULT_BASE_URL}${pathname}`,
        },
    ];

    const logoUrl =
        makeAbsoluteUrl(
            region.logoUrl,
            baseUrl,
        );

    const descriptionSource =
        article.metaDescription ||
        article.excerpt ||
        article.content ||
        '';

    const plainDescription =
        stripHtml(
            stripMarkdown(
                descriptionSource,
            ),
        );

    const seoTitle =
        article.metaTitle?.trim() ||
        `${article.title} | AGRARIS`;

    const seoDescription =
        truncateText(
            plainDescription ||
            `${article.title}. Новости, обзоры и материалы о сельскохозяйственной технике от AGRARIS.`,
        );

    const imageUrl =
        article.image
            ? makeAbsoluteUrl(
                article.image,
                baseUrl,
            )
            : logoUrl;

    const imageAlt =
        article.imageAlt?.trim() ||
        article.title;

    const authorName =
        article.authorName?.trim() ||
        region.siteName;

    const keywordList =
        createKeywordList(
            article.searchKeywords,
        );

    const seoKeywords =
        keywordList.join(', ');

    const structuredData = {
        '@context':
            'https://schema.org',

        '@type':
            article.schemaType ||
            'NewsArticle',

        '@id':
            `${canonicalUrl}#article`,

        headline:
        article.title,

        description:
        seoDescription,

        url:
        canonicalUrl,

        mainEntityOfPage: {
            '@type':
                'WebPage',

            '@id':
            canonicalUrl,
        },

        image: [
            imageUrl,
        ],

        thumbnailUrl:
        imageUrl,

        inLanguage:
        region.htmlLang,

        isAccessibleForFree:
            true,

        ...(article.publishedAt
            ? {
                datePublished:
                article.publishedAt,
            }
            : {}),

        ...(
            article.updatedAt ||
            article.publishedAt
                ? {
                    dateModified:
                        article.updatedAt ||
                        article.publishedAt,
                }
                : {}
        ),

        ...(article.categoryName
            ? {
                articleSection:
                article.categoryName,
            }
            : {}),

        ...(keywordList.length > 0
            ? {
                keywords:
                keywordList,
            }
            : {}),

        author: {
            '@type':
                'Organization',

            '@id':
                `${baseUrl}/#organization`,

            name:
            authorName,

            url:
            baseUrl,
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
                logoUrl,
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

            {seoKeywords && (
                <meta
                    name="keywords"
                    content={
                        seoKeywords
                    }
                />
            )}

            <meta
                name="author"
                content={
                    authorName
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
                content="article"
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
                    imageUrl
                }
            />

            <meta
                property="og:image:alt"
                content={
                    imageAlt
                }
            />

            {article.categoryName && (
                <meta
                    property="article:section"
                    content={
                        article.categoryName
                    }
                />
            )}

            {keywordList.map(
                (
                    keyword,
                    index,
                ) => (
                    <meta
                        key={
                            `${keyword}-${index}`
                        }
                        property="article:tag"
                        content={
                            keyword
                        }
                    />
                ),
            )}

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
                    imageUrl
                }
            />

            <meta
                name="twitter:image:alt"
                content={
                    imageAlt
                }
            />

            <script type="application/ld+json">
                {serializeJsonLd(
                    structuredData,
                )}
            </script>
        </Helmet>
    );
}