import {Card, CardContent} from '../components/ui/card';
import {Button} from '../components/ui/button';
import {Calendar, Clock, ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {newsData} from '../data/newsData';
import NewsSeo from '../components/seo/NewsSeo';

export function NewsPage() {
    const featuredNews = newsData.filter(news => news.featured);
    const regularNews = newsData.filter(news => !news.featured);

    return (
        <>
            <NewsSeo/>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white py-16 mb-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl mb-4">Новости и статьи</h1>
                            <p className="text-xl text-green-50">
                                Актуальные новости отрасли, обзоры техники и полезные советы
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">{/* Featured News */}

                    {featuredNews.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl mb-6">Главные новости</h2>
                            <div className="grid lg:grid-cols-2 gap-8">
                                {featuredNews.map((news) => (
                                    <Link to={`/news/${news.id}`} key={news.id}>
                                        <Card
                                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
                                            <div className="relative h-[320px] overflow-hidden flex-shrink-0">
                                                <img
                                                    src={news.image}
                                                    alt={news.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <CardContent className="p-6 flex-grow flex flex-col">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4"/>
                            {news.date}
                        </span>
                                                    <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4"/>
                                                        {news.readTime}
                        </span>
                                                </div>
                                                <h3 className="text-2xl mb-3 group-hover:text-green-700 transition-colors">
                                                    {news.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                                                    {news.excerpt}
                                                </p>
                                                <Button variant="ghost"
                                                        className="text-green-700 hover:text-green-800 p-0 self-start">
                                                    Читать далее <ArrowRight className="w-4 h-4 ml-2"/>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular News Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {regularNews.map((news) => (
                            <Link to={`/news/${news.id}`} key={news.id}>
                                <Card
                                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
                                    <div className="relative h-[240px] overflow-hidden flex-shrink-0">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-5 flex-grow flex flex-col">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3"/>
                        {news.date}
                    </span>
                                            <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3"/>
                                                {news.readTime}
                    </span>
                                        </div>
                                        <h3 className="text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                                            {news.excerpt}
                                        </p>
                                        <Button variant="ghost" size="sm"
                                                className="text-green-700 hover:text-green-800 p-0 self-start">
                                            Читать далее <ArrowRight className="w-3 h-3 ml-1"/>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="bg-green-700 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl mb-4">Подпишитесь на новости</h2>
                            <p className="text-lg mb-6 text-green-50">
                                Получайте актуальную информацию о новинках техники и специальных предложениях
                            </p>
                            <div className="flex max-w-md mx-auto gap-3">
                                <input
                                    type="email"
                                    placeholder="Ваш email"
                                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                />
                                <Button className="bg-white text-green-700 hover:bg-gray-100">
                                    Подписаться
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
