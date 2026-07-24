import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    useParams,
} from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Newspaper,
    UserRound,
} from 'lucide-react';

import {
    BlocksRenderer,
    type BlocksContent,
} from '@strapi/blocks-react-renderer';

import {
    getNewsArticleBySlug,
    getRelatedNews,
} from '../services/strapi';

import NewsDetailSeo from '../components/seo/NewsDetailSeo';
import {AppPageLoader} from "../components/AppPageLoader";


const STRAPI_ORIGIN =
    'https://cozy-action-02025ea19f.strapiapp.com';

const FALLBACK_IMAGE =
    '/images/placeholder-equipment.png';

type RawNewsArticle = {
    id: number;
    documentId?: string;

    title?: string;
    slug?: string;

    excerpt?: string;
    content?: string | null;

    category?: string;

    publishedDate?: string | null;
    publishedAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;

    authorName?: string;

    metaTitle?: string | null;
    metaDescription?: string | null;
    searchKeywords?: string | null;

    cover?: {
        url?: string | null;
        alternativeText?: string | null;
    } | null;
};

type NewsArticle = {
    id: number;
    documentId: string;

    title: string;
    slug: string;

    excerpt: string;
    content?: string | null;

    category: string;

    publishedDate: string | null;
    updatedAt: string | null;

    authorName: string;

    metaTitle: string | null;
    metaDescription: string | null;
    searchKeywords: string | null;

    image: string;
    imageAlt: string;
};

type RelatedNewsItem = {
    id: number;
    documentId: string;

    title: string;
    slug: string;

    category: string;
    publishedDate: string | null;

    image: string;
    imageAlt: string;
};

const CATEGORY_LABELS: Record<string, string> = {
    company_news: 'Новости рынка и компании',
    equipment_reviews: 'Обзоры техники',
    technologies: 'Технологии',
    events: 'Выставки и события',
    tips: 'Советы аграриям',
};

function getMediaUrl(
    url?: string | null,
): string {
    if (!url) {
        return '';
    }

    if (
        url.startsWith('http://') ||
        url.startsWith('https://')
    ) {
        return url;
    }

    return `${STRAPI_ORIGIN}${
        url.startsWith('/') ? '' : '/'
    }${url}`;
}

function getCategoryLabel(
    category?: string,
): string {
    if (!category) {
        return 'Новости AGRARIS';
    }

    return (
        CATEGORY_LABELS[category] ||
        category
    );
}

function formatNewsDate(
    value?: string | null,
): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat(
        'ru-RU',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        },
    ).format(date);
}

function mapNewsArticle(
    item: RawNewsArticle,
): NewsArticle {
    const title =
        item.title?.trim() ||
        'Новость AGRARIS';

    return {
        id: item.id,

        documentId:
            item.documentId ||
            String(item.id),

        title,

        slug:
            item.slug ||
            String(item.id),

        excerpt:
            item.excerpt?.trim() || '',

        content:
            typeof item.content === 'string'
                ? item.content.trim()
                : '',

        category:
            item.category || '',

        publishedDate:
            item.publishedDate ||
            item.publishedAt ||
            item.createdAt ||
            null,

        updatedAt:
            item.updatedAt || null,

        authorName:
            item.authorName?.trim() ||
            'AGRARIS',

        metaTitle:
            item.metaTitle ?? null,

        metaDescription:
            item.metaDescription ?? null,

        searchKeywords:
            item.searchKeywords?.trim() ||
            null,

        image:
            getMediaUrl(
                item.cover?.url,
            ) || FALLBACK_IMAGE,

        imageAlt:
            item.cover
                ?.alternativeText
                ?.trim() ||
            title,
    };
}

function mapRelatedNews(
    item: RawNewsArticle,
): RelatedNewsItem {
    const title =
        item.title?.trim() ||
        'Новость AGRARIS';

    return {
        id: item.id,

        documentId:
            item.documentId ||
            String(item.id),

        title,

        slug:
            item.slug ||
            String(item.id),

        category:
            item.category || '',

        publishedDate:
            item.publishedDate ||
            item.publishedAt ||
            item.createdAt ||
            null,

        image:
            getMediaUrl(
                item.cover?.url,
            ) || FALLBACK_IMAGE,

        imageAlt:
            item.cover
                ?.alternativeText
                ?.trim() ||
            title,
    };
}

