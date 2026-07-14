import {Equipment} from '../components/Equipment';
import {PageWrapper} from '../components/PageWrapper';
import {useEffect, useState, useRef} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../components/ui/card';
import {Badge} from '../components/ui/badge';
import {Button} from '../components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../components/ui/tabs';
import {Tractor, Shield, ShoppingCart, Phone} from 'lucide-react';
import {useCart} from '../contexts/CartContext';
import {toast} from 'sonner';
import {useNavigate, useSearchParams, useLocation} from 'react-router-dom';
import {getRootCategories, getAllCategories, getAllActiveProducts, getExchangeRates} from '../services/strapi';
import {convertFromEur, formatConvertedPrice, getDomainCurrency} from '../lib/currency';
import {AppPageLoader} from "../components/AppPageLoader";
import CatalogSeo from '../components/seo/CatalogSeo';

type ProductItem = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    priceBase: number | null;
    baseCurrency: string;
    availability: string;
    type: 'new' | 'used';
    power?: string;
    conditionLabel?: string;
    year?: number;
    country?: string;
    image: string;
    brand?: {
        id: number;
        name: string;
    } | null;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NjYwNTY0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080';

function formatPrice(price: number | null, currency: string) {
    if (price === null || price === undefined) return 'По запросу';

    if (currency === 'EUR') {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    }

    return `${price} ${currency}`;
}


