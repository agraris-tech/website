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
            'О компании AGRARIS — сельхозтехника в Беларуси',

        description:
            'AGRARIS поставляет новую и б/у сельскохозяйственную технику европейских производителей в Беларусь. Подбор оборудования, поставка, сервис и поддержка.',
    },

    ru: {
        title:
            'О компании AGRARIS — сельхозтехника в России',

        description:
            'AGRARIS поставляет новую и б/у сельскохозяйственную технику европейских производителей в Россию. Подбор оборудования, поставка, сервис и поддержка.',
    },

    kz: {
        title:
            'О компании AGRARIS — сельхозтехника в Казахстане',

        description:
            'AGRARIS поставляет новую и б/у сельскохозяйственную технику европейских производителей в Казахстан. Подбор оборудования, поставка, сервис и поддержка.',
    },
};

export default function AboutSeo() {
    const region = getCurrentRegion();
    const content =
        REGIONAL_CONTENT[region.code];

    const canonicalUrl = buildRegionalUrl(
        region,
        '/about',
    );

    const alternateUrls =
        getAlternateUrls('/about');

    const structuredData = {
        '@context': 'https://schema.org',

        '@type': 'AboutPage',

        '@id': `${canonicalUrl}#about`,

        name: content.title,
        description: content.description,

        url: canonicalUrl,
        inLanguage: region.htmlLang,

        about: {
            '@type': 'Organization',
            '@id':
                `${region.baseUrl}` +
                '/#organization',

            name: region.siteName,
            url: region.baseUrl,
            logo: region.logoUrl,

            areaServed: {
                '@type': 'Country',
                name: region.countryName,
            },
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