export function NewsDetailPage() {
    const { slug } = useParams<{
        slug: string;
    }>();

    const [article, setArticle] =
        useState<NewsArticle | null>(
            null,
        );

    const [
        relatedNews,
        setRelatedNews,
    ] = useState<RelatedNewsItem[]>(
        [],
    );

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadArticle() {
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const rawArticle =
                    await getNewsArticleBySlug(
                        slug,
                    );

                if (cancelled) {
                    return;
                }

                if (!rawArticle) {
                    setArticle(null);
                    setRelatedNews([]);
                    return;
                }

                const mappedArticle =
                    mapNewsArticle(
                        rawArticle,
                    );

                setArticle(mappedArticle);

                if (!mappedArticle.category) {
                    setRelatedNews([]);
                    return;
                }

                const relatedResult =
                    await getRelatedNews({
                        category:
                        mappedArticle.category,

                        excludedSlug:
                        mappedArticle.slug,

                        limit: 3,
                    });

                if (cancelled) {
                    return;
                }

                const relatedItems =
                    Array.isArray(
                        relatedResult,
                    )
                        ? relatedResult
                        : [];

                setRelatedNews(
                    relatedItems.map(
                        (
                            item: RawNewsArticle,
                        ) =>
                            mapRelatedNews(
                                item,
                            ),
                    ),
                );
            } catch (error) {
                console.error(
                    'Failed to load news article:',
                    error,
                );

                if (!cancelled) {
                    setArticle(null);
                    setRelatedNews([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadArticle().catch(
            console.error,
        );

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (loading) {
        return <AppPageLoader />;
    }

    if (!article) {
        return (
            <>
                <Helmet>
                    <title>
                        Статья не найдена | AGRARIS
                    </title>

                    <meta
                        name="robots"
                        content="noindex, follow"
                    />
                </Helmet>

                <main className="news-detail-not-found">
                    <Newspaper />

                    <h1>
                        Статья не найдена
                    </h1>

                    <p>
                        Возможно, материал был
                        удалён или адрес указан
                        неправильно.
                    </p>

                    <Link
                        to="/news"
                        className="news-detail-not-found__button"
                    >
                        <ArrowLeft />

                        Вернуться к новостям
                    </Link>
                </main>
            </>
        );
    }

    return (
        <>
            <NewsDetailSeo
                article={{
                    title:
                    article.title,

                    slug:
                    article.slug,

                    metaTitle:
                        article.metaTitle ||
                        undefined,

                    metaDescription:
                        article.metaDescription ||
                        undefined,

                    excerpt:
                    article.excerpt,

                    content:
                    article.content,

                    image:
                    article.image,

                    imageAlt:
                    article.imageAlt,

                    publishedAt:
                        article.publishedDate ||
                        undefined,

                    updatedAt:
                        article.updatedAt ||
                        undefined,

                    authorName:
                    article.authorName,

                    categoryName:
                        getCategoryLabel(
                            article.category,
                        ),

                    searchKeywords:
                        article.searchKeywords ||
                        undefined,

                    schemaType:
                        article.category ===
                        'company_news' ||
                        article.category ===
                        'events'
                            ? 'NewsArticle'
                            : 'Article',
                }}
            />

            <main className="news-detail-page">
                <section className="news-detail-hero">
                    <div className="news-detail-shell">
                        <Link
                            to="/news"
                            className="news-detail-back"
                        >
                            <ArrowLeft />

                            Назад к новостям
                        </Link>

                        <header className="news-detail-header">
                            <div className="news-detail-meta">
                                <span className="news-detail-category">
                                    {getCategoryLabel(
                                        article.category,
                                    )}
                                </span>

                                {article.publishedDate && (
                                    <time
                                        dateTime={
                                            article.publishedDate
                                        }
                                        className="news-detail-meta-item"
                                    >
                                        <CalendarDays />

                                        {formatNewsDate(
                                            article.publishedDate,
                                        )}
                                    </time>
                                )}

                                <span className="news-detail-meta-item">
                                    <UserRound />

                                    {article.authorName}
                                </span>
                            </div>

                            <h1 className="news-detail-title">
                                {article.title}
                            </h1>

                            {article.excerpt && (
                                <p className="news-detail-excerpt">
                                    {article.excerpt}
                                </p>
                            )}
                        </header>

                        <div className="news-detail-cover">
                            <img
                                src={article.image}
                                alt={article.imageAlt}
                            />
                        </div>
                    </div>
                </section>

                <section className="news-detail-content-section">
                    <div className="news-detail-content-wrap">
                        <article className="news-article-card">
                            <div className="news-article-content">
                                {article.content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h2: ({children}) => (
                                                <h2 className="news-article-h2">
                                                    {children}
                                                </h2>
                                            ),

                                            h3: ({children}) => (
                                                <h3 className="news-article-h3">
                                                    {children}
                                                </h3>
                                            ),

                                            h4: ({children}) => (
                                                <h4 className="news-article-h4">
                                                    {children}
                                                </h4>
                                            ),

                                            p: ({children}) => (
                                                <p className="news-article-paragraph">
                                                    {children}
                                                </p>
                                            ),

                                            ul: ({children}) => (
                                                <ul className="news-article-list news-article-list--unordered">
                                                    {children}
                                                </ul>
                                            ),

                                            ol: ({children}) => (
                                                <ol className="news-article-list news-article-list--ordered">
                                                    {children}
                                                </ol>
                                            ),

                                            li: ({children}) => (
                                                <li>{children}</li>
                                            ),

                                            blockquote: ({children}) => (
                                                <blockquote className="news-article-quote">
                                                    {children}
                                                </blockquote>
                                            ),

                                            strong: ({children}) => (
                                                <strong className="news-article-bold">
                                                    {children}
                                                </strong>
                                            ),

                                            a: ({
                                                    children,
                                                    href,
                                                }) => {
                                                const url = href || '#';

                                                const isExternal =
                                                    url.startsWith('http://') ||
                                                    url.startsWith('https://');

                                                return (
                                                    <a
                                                        href={url}
                                                        className="news-article-link"
                                                        target={
                                                            isExternal
                                                                ? '_blank'
                                                                : undefined
                                                        }
                                                        rel={
                                                            isExternal
                                                                ? 'noopener noreferrer'
                                                                : undefined
                                                        }
                                                    >
                                                        {children}
                                                    </a>
                                                );
                                            },
                                        }}
                                    >
                                        {article.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="news-article-paragraph">
                                        {article.excerpt}
                                    </p>
                                )}
                            </div>
                        </article>

                        <aside className="news-detail-cta">
                            <div className="news-detail-cta__content">
                                <h2>
                                    Нужна техника для вашего хозяйства?
                                </h2>

                                <p>
                                    Специалисты AGRARIS
                                    помогут подобрать
                                    оборудование, рассчитать
                                    стоимость и организовать
                                    поставку.
                                </p>
                            </div>

                            <div className="news-detail-cta__actions">
                                <Link
                                    to="/catalog"
                                    className="news-detail-cta__primary"
                                >
                                    Смотреть каталог
                                </Link>

                                <Link
                                    to="/contact"
                                    className="news-detail-cta__secondary"
                                >
                                    Получить консультацию
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                {relatedNews.length > 0 && (
                    <section className="news-related-section">
                        <div className="news-related-container">
                            <div className="news-related-header">
                                <div>
                                    <span>
                                        Читайте также
                                    </span>

                                    <h2>
                                        Похожие статьи
                                    </h2>
                                </div>

                                <Link
                                    to="/news"
                                    className="news-related-all"
                                >
                                    Все новости

                                    <ArrowRight/>
                                </Link>
                            </div>

                            <div className="news-related-grid">
                                {relatedNews.map(
                                    (news) => (
                                        <Link
                                            to={`/news/${news.slug}`}
                                            key={
                                                news.documentId
                                            }
                                            className="news-related-card"
                                        >
                                            <div className="news-related-card__image">
                                            <img
                                                    src={
                                                        news.image
                                                    }
                                                    alt={
                                                        news.imageAlt
                                                    }
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="news-related-card__body">
                                                <div className="news-related-card__meta">
                                                    <span>
                                                        {getCategoryLabel(
                                                            news.category,
                                                        )}
                                                    </span>

                                                    {news.publishedDate && (
                                                        <time
                                                            dateTime={
                                                                news.publishedDate
                                                            }
                                                        >
                                                            {formatNewsDate(
                                                                news.publishedDate,
                                                            )}
                                                        </time>
                                                    )}
                                                </div>

                                                <h3>
                                                    {
                                                        news.title
                                                    }
                                                </h3>

                                                <span className="news-related-card__more">
                                                    Читать статью

                                                    <ArrowRight />
                                                </span>
                                            </div>
                                        </Link>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}