export function EquipmentPage() {
    const [rootCategories, setRootCategories] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    const pageSize = 6;

    const {addToCart} = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();
    const catalogTopRef = useRef<HTMLDivElement | null>(null);
    const hasMountedRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const [exchangeRates, setExchangeRates] = useState<any>(null);

    useEffect(() => {
        const state = location.state as { scrollToFilters?: boolean } | null;

        if (!state?.scrollToFilters) return;
        if (!catalogTopRef.current) return;

        const timeout = setTimeout(() => {
            scrollToFilters();
        }, 100);

        return () => clearTimeout(timeout);
    }, [location.key, rootCategories.length, products.length]);


    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');

        if (categoryFromUrl) {
            setActiveTab(categoryFromUrl);
            setPage(1);
        } else {
            setActiveTab('all');
        }
    }, [searchParams]);


    useEffect(() => {
        async function loadRootCategories() {
            try {
                const data = await getRootCategories();
                setRootCategories(data);
            } catch (error) {
            }
        }

        loadRootCategories();
    }, []);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                await new Promise((resolve) => setTimeout(resolve, 200));
                const [roots, categories, products, rates] = await Promise.all([
                    getRootCategories(),
                    getAllCategories(),
                    getAllActiveProducts(),
                    getExchangeRates(),
                ]);

                setRootCategories(roots);
                setAllCategories(categories);
                setAllProducts(products);
                setExchangeRates(rates);
            } catch (error) {
                console.error('Failed to load catalog data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        let filtered = [...allProducts];

        if (activeTab !== 'all') {
            filtered = filtered.filter((product) => {
                if (!product.category?.slug) return false;

                const rootSlug = getRootSlugForCategory(product.category.slug);
                return rootSlug === activeTab;
            });
        }

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        setProducts(filtered.slice(start, end));
        setPageCount(Math.max(1, Math.ceil(total / pageSize)));
    }, [allProducts, allCategories, activeTab, page]);

    const getRootSlugForCategory = (categorySlug: string) => {
        const category = allCategories.find((cat) => cat.slug === categorySlug);
        if (!category) return categorySlug;

        if (!category.parent) return category.slug;

        const parent = allCategories.find((cat) => cat.slug === category.parent.slug);
        if (!parent) return category.parent.slug;

        return parent.parent ? parent.parent.slug : parent.slug;
    };


    const getProductStateLabel = (item: any) => {
        if (!item.category?.slug) return null;

        const rootSlug = getRootSlugForCategory(item.category.slug);

        if (rootSlug === 'selskohozyajstvennaya-tehnika-novaya') {
            return {
                label: 'Новая',
                className: 'bg-green-700',
            };
        }

        if (rootSlug === 'selhoztehnika-bu') {
            return {
                label: 'Б/У',
                className: 'bg-blue-600',
            };
        }

        if (
            rootSlug === 'zapasnye-chasti-dlya-selskohozyajstvennoj-tehniki' ||
            rootSlug === 'zapchasti-grimme'
        ) {
            return {
                label: 'Запчасти',
                className: 'bg-green-700',
            };
        }

        return null;
    };

    const scrollToFilters = () => {
        if (!catalogTopRef.current) return;
        const y = catalogTopRef.current.getBoundingClientRect().top + window.scrollY - 150;

        window.scrollTo({
            top: y,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        scrollToFilters();
    }, [page, activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setPage(1);

        if (value === 'all') {
            navigate('/catalog', {state: {preserveScroll: true}});
        } else {
            navigate(`/catalog?category=${value}`, {
                state: {preserveScroll: true},
            });
        }
    };

    const getCategoryTabLabel = (category: any) => {
        switch (category.slug) {
            case 'selskohozyajstvennaya-tehnika-novaya':
                return 'Новая техника';

            case 'selhoztehnika-bu':
                return 'Техника Б/У';

            case 'zapasnye-chasti-dlya-selskohozyajstvennoj-tehniki':
                return 'Запчасти';

            case 'zapchasti-grimme':
                return 'Запчасти Grimme';

            default:
                return category.name;
        }
    };

    const displayCurrency = getDomainCurrency(window.location.hostname);


    const handleAddToCart = (item: ProductItem) => {
        addToCart({
            id: item.id,
            name: item.title,
            price: formatPrice(item.priceBase, item.baseCurrency),
            image: item.image || FALLBACK_IMAGE,
            brand: item.brand?.name ?? '',
            power: item.power ?? '',
            condition: item.conditionLabel ?? '',
        });

        toast.success(`${item.title} добавлен в корзину`);
    };

    const renderProducts = () => {
        return products.map((item: any) => {
            const convertedPrice =
                item.priceBase !== null
                    ? convertFromEur(item.priceBase, displayCurrency, exchangeRates)
                    : null;

            const formattedPrice = formatConvertedPrice(convertedPrice, displayCurrency);

            return (
                <Card
                    className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/catalog/${item.slug}`)}
                >
                    <div className="h-48 overflow-hidden">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="flex flex-col items-center text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-12 h-12 mb-2 opacity-70"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 7h4l2-2h6l2 2h4v12H3V7z"
                                        />
                                        <circle cx="12" cy="13" r="3" strokeWidth={1.5}/>
                                    </svg>
                                    <span className="text-sm">Нет изображения</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <CardHeader className="cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const stateBadge = getProductStateLabel(item);

                                    return stateBadge ? (
                                        <Badge className={stateBadge.className}>
                                            {stateBadge.label}
                                        </Badge>
                                    ) : null;
                                })()}


                                <Badge className="bg-green-100 text-green-700 border border-green-200">
                                    В наличии
                                </Badge>


                            </div>

                            <span className="text-sm text-gray-500">{item.brand?.name}</span>
                        </div>

                        <CardTitle className="cursor-pointer text-gray-900">{item.title}</CardTitle>

                        <CardDescription className="cursor-pointer text-gray-600">
                            {item.power ? `Мощность: ${item.power}` : item.category?.name}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="cursor-pointer">
                        <div className="flex justify-between items-center mb-4">
      <span className="text-2xl text-green-700">
        {formattedPrice}
      </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                            >
                                Подробнее
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        });
    };

    if (loading) {
        return <AppPageLoader/>;
    }

    return (
        <>
            <CatalogSeo/>
            <div>
                <section className="relative overflow-hidden bg-white py-16 md:py-24">
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 opacity-95"></div>
                        <img
                            src="https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjYwNTg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <div
                                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
                                <Tractor className="w-4 h-4"/>
                                <span className="text-sm">Новая и б/у техника</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                                Каталог техники
                            </h1>

                            <p className="text-xl mb-10 text-green-100">
                                Качественная европейская сельскохозяйственная техника от ведущих производителей
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                                    <div className="text-3xl mb-2">50+</div>
                                    <div className="text-sm text-green-100">Единиц в наличии</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                                    <div className="text-3xl mb-2">8</div>
                                    <div className="text-sm text-green-100">Ведущих брендов</div>
                                </div>
                                <div
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl col-span-2 md:col-span-1">
                                    <div className="flex-column items-center justify-center gap-2">
                                        <div className="flex items-center justify-center mb-4 gap-2">
                                            <Shield className="w-6 h-6"/>
                                            <div className="text-lg">Гарантия</div>
                                        </div>

                                        <div className="text-sm text-green-100">Проверенная техника</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Equipment/>

                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div ref={catalogTopRef}>
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList
                                    className="grid w-full max-w-5xl mx-auto mb-12"
                                    style={{gridTemplateColumns: `repeat(${rootCategories.length + 1}, minmax(0, 1fr))`}}
                                >
                                    <TabsTrigger value="all">Все</TabsTrigger>

                                    {rootCategories.map((category) => (
                                        <TabsTrigger key={category.documentId} value={category.slug}>

                                            {getCategoryTabLabel(category)}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <TabsContent value={activeTab}>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {renderProducts()}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {pageCount > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-4">
                                <Button
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                >
                                    Назад
                                </Button>

                                <span className="text-sm text-gray-600">
          Страница {page} из {pageCount}
        </span>

                                <Button
                                    variant="outline"
                                    disabled={page === pageCount}
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Вперёд
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}