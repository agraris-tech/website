import {
    useParams,
    Link,
    useNavigate,
} from 'react-router-dom';

import { Helmet } from 'react-helmet-async';

import {
    Calendar,
    Clock,
    ArrowLeft,
} from 'lucide-react';

import {
    Card,
    CardContent,
} from '../components/ui/card';

import { Button } from '../components/ui/button';
import { newsData } from '../data/newsData';

import NewsDetailSeo from '../components/seo/NewsDetailSeo';

export function NewsDetailPage() {
    const { id } = useParams<{
        id: string;
    }>();

    const navigate = useNavigate();

    const newsId = Number.parseInt(
        id || '0',
        10,
    );

    const article = newsData.find(
        (news) => news.id === newsId,
    );

    /*
     * Страница отсутствующей новости.
     *
     * Пока React SPA, сервер, вероятно,
     * возвращает HTTP 200, поэтому хотя бы
     * ставим noindex.
     */
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

                <div className="bg-gray-50 min-h-screen py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl mb-4">
                            Статья не найдена
                        </h1>

                        <Link to="/news">
                            <Button className="bg-green-700 hover:bg-green-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />

                                Вернуться к новостям
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const relatedNews = newsData
        .filter(
            (news) =>
                news.id !== article.id &&
                news.category === article.category,
        )
        .slice(0, 3);

    return (
        <>
            <NewsDetailSeo
                article={{
                    title: article.title,

                    /*
                     * Пока используем ID как часть URL.
                     *
                     * Получится:
                     * /news/1
                     * /news/2
                     */
                    slug: String(article.id),

                    excerpt:
                    article.excerpt,

                    content:
                    article.content,

                    image:
                    article.image,

                    categoryName:
                    article.category,

                    authorName:
                        'AGRARIS',

                    /*
                     * article.date пока не передаём
                     * в publishedAt, потому что для
                     * Schema.org нужна дата ISO:
                     *
                     * 2026-07-14T10:00:00+03:00
                     *
                     * Обычная строка вида
                     * "14 июля 2026" не подходит.
                     */
                }}
            />

            <div className="bg-gray-50 min-h-screen">
                {/* Hero Image */}
                <div className="relative h-[400px] overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto">
                            <h1 className="text-4xl text-white mb-4 max-w-4xl">
                                {article.title}
                            </h1>

                            <div className="flex items-center gap-6 text-white/90">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />

                                    {article.date}
                                </span>

                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />

                                    {article.readTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                navigate('/news')
                            }
                            className="mb-8 text-green-700 hover:text-green-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />

                            Назад к новостям
                        </Button>

                        <Card className="mb-12">
                            <CardContent className="p-8">
                                <div
                                    className="
                                        prose prose-lg max-w-none
                                        prose-headings:text-gray-900
                                        prose-headings:font-bold
                                        prose-h2:text-2xl
                                        prose-h2:mt-8
                                        prose-h2:mb-4
                                        prose-p:text-gray-700
                                        prose-p:leading-relaxed
                                        prose-p:mb-4
                                        prose-ul:list-disc
                                        prose-ul:pl-6
                                        prose-ul:mb-4
                                        prose-li:text-gray-700
                                        prose-li:mb-2
                                    "
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            article.content ||
                                            article.excerpt ||
                                            '',
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Related News */}
                        {relatedNews.length > 0 && (
                            <div>
                                <h2 className="text-2xl mb-6">
                                    Похожие статьи
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedNews.map(
                                        (news) => (
                                            <Link
                                                to={`/news/${news.id}`}
                                                key={news.id}
                                            >
                                                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full">
                                                    <div className="relative h-[150px] overflow-hidden">
                                                        <img
                                                            src={
                                                                news.image
                                                            }
                                                            alt={
                                                                news.title
                                                            }
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>

                                                    <CardContent className="p-4">
                                                        <h3 className="text-base mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                                                            {
                                                                news.title
                                                            }
                                                        </h3>

                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <Calendar className="w-3 h-3" />

                                                            {
                                                                news.date
                                                            }
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}