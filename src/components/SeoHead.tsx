import { Helmet } from 'react-helmet-async';

type SeoConfig = {
    title: string;
    description: string;

    canonical: string;

    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    ogImage: string;

    htmlLang: string;
    locale: string;
    siteName: string;
};

function normalizeHostname(hostname: string): string {
    return hostname
        .trim()
        .toLowerCase()
        .replace(/^www\./, '')
        .split(':')[0];
}

function getSeoConfig(hostname: string): SeoConfig {
    const cleanHost = normalizeHostname(hostname);

    if (cleanHost === 'agraristech.by') {
        return {
            title:
                'Сельскохозяйственная техника в Беларуси | AGRARIS',

            description:
                'Продажа новой и б/у сельскохозяйственной техники в Беларуси. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',

            canonical:
                'https://agraristech.by/',

            ogTitle:
                'AGRARIS — сельскохозяйственная техника в Беларуси',

            ogDescription:
                'Европейская сельскохозяйственная техника для агробизнеса в Беларуси.',

            ogUrl:
                'https://agraristech.by/',

            ogImage:
                'https://agraristech.by/logo.png',

            htmlLang:
                'ru-BY',

            locale:
                'ru_BY',

            siteName:
                'AGRARIS',
        };
    }

    if (cleanHost === 'agraris.ru') {
        return {
            title:
                'Сельскохозяйственная техника в России | AGRARIS',

            description:
                'Продажа новой и б/у сельскохозяйственной техники в России. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',

            canonical:
                'https://agraris.ru/',

            ogTitle:
                'AGRARIS — сельскохозяйственная техника в России',

            ogDescription:
                'Европейская сельскохозяйственная техника для агробизнеса в России.',

            ogUrl:
                'https://agraris.ru/',

            ogImage:
                'https://agraris.ru/logo.png',

            htmlLang:
                'ru-RU',

            locale:
                'ru_RU',

            siteName:
                'AGRARIS',
        };
    }

    if (cleanHost === 'agraris.tech') {
        return {
            title:
                'Сельскохозяйственная техника в Казахстане | AGRARIS',

            description:
                'Продажа новой и б/у сельскохозяйственной техники в Казахстане. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',

            canonical:
                'https://agraris.tech/',

            ogTitle:
                'AGRARIS — сельскохозяйственная техника в Казахстане',

            ogDescription:
                'Европейская сельскохозяйственная техника для агробизнеса в Казахстане.',

            ogUrl:
                'https://agraris.tech/',

            ogImage:
                'https://agraris.tech/logo.png',

            htmlLang:
                'ru-KZ',

            locale:
                'ru_KZ',

            siteName:
                'AGRARIS',
        };
    }

    /*
     * Локальная разработка и неизвестный домен.
     * По умолчанию используем белорусскую версию.
     */
    return {
        title:
            'Сельскохозяйственная техника в Беларуси | AGRARIS',

        description:
            'Продажа новой и б/у сельскохозяйственной техники в Беларуси. Картофелеуборочные комбайны, картофелесажалки, приёмные бункеры, запчасти и сервис.',

        canonical:
            'https://agraristech.by/',

        ogTitle:
            'AGRARIS — сельскохозяйственная техника в Беларуси',

        ogDescription:
            'Европейская сельскохозяйственная техника для агробизнеса в Беларуси.',

        ogUrl:
            'https://agraristech.by/',

        ogImage:
            'https://agraristech.by/logo.png',

        htmlLang:
            'ru-BY',

        locale:
            'ru_BY',

        siteName:
            'AGRARIS',
    };
}

export default function SeoHead() {
    const hostname =
        typeof window !== 'undefined'
            ? window.location.hostname
            : '';

    const seo = getSeoConfig(hostname);

    return (
        <Helmet prioritizeSeoTags>
            <html lang={seo.htmlLang} />

            <title>{seo.title}</title>

            <meta
                name="description"
                content={seo.description}
            />

            <meta
                name="author"
                content={seo.siteName}
            />

            <meta
                name="robots"
                content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            />

            <link
                rel="canonical"
                href={seo.canonical}
            />

            {/* Региональные версии главной страницы */}

            <link
                rel="alternate"
                hrefLang="ru-BY"
                href="https://agraristech.by/"
            />

            <link
                rel="alternate"
                hrefLang="ru-RU"
                href="https://agraris.ru/"
            />

            <link
                rel="alternate"
                hrefLang="ru-KZ"
                href="https://agraris.tech/"
            />

            {/* Open Graph */}

            <meta
                property="og:type"
                content="website"
            />

            <meta
                property="og:site_name"
                content={seo.siteName}
            />

            <meta
                property="og:title"
                content={seo.ogTitle}
            />

            <meta
                property="og:description"
                content={seo.ogDescription}
            />

            <meta
                property="og:url"
                content={seo.ogUrl}
            />

            <meta
                property="og:image"
                content={seo.ogImage}
            />

            <meta
                property="og:image:alt"
                content={seo.ogTitle}
            />

            <meta
                property="og:locale"
                content={seo.locale}
            />

            {/* Twitter */}

            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={seo.ogTitle}
            />

            <meta
                name="twitter:description"
                content={seo.ogDescription}
            />

            <meta
                name="twitter:image"
                content={seo.ogImage}
            />
        </Helmet>
    );
}