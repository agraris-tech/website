import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState, useMemo} from 'react';
import {Card, CardContent} from '../components/ui/card';
import {Button} from '../components/ui/button';
import {Badge} from '../components/ui/badge';
import {AppPageLoader} from '../components/AppPageLoader';
import {useLeadModal} from '../contexts/LeadModalContext';
import {Separator} from '../components/ui/separator';
import {
    ShoppingCart,
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Clock,
    Shield,
    Package,
    CreditCard,
    Truck,
    ChevronLeft,
    ChevronRight, FileText,
} from 'lucide-react';
import {useCart} from '../contexts/CartContext';
import {toast} from 'sonner';
import {getProductBySlug, getSiteSettings, getExchangeRates} from '../services/strapi';
import {convertFromEur, formatConvertedPrice, getDomainCurrency} from '../lib/currency';
// @ts-ignore
import DOMPurify from 'dompurify';
import {getRegionalContact, type SiteSettings} from '../lib/getRegionalContact';
import {getHostname} from "../lib/getHostname";
import ProductSeo from '../components/seo/ProductSeo';
import {Helmet} from "react-helmet-async";


type Product = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    searchKeywords?: string | null;
    priceBase: number | null;
    baseCurrency: string;
    availability: string;
    type: 'new' | 'used';

    sku?: string;

    power?: string;
    conditionLabel?: string;
    year?: number | null;
    country?: string;
    warranty?: string;
    deliveryTime?: string;
    manufacturer?: string;
    specs?: Record<string, string>;

    brand?: {
        id: number;
        name: string;
    } | null;

    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;

    images: string[];
};

const FALLBACK_IMAGE = '/images/placeholder-equipment.png';

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


