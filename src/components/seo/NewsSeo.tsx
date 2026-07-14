import { Helmet } from 'react-helmet-async';

import {
    buildRegionalUrl,
    getAlternateUrls,
    getCurrentRegion,
    serializeJsonLd,
} from './seoConfig';

const REGIONAL_CONTENT = {
    by: {
        title:
            'Новости сельскохозяйственной техники в Беларуси | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в Беларуси.',
    },

    ru: {
        title:
            'Новости сельскохозяйственной техники в России | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в России.',
    },

    kz: {
        title:
            'Новости сельскохозяйственной техники в Казахстане | AGRARIS',

        description:
            'Новости AGRARIS, обзоры сельскохозяйственной техники, новинки оборудования и события аграрной отрасли в Казахстане.',
    },
};

export default function NewsSeo() {
    const region = getCurrentRegion();
    const content =
        REGIONAL_CONTENT[region.code];

    const canonicalUrl = buildRegionalUrl(
        region,
        '/news',
    );

    const alternateUrls =
        getAlternateUrls('/news');

    const structuredData = {
        '@context': 'https://schema.org',

        '@type': 'CollectionPage',

        '@id': `${canonicalUrl}#news`,

        name: content.title,
        description: content.description,

        url: canonicalUrl,
        inLanguage: region.htmlLang,

        isPartOf: {
            '@type': 'WebSite',

            '@id':
                `${region.baseUrl}` +
                '/#website',
        },
    };

    return (
        <Helmet prioritizeSeoTags>
            <html lang={region.htmlLang}/>

            <title>{content.title}</title>

            <meta
                name="description"
                content={content.description}
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
                content="website"
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
                content={content.title}
            />

            <meta
                property="og:description"
                content={content.description}
            />

            <meta
                property="og:url"
                content={canonicalUrl}
            />

            <meta
                property="og:image"
                content={region.logoUrl}
            />

            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={content.title}
            />

            <meta
                name="twitter:description"
                content={content.description}
            />

            <meta
                name="twitter:image"
                content={region.logoUrl}
            />

            <script type="application/ld+json">
                {serializeJsonLd(
                    structuredData,
                )}
            </script>
        </Helmet>
    );
}