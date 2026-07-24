import {
    type CSSProperties,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
    useSearchParams,
} from 'react-router-dom';

import {
    ArrowRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Newspaper,
} from 'lucide-react';

import { AppPageLoader } from '../components/AppPageLoader';
import {Button} from '../components/ui/button';
import {getNewsArticles} from '../services/strapi';
import NewsSeo from '../components/seo/NewsSeo';

const STRAPI_ORIGIN = 'https://cozy-action-02025ea19f.strapiapp.com';
const FALLBACK_IMAGE = '/images/placeholder-equipment.png';

type RawNewsItem = {
    id: number;
    documentId?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    category?: string;
    featured?: boolean;
    featuredOrder?: number;
    publishedDate?: string | null;
    publishedAt?: string | null;
    createdAt?: string | null;
    cover?: {
        url?: string | null;
        alternativeText?: string | null;
    } | null;
};

type NewsListItem = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    featured: boolean;
    featuredOrder: number;
    publishedDate: string | null;
    image: string;
    imageAlt: string;
};

type NewsPagination = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};

const CATEGORY_LABELS: Record<string, string> = {
    company_news: 'Новости рынка и компании',
    equipment_reviews: 'Обзоры техники',
    technologies: 'Технологии',
    events: 'Выставки и события',
    tips: 'Советы аграриям',
};

function getMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${STRAPI_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

function getCategoryLabel(category?: string): string {
    if (!category) return 'Новости AGRARIS';
    return CATEGORY_LABELS[category] || category;
}

function formatNewsDate(value?: string | null): string {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function clampLines(lines: number): CSSProperties {
    return {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
    };
}

function mapNewsItem(item: RawNewsItem): NewsListItem {
    const title = item.title?.trim() || 'Новость AGRARIS';

    return {
        id: item.id,
        documentId: item.documentId || String(item.id),
        title,
        slug: item.slug || String(item.id),
        excerpt: item.excerpt?.trim() || '',
        category: item.category || '',
        featured: item.featured === true,
        featuredOrder: Number(item.featuredOrder || 0),
        publishedDate: item.publishedDate || item.publishedAt || item.createdAt || null,
        image: getMediaUrl(item.cover?.url) || FALLBACK_IMAGE,
        imageAlt: item.cover?.alternativeText?.trim() || title,
    };
}

function NewsCard({
                      news,
                      featured = false,
                  }: {
    news: NewsListItem;
    featured?: boolean;
}) {
    return (
        <Link
            to={`/news/${news.slug}`}
            className="news-card-link"
        >
            <article
                className={
                    featured
                        ? 'news-card news-card--featured'
                        : 'news-card'
                }
            >
                <div className="news-card-image">
                    <img
                        src={news.image}
                        alt={news.imageAlt}
                        loading="lazy"
                    />
                </div>

                <div className="news-card-body">
                    <div className="news-card-meta">
                        <span className="news-card-category">
                            {getCategoryLabel(
                                news.category,
                            )}
                        </span>

                        {news.publishedDate && (
                            <time
                                dateTime={
                                    news.publishedDate
                                }
                                className="news-card-date"
                            >
                                <CalendarDays />

                                {formatNewsDate(
                                    news.publishedDate,
                                )}
                            </time>
                        )}
                    </div>

                    <h2 className="news-card-title">
                        {news.title}
                    </h2>

                    {news.excerpt && (
                        <p className="news-card-excerpt">
                            {news.excerpt}
                        </p>
                    )}

                    <span className="news-card-more">
                        Читать далее

                        <ArrowRight />
                    </span>
                </div>
            </article>
        </Link>
    );
}

export function NewsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPage = Number.parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const [news, setNews] = useState<NewsListItem[]>([]);
    const [pagination, setPagination] = useState<NewsPagination>({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadNews() {
            try {
                setLoading(true);
                setError('');

                const result = await getNewsArticles({
                    page,
                    pageSize: 10,
                });

                if (cancelled) return;

                const items = Array.isArray(result.data) ? result.data : [];

                const mappedNews = items.map((item: RawNewsItem) => mapNewsItem(item));

                const responsePagination = result.meta?.pagination || {
                    page,
                    pageSize: 10,
                    pageCount: 1,
                    total: mappedNews.length,
                };

                const pageCount = Math.max(1, Number(responsePagination.pageCount || 1));

                if (page > pageCount) {
                    setSearchParams(
                        pageCount <= 1 ? {} : {page: String(pageCount)},
                        {replace: true},
                    );
                    return;
                }

                setNews(mappedNews);
                setPagination({
                    page: Number(responsePagination.page) || page,
                    pageSize: Number(responsePagination.pageSize) || 10,
                    pageCount,
                    total: Number(responsePagination.total) || 0,
                });
            } catch (loadError) {
                console.error('Failed to load news:', loadError);

                if (!cancelled) {
                    setNews([]);
                    setError('Не удалось загрузить новости. Попробуйте обновить страницу.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadNews().catch(console.error);

        return () => {
            cancelled = true;
        };
    }, [page, setSearchParams]);

    const orderedNews = useMemo(() => {
        const manuallyFeatured = [...news]
            .filter((item) => item.featured)
            .sort((a, b) => a.featuredOrder - b.featuredOrder);

        const rest = news.filter(
            (item) =>
                !manuallyFeatured.some(
                    (featuredItem) => featuredItem.documentId === item.documentId,
                ),
        );

        return [...manuallyFeatured, ...rest];
    }, [news]);

    // Первые 2 новости крупные только на первой странице
    const featuredNews = useMemo(() => {
        if (page !== 1) return [];
        return orderedNews.slice(0, 2);
    }, [orderedNews, page]);

    // Остальные ниже сеткой
    const regularNews = useMemo(() => {
        if (page !== 1) return orderedNews;
        return orderedNews.slice(2);
    }, [orderedNews, page]);

    const pageNumbers = useMemo(() => {
        const start = Math.max(1, page - 2);
        const end = Math.min(pagination.pageCount, page + 2);

        return Array.from(
            {length: end - start + 1},
            (_, index) => start + index,
        );
    }, [page, pagination.pageCount]);

    function changePage(nextPage: number) {
        if (nextPage < 1 || nextPage > pagination.pageCount) return;

        if (nextPage === 1) {
            setSearchParams({});
        } else {
            setSearchParams({page: String(nextPage)});
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    if (loading) {
        return <AppPageLoader/>;
    }

    return (
        <>
            <NewsSeo page={page} />

            <main
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#f7f8fa',
                }}
            >
                <section
                    style={{
                        padding: '64px 0',
                        color: '#ffffff',
                        background:
                            'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.14), transparent 35%), linear-gradient(135deg, #14532d 0%, #15803d 55%, #166534 100%)',
                    }}
                >
                    <div className="container mx-auto px-4">
                        <div style={{maxWidth: '760px'}}>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '20px',
                                    padding: '8px 16px',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.12)',
                                    fontSize: '14px',
                                }}
                            >
                                <Newspaper className="h-4 w-4"/>
                                Новости AGRARIS
                            </div>

                            <h1
                                style={{
                                    marginBottom: '20px',
                                    color: '#ffffff',
                                    fontSize: 'clamp(38px, 5vw, 58px)',
                                    lineHeight: 1.1,
                                    fontWeight: 500,
                                }}
                            >
                                Новости и статьи
                            </h1>

                            <p
                                style={{
                                    maxWidth: '680px',
                                    margin: 0,
                                    color: '#dcfce7',
                                    fontSize: 'clamp(17px, 2vw, 21px)',
                                    lineHeight: 1.65,
                                }}
                            >
                                Обзоры техники, события аграрной отрасли, выставки и
                                практические материалы для сельхозпроизводителей.
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{padding: '56px 0 72px'}}>
                    <div
                        className="container mx-auto px-4"
                        style={{maxWidth: '1220px'}}
                    >
                        {error ? (
                            <div
                                style={{
                                    padding: '42px 24px',
                                    border: '1px solid #fecaca',
                                    borderRadius: '20px',
                                    backgroundColor: '#fef2f2',
                                    color: '#b91c1c',
                                    textAlign: 'center',
                                }}
                            >
                                {error}
                            </div>
                        ) : orderedNews.length === 0 ? (
                            <div
                                style={{
                                    padding: '64px 24px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '24px',
                                    backgroundColor: '#ffffff',
                                    textAlign: 'center',
                                }}
                            >
                                <Newspaper className="mx-auto mb-4 h-11 w-11 text-gray-400"/>
                                <h2 className="mb-2 text-2xl">Новости пока не опубликованы</h2>
                                <p className="text-gray-600">Новые материалы скоро появятся.</p>
                            </div>
                        ) : (
                            <>
                                {/* МОБИЛКА / ПЛАНШЕТ: все карточки одинаковые */}
                                <div className="news-layout-grid">
                                    {orderedNews.map((item, index) => {
                                        const isFeatured =
                                            page === 1 && index < 2;

                                        return (
                                            <div
                                                key={item.documentId}
                                                className={
                                                    isFeatured
                                                        ? 'news-layout-item news-layout-item--featured'
                                                        : 'news-layout-item'
                                                }
                                            >
                                                <NewsCard
                                                    news={item}
                                                    featured={isFeatured}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {pagination.pageCount > 1 && (
                                    <nav
                                        aria-label="Пагинация новостей"
                                        className="mt-12 flex flex-wrap items-center justify-center gap-2"
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={page <= 1}
                                            onClick={() => changePage(page - 1)}
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4"/>
                                            <span className="hidden sm:inline">Назад</span>
                                        </Button>

                                        {pageNumbers.map((pageNumber) => (
                                            <Button
                                                key={pageNumber}
                                                type="button"
                                                variant="outline"
                                                onClick={() => changePage(pageNumber)}
                                                style={
                                                    pageNumber === page
                                                        ? {
                                                            minWidth: '42px',
                                                            color: '#ffffff',
                                                            borderColor: '#15803d',
                                                            backgroundColor: '#15803d',
                                                        }
                                                        : {
                                                            minWidth: '42px',
                                                        }
                                                }
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={page >= pagination.pageCount}
                                            onClick={() => changePage(page + 1)}
                                        >
                                            <span className="hidden sm:inline">Вперёд</span>
                                            <ChevronRight className="ml-1 h-4 w-4"/>
                                        </Button>
                                    </nav>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}