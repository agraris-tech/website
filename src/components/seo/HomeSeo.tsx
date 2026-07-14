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
            'Сельскохозяйственная техника в Беларуси | AGRARIS',

        description:
            'Продажа новой и б/у сельскохозяйственной техники в Беларуси. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',
    },

    ru: {
        title:
            'Сельскохозяйственная техника в России | AGRARIS',

        description:
            'Продажа новой и б/у сельскохозяйственной техники в России. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',
    },

    kz: {
        title:
            'Сельскохозяйственная техника в Казахстане | AGRARIS',

        description:
            'Продажа новой и б/у сельскохозяйственной техники в Казахстане. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',
    },
};

export default function HomeSeo() {
    const region = getCurrentRegion();
    const content =
        REGIONAL_CONTENT[region.code];

    const canonicalUrl = buildRegionalUrl(
        region,
        '/',
    );

    const alternateUrls =
        getAlternateUrls('/');

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${region.baseUrl}/#organization`,

                name: region.siteName,
                url: canonicalUrl,
                logo: region.logoUrl,

                areaServed: {
                    '@type': 'Country',
                    name: region.countryName,
                },
            },

            {
                '@type': 'WebSite',
                '@id': `${region.baseUrl}/#website`,

                name: region.siteName,
                url: canonicalUrl,
                inLanguage: region.htmlLang,

                publisher: {
                    '@id':
                        `${region.baseUrl}` +
                        '/#organization',
                },
            },

            {
                '@type': 'WebPage',
                '@id': `${canonicalUrl}#webpage`,

                name: content.title,
                description:
                content.description,

                url: canonicalUrl,
                inLanguage: region.htmlLang,

                isPartOf: {
                    '@id':
                        `${region.baseUrl}` +
                        '/#website',
                },
            },
        ],
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
                property="og:image:alt"
                content={region.siteName}
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