export function ProductPage() {
    const navigate = useNavigate();
    const {addToCart} = useCart();
    const {slug} = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const contact = getRegionalContact(settings, getHostname());
    const {openProductOffer} = useLeadModal();
    const [exchangeRates, setExchangeRates] = useState<{
        baseCurrency: string;
        rubRate: number | null;
        kztRate: number | null;
        bynRate: number | null;
        sourceName: string;
        updatedAtExternal: string | null;
    } | null>(null);


    useEffect(() => {
        async function loadProduct() {
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 200));
                const [productData, settingsData, ratesData] = await Promise.all([
                    getProductBySlug(slug),
                    getSiteSettings(),
                    getExchangeRates(),
                ]);

                setProduct(productData);
                setSettings(settingsData);
                setExchangeRates(ratesData);
            } catch (error) {
                console.error('Failed to load product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        loadProduct().then();
    }, [slug]);

    useEffect(() => {
        setIsDescriptionExpanded(false);
        setCurrentImageIndex(0);
    }, [product?.slug]);

    const cleanDescriptionHtml = useMemo(() => {
        const raw = product?.description || '';

        return DOMPurify.sanitize(raw, {
            ALLOWED_TAGS: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em'],
            ALLOWED_ATTR: [],
        });
    }, [product?.description]);

    const isLongDescription =
        cleanDescriptionHtml.replace(/<[^>]*>/g, '').length > 500;


    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title,
            price: formatPrice(product.priceBase, product.baseCurrency),
            image: galleryImages[0] || '',
            brand: product.brand?.name ?? '',
            power: product.power ?? '',
            condition: product.conditionLabel ?? '',
        });

        toast.success(`${product.title} добавлен в корзину`);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    if (loading) {
        return <AppPageLoader/>;
    }
    if (!product) {
        return (
            <>
                <Helmet>
                    <title>Техника не найдена | AGRARIS</title>

                    <meta
                        name="robots"
                        content="noindex, follow"
                    />
                </Helmet>

                <div className="container mx-auto px-4 py-20">
                    <h1 className="text-4xl mb-4">
                        Техника не найдена
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Возможно, объявление было удалено или адрес страницы
                        указан неправильно.
                    </p>

                    <Button onClick={() => navigate('/catalog')}>
                        Вернуться в каталог
                    </Button>
                </div>
            </>
        );
    }

    const hostname = window.location.hostname;
    const displayCurrency = getDomainCurrency(hostname);

    const displayPrice =
        product.priceBase !== null
            ? convertFromEur(product.priceBase, displayCurrency, exchangeRates)
            : null;

    const formattedPrice = formatConvertedPrice(displayPrice, displayCurrency);

    const galleryImages =
        product.images && product.images.length > 0 ? product.images : [];


    return (
        <>
            <ProductSeo
                product={product}
                displayPrice={displayPrice}
                displayCurrency={displayCurrency}
            />
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/catalog')}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        Назад к каталогу
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        <div>
                            <Card className="overflow-hidden mb-4">
                                <div className="relative h-[500px] bg-gray-100 flex items-center justify-center">
                                    {galleryImages.length > 0 ? (
                                        <img
                                            src={galleryImages[currentImageIndex]}
                                            alt={`${product.title} - фото ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={FALLBACK_IMAGE}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {galleryImages.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
                                                onClick={prevImage}
                                            >
                                                <ChevronLeft className="w-5 h-5"/>
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
                                                onClick={nextImage}
                                            >
                                                <ChevronRight className="w-5 h-5"/>
                                            </Button>
                                        </>
                                    )}

                                    {galleryImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {galleryImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`h-2 rounded-full transition-all ${
                                                        index === currentImageIndex
                                                            ? 'w-8 bg-white'
                                                            : 'w-2 bg-white/50'
                                                    }`}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {galleryImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex
                                                    ? 'border-green-700 ring-2 ring-green-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.title} - миниатюра ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-4">
                                <Badge className={product.type === 'new' ? 'bg-green-700' : 'bg-blue-600'}>
                                    {product.conditionLabel || (product.type === 'new' ? 'Новая' : 'Б/У')}
                                </Badge>
                                <span className="ml-3 text-gray-500">{product.brand?.name}</span>
                            </div>

                            <h1 className="text-4xl mb-4">{product.title}</h1>

                            <div className="text-4xl text-green-700 mb-6">
                                {formattedPrice}
                            </div>

                            <div className="mb-10 max-w-3xl">
                                <div className="relative">
                                    <div
                                        className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50/80 px-7 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 transition-all duration-500 ease-in-out"
                                        style={{
                                            maxHeight: isDescriptionExpanded ? '2000px' : '320px',
                                        }}
                                    >
                                        <div
                                            className="product-description text-gray-700 text-[17px] leading-8"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    cleanDescriptionHtml || '<p>Описание товара скоро будет добавлено.</p>',
                                            }}
                                        />
                                    </div>

                                    {!isDescriptionExpanded && isLongDescription && (
                                        <div
                                            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-3xl bg-gradient-to-t from-white via-white/90 to-transparent"/>
                                    )}
                                </div>

                                {isLongDescription && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition-colors duration-300 hover:text-green-800"
                                        >
        <span>
          {isDescriptionExpanded ? 'Скрыть описание' : 'Показать полное описание'}
        </span>
                                            <span
                                                className={`inline-block transition-transform duration-300 ${
                                                    isDescriptionExpanded ? 'rotate-180' : ''
                                                }`}
                                            >
          ↓
        </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mb-8">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-green-700 hover:bg-green-800"
                                    onClick={() => openProductOffer(product.title)}
                                >
                                    <FileText className="w-5 h-5 mr-2"/>
                                    Запросить предложение
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/contact')}
                                >
                                    <Phone className="w-5 h-5 mr-2"/>
                                    Связаться
                                </Button>
                            </div>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl mb-4">Технические характеристики</h3>

                                    <div>
                                        {product.specs && Object.keys(product.specs).length > 0 ? (
                                            Object.entries(product.specs).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="
                    grid
                    grid-cols-[200px_minmax(0,1fr)]
                    items-start
                    gap-x-6
                    py-4
                    border-b
                    border-gray-100
                    last:border-0
                "
                                                >
                                                    <div className="text-gray-600 leading-7">
                                                        {key}:
                                                    </div>

                                                    <div
                                                        className="
                        min-w-0
                        text-gray-900
                        leading-7
                        text-right
                        break-words
                        whitespace-normal
                        justify-self-end
                    "
                                                    >
                                                        {String(value)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-2 text-gray-500">
                                                Характеристики пока не заполнены.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Package className="w-6 h-6 text-green-700"/>
                                    </div>
                                    <div>
                                        <h4 className="mb-2">Информация для заказа</h4>
                                        <p className="text-sm text-gray-600">
                                            Для заказа свяжитесь с нами по телефону или заполните форму заявки.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <CreditCard className="w-6 h-6 text-blue-700"/>
                                    </div>
                                    <div>
                                        <h4 className="mb-2">Условия оплаты</h4>
                                        <p className="text-sm text-gray-600">
                                            Наличный и безналичный расчет. Возможна рассрочка платежа.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <Truck className="w-6 h-6 text-orange-700"/>
                                    </div>
                                    <div>
                                        <h4 className="mb-2">Доставка</h4>
                                        <p className="text-sm text-gray-600">
                                            {product.deliveryTime || 'Срок доставки уточняется при заказе.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Shield className="w-6 h-6 text-purple-700"/>
                                    </div>
                                    <div>
                                        <h4 className="mb-2">Гарантия</h4>
                                        <p className="text-sm text-gray-600">
                                            {product.warranty || 'Гарантийные условия уточняются.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="text-2xl mb-6">Основная информация</h3>

                                <div className="space-y-4">

                                    {/* Наличие */}

                                    <>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Наличие</div>
                                            <div className="text-lg">В наличии</div>
                                        </div>
                                        <Separator/>
                                    </>

                                    {/* Страна */}
                                    {product.country && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Страна</div>
                                                <div className="text-lg">{product.country}</div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}
                                    {product.year && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">
                                                    Год выпуска
                                                </div>

                                                <div className="text-lg">
                                                    {product.year}
                                                </div>
                                            </div>

                                            <Separator/>
                                        </>
                                    )}


                                    {/* Артикул */}
                                    {product.sku && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Артикул</div>
                                                <div className="text-lg">{product.sku}</div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {/* Производитель */}
                                    {(product.manufacturer || product.brand?.name) && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Производитель</div>
                                                <div className="text-lg">
                                                    {product.manufacturer || product.brand?.name}
                                                </div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {/* Категория */}
                                    {product.category?.name && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Категория</div>
                                                <div className="text-lg">{product.category.name}</div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}


                                    <>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Тип продажи</div>
                                            <div className="text-lg">Оптом и в розницу</div>
                                        </div>
                                        <Separator/>
                                    </>

                                    {/* Состояние */}
                                    {(product.conditionLabel || product.type) && (
                                        <>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Состояние</div>
                                                <div className="text-lg">
                                                    {product.conditionLabel || (product.type === 'new' ? 'Новая' : 'Б/У')}
                                                </div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {/* Гарантия */}
                                    {product.warranty && (
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Гарантия</div>
                                            <div className="text-lg">{product.warranty}</div>
                                        </div>
                                    )}

                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-8">
                                <h3 className="text-2xl mb-6">Контакты и график работы</h3>

                                <div className="space-y-6">
                                    {contact?.workingHours && (
                                        <>
                                            <div className="flex items-start gap-4">
                                                <Clock className="w-5 h-5 text-gray-400 mt-1"/>
                                                <div>
                                                    <div className="mb-2">График работы</div>
                                                    <div className="text-sm text-gray-600 whitespace-pre-line">
                                                        {contact?.workingHours}
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {contact?.fullAddress && (
                                        <>
                                            <div className="flex items-start gap-4">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-1"/>
                                                <div>
                                                    <div className="mb-2">Адрес</div>
                                                    <div className="text-sm text-gray-600 whitespace-pre-line">
                                                        {contact.fullAddress}
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {contact?.phone && (
                                        <>
                                            <div className="flex items-start gap-4">
                                                <Phone className="w-5 h-5 text-gray-400 mt-1"/>
                                                <div>
                                                    <div className="mb-2">Телефон</div>
                                                    <a
                                                        href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                                                        className="text-sm text-green-700 hover:underline"
                                                    >
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            </div>
                                            <Separator/>
                                        </>
                                    )}

                                    {contact?.email && (
                                        <div className="flex items-start gap-4">
                                            <Mail className="w-5 h-5 text-gray-400 mt-1"/>
                                            <div>
                                                <div className="mb-2">Email</div>
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="text-sm text-green-700 hover:underline"
                                                >
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}