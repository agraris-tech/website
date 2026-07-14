import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import {
    buildRegionalUrl,
    getAlternateUrls,
    getCurrentRegion,
    serializeJsonLd,
} from './seoConfig';

const REGIONAL_CONTENT = {
    by: {
        title:
            'Каталог сельскохозяйственной техники в Беларуси | AGRARIS',

        description:
            'Каталог новой и б/у сельскохозяйственной техники в Беларуси. Комбайны, картофелесажалки, приёмные бункеры и оборудование европейских производителей.',
    },

    ru: {
        title:
            'Каталог сельскохозяйственной техники в России | AGRARIS',

        description:
            'Каталог новой и б/у сельскохозяйственной техники в России. Комбайны, картофелесажалки, приёмные бункеры и оборудование европейских производителей.',
    },

    kz: {
        title:
            'Каталог сельскохозяйственной техники в Казахстане | AGRARIS',

        description:
            'Каталог новой и б/у сельскохозяйственной техники в Казахстане. Комбайны, картофелесажалки, приёмные бункеры и оборудование европейских производителей.',
    },
};

export default function CatalogSeo() {
    const location = useLocation();
    const region = getCurrentRegion();

    const content =
        REGIONAL_CONTENT[region.code];

    const canonicalUrl = buildRegionalUrl(
        region,
        '/catalog',
    );

    const alternateUrls =
        getAlternateUrls('/catalog');

    const hasFilters =
        location.search.length > 1;

    const robots = hasFilters
        ? 'noindex, follow, max-image-preview:large'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const structuredData = {
        '@context': 'https://schema.org',

        '@type': 'CollectionPage',

        '@id': `${canonicalUrl}#collection`,

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
                content={robots}
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