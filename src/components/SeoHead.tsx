import { Helmet } from 'react-helmet-async';

type SeoConfig = {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    ogImage: string;
    locale: string;
    siteName: string;
};

function getSeoConfig(hostname: string): SeoConfig {
    const cleanHost = hostname.replace(/^www\./, '');

    if (cleanHost === 'agraristech.by') {
        return {
            title: 'AGRARIS — Сельскохозяйственная техника в Беларуси',
            description:
                'Поставки европейской сельскохозяйственной техники в Беларуси. Надежный партнер для агробизнеса: техника, сервис и поддержка.',
            keywords:
                'сельхозтехника Беларусь, сельскохозяйственная техника Беларусь, аграрная техника Беларусь, европейская техника Беларусь, AGRARIS ',
            canonical: 'https://agraristech.by/',
            ogTitle: 'AGRARIS — Сельхоз техника в Беларуси',
            ogDescription:
                'Европейская сельскохозяйственная техника для агробизнеса в Беларуси.',
            ogUrl: 'https://agraristech.by/',
            ogImage: 'https://agraristech.by/logo.png',
            locale: 'ru_BY',
            siteName: 'AGRARIS',
        };
    }

    if (cleanHost === 'agraris.ru') {
        return {
            title: 'AGRARIS — Сельскохозяйственная техника в России',
            description:
                'Европейская сельскохозяйственная техника в России. Поставка, сервис и сопровождение для аграрного бизнеса.',
            keywords:
                'сельхозтехника Россия, сельскохозяйственная техника Россия, аграрная техника Россия, купить сельхозтехнику Россия, AGRARIS',
            canonical: 'https://agraris.ru/',
            ogTitle: 'AGRARIS — Сельхоз техника в России',
            ogDescription:
                'Поставка европейской сельхоз техники для агробизнеса в России.',
            ogUrl: 'https://agraris.ru/',
            ogImage: 'https://agraris.ru/logo.png',
            locale: 'ru_RU',
            siteName: 'AGRARIS',
        };
    }

    if (cleanHost === 'agraris.tech') {
        return {
            title: 'AGRARIS — Сельскохозяйственная техника в Казахстане',
            description:
                'Поставка европейской сельскохозяйственной техники в Казахстане. Современные решения для агробизнеса и фермерских хозяйств.',
            keywords:
                'сельхозтехника Казахстан, сельскохозяйственная техника Казахстан, аграрная техника Казахстан, европейская техника Казахстан, AGRARIS',
            canonical: 'https://agraris.tech/',
            ogTitle: 'AGRARIS — Сельхоз техника в Казахстане',
            ogDescription:
                'Европейская сельскохозяйственная техника для агробизнеса в Казахстане.',
            ogUrl: 'https://agraris.tech/',
            ogImage: 'https://agraris.tech/logo.png',
            locale: 'ru_KZ',
            siteName: 'AGRARIS',
        };
    }

    return {
        title: 'AGRARIS — Европейская сельскохозяйственная техника',
        description:
            'Поставки европейской сельскохозяйственной техники в Беларуси, России и Казахстане.',
        keywords:
            'сельхозтехника, сельскохозяйственная техника, аграрная техника, европейская техника, AGRARIS',
        canonical: 'https://agraristech.by/',
        ogTitle: 'AGRARIS — Европейская сельскохозяйственная техника',
        ogDescription:
            'Поставки европейской сельскохозяйственной техники в Беларуси, России и Казахстане.',
        ogUrl: 'https://agraristech.by/',
        ogImage: 'https://agraristech.by/logo.png',
        locale: 'ru_RU',
        siteName: 'AGRARIS',
    };
}

export default function SeoHead() {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const seo = getSeoConfig(hostname);

    return (
        <Helmet>
            <html lang="ru" />
            <title>{seo.title}</title>

            <meta name="description" content={seo.description} />
            <meta name="keywords" content={seo.keywords} />
            <meta name="author" content={seo.siteName} />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#7BAE37" />

            <link rel="canonical" href={seo.canonical} />
            <link rel="icon" type="image/png" href="/logo.png" />
            <link rel="apple-touch-icon" href="/logo.png" />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={seo.siteName} />
            <meta property="og:title" content={seo.ogTitle} />
            <meta property="og:description" content={seo.ogDescription} />
            <meta property="og:url" content={seo.ogUrl} />
            <meta property="og:image" content={seo.ogImage} />
            <meta property="og:locale" content={seo.locale} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.ogTitle} />
            <meta name="twitter:description" content={seo.ogDescription} />
            <meta name="twitter:image" content={seo.ogImage} />
        </Helmet>
    );
}