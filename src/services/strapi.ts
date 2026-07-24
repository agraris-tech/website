const API_URL = "https://cozy-action-02025ea19f.strapiapp.com/api";
const STRAPI_ORIGIN =
    API_URL.replace(/\/api\/?$/, '');

export async function getEquipmentCards() {
    const res = await fetch(
        `${API_URL}/equipment-cards?sort=sortOrder:asc&filters[isActive][$eq]=true`
    );
    const json = await res.json();

    if (!res.ok) {
        console.error('Failed to load equipment cards:', json);
        return [];
    }

    return Array.isArray(json.data) ? json.data : [];
}

export async function getBrands(params?: { limit?: number }) {
    const limit = params?.limit;

    const searchParams = new URLSearchParams();
    searchParams.set('sort[0]', 'sortOrder:asc');
    searchParams.set('filters[isActive][$eq]', 'true');

    if (limit) {
        searchParams.set('pagination[pageSize]', String(limit));
    }

    const res = await fetch(`${API_URL}/brands?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error('Failed to load brands:', json);
        return [];
    }

    return Array.isArray(json.data) ? json.data : [];
}

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

export async function getSiteSettings() {
    const searchParams = new URLSearchParams();
    searchParams.set("populate", "*");

    const res = await fetch(`${API_URL}/site-settings?${searchParams.toString()}`);
    const json = await res.json();


    if (!res.ok) {
        console.error("Strapi site settings error:", json);
        return null;
    }

    const item = Array.isArray(json?.data) ? json.data[0] : json?.data;

    if (!item) return null;

    return {
        id: item.id,
        documentId: item.documentId,
        companyName: item.companyName ?? "",
        companySubtitle: item.companySubtitle ?? "",
        contactPerson: item.contactPerson ?? "",
        legalName: item.legalName ?? "",
        companyShortDescription: item.companyShortDescription ?? "",
        email: item.email ?? "",
        privacyPolicyUrl: item.privacyPolicyUrl ?? "#",
        termsUrl: item.termsUrl ?? "#",
        websiteUrl: item.websiteUrl ?? "",

        contactRu: item.contactRu ?? null,
        contactBy: item.contactBy ?? null,
        contactKz: item.contactKz ?? null,
    };
}



export async function getProductBySlug(slug: string) {
    const searchParams = new URLSearchParams();
    searchParams.set("filters[slug][$eq]", slug);
    searchParams.set("populate", "*");

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Strapi product error:", json);
        return null;
    }

    const item = Array.isArray(json.data) ? json.data[0] : null;

    if (!item) return null;

    const mainImageUrl = item.mainImage?.url ? getMediaUrl(item.mainImage.url) : null;

    const galleryImages = Array.isArray(item.images)
        ? item.images
            .map((img: any) => (img?.url ? getMediaUrl(img.url) : null))
            .filter(Boolean)
        : [];

    return {
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        slug: item.slug,
        description: item.description ?? "",
        shortDescription: item.shortDescription ?? "",
        priceBase: item.priceBase ?? null,
        baseCurrency: item.baseCurrency ?? "EUR",
        availability: item.availability ?? "",
        power: item.power ?? "",
        conditionLabel: item.conditionLabel ?? "",
        year: item.year ?? null,
        country: item.country ?? "",
        warranty: item.warranty ?? "",
        deliveryTime: item.deliveryTime ?? "",
        manufacturer: item.manufacturer ?? "",
        sku: item.sku ?? "",
        saleType: item.saleType ?? "",
        specs: item.specs ?? {},
        metaTitle:
            item.metaTitle ?? null,

        metaDescription:
            item.metaDescription ?? null,

        searchKeywords:
            item.searchKeywords ?? null,
        brand: item.brand
            ? {
                id: item.brand.id,
                name: item.brand.name,
            }
            : null,
        category: item.category
            ? {
                id: item.category.id,
                name: item.category.name,
                slug: item.category.slug,
            }
            : null,
        images: [
            ...(mainImageUrl ? [mainImageUrl] : []),
            ...galleryImages,
        ],
    };
}

export async function getRootCategories() {
    const searchParams = new URLSearchParams();
    searchParams.set("filters[parent][$null]", "true");
    searchParams.set("filters[isActive][$eq]", "true");
    searchParams.set("sort[0]", "sortOrder:asc");
    searchParams.set("pagination[pageSize]", "20");

    const res = await fetch(`${API_URL}/categories?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Failed to load root categories:", json);
        return [];
    }

    return Array.isArray(json.data)
        ? json.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            slug: item.slug,
            categoryType: item.categoryType ?? "",
        }))
        : [];
}

export async function getAllActiveProducts() {
    const searchParams = new URLSearchParams();
    searchParams.set("sort[0]", "publishedAt:desc");
    searchParams.set("filters[isActive][$eq]", "true");
    searchParams.set("pagination[pageSize]", "500");
    searchParams.set("populate[0]", "brand");
    searchParams.set("populate[1]", "category");
    searchParams.set("populate[2]", "mainImage");

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Strapi all products error:", json);
        return [];
    }

    const items = Array.isArray(json.data) ? json.data : [];

    return items.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        slug: item.slug,
        priceBase: item.priceBase ?? null,
        baseCurrency: item.baseCurrency ?? "EUR",
        availability: item.availability ?? "",
        conditionLabel: item.conditionLabel ?? "",
        year: item.year ?? null,
        country: item.country ?? "",
        sku: item.sku ?? "",
        saleType: item.saleType ?? "",
        isActive: item.isActive ?? true,
        brand: item.brand
            ? {
                id: item.brand.id,
                name: item.brand.name,
            }
            : null,
        category: item.category
            ? {
                id: item.category.id,
                documentId: item.category.documentId,
                name: item.category.name,
                slug: item.category.slug,
            }
            : null,
        image: item.mainImage?.url ? getMediaUrl(item.mainImage.url) : "",
    }));
}


export async function getTopBrands(limit?: { limit: number }) {
    const searchParams = new URLSearchParams();
    searchParams.set("filters[isActive][$eq]", "true");
    searchParams.set("pagination[pageSize]", "500");
    searchParams.set("populate[0]", "brand");

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Failed to load products for top brands:", json);
        return [];
    }

    const items = Array.isArray(json.data) ? json.data : [];

    const brandMap = new Map();

    items.forEach((item: any) => {
        const brand = item.brand;
        if (!brand) return;

        const key = brand.documentId || brand.id;

        if (!brandMap.has(key)) {
            brandMap.set(key, {
                id: brand.id,
                documentId: brand.documentId,
                name: brand.name,
                slug: brand.slug,
                count: 0,
            });
        }

        brandMap.get(key).count += 1;
    });

    return Array.from(brandMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

export async function getAllCategories() {
    const searchParams = new URLSearchParams();
    searchParams.set("filters[isActive][$eq]", "true");
    searchParams.set("sort[0]", "sortOrder:asc");
    searchParams.set("pagination[pageSize]", "500");
    searchParams.set("populate[0]", "parent");

    const res = await fetch(`${API_URL}/categories?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Failed to load all categories:", json);
        return [];
    }

    return Array.isArray(json.data)
        ? json.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            slug: item.slug,
            parent: item.parent
                ? {
                    id: item.parent.id,
                    documentId: item.parent.documentId,
                    name: item.parent.name,
                    slug: item.parent.slug,
                }
                : null,
        }))
        : [];
}

export async function getExchangeRates() {
    const res = await fetch(`${API_URL}/currency-rates`);

    const json = await res.json();

    if (!res.ok) {
        console.error('Failed to load exchange rates:', json);
        return null;
    }

    const item = Array.isArray(json.data) ? json.data[0] : json.data;

    if (!item) return null;

    return {
        baseCurrency: item.baseCurrency ?? 'EUR',
        rubRate: item.rubRate ?? null,
        kztRate: item.kztRate ?? null,
        bynRate: item.bynRate ?? null,
        sourceName: item.sourceName ?? '',
        updatedAtExternal: item.updatedAtExternal ?? null,
    };
}

export async function getProducts(params?: {
    page?: number;
    pageSize?: number;
    rootCategorySlug?: string;
}) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 6;

    const searchParams = new URLSearchParams();

    searchParams.set("pagination[page]", String(page));
    searchParams.set("pagination[pageSize]", String(pageSize));
    searchParams.set("sort[0]", "publishedAt:desc");

    // важно
    searchParams.set("filters[isActive][$eq]", "true");

    // populate (БЕЗ глубокой вложенности)
    searchParams.set("populate[0]", "brand");
    searchParams.set("populate[1]", "category");
    searchParams.set("populate[2]", "mainImage");

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
        console.error("Strapi products error:", json);
        return {
            data: [],
            meta: { pagination: { page: 1, pageSize, pageCount: 1, total: 0 } },
        };
    }

    let items = Array.isArray(json.data) ? json.data : [];

    // 🔥 фильтр по главной категории
    if (params?.rootCategorySlug) {
        items = items.filter((item: any) => {
            const category = item.category;
            return category?.slug === params.rootCategorySlug;
        });
    }

    const total = items.length;
    const paginatedItems = items.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return {
        data: paginatedItems.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            slug: item.slug,
            priceBase: item.priceBase ?? null,
            baseCurrency: item.baseCurrency ?? "EUR",
            availability: item.availability ?? "",
            conditionLabel: item.conditionLabel ?? "",
            year: item.year ?? null,
            country: item.country ?? "",
            sku: item.sku ?? "",
            saleType: item.saleType ?? "",
            isActive: item.isActive ?? true,
            brand: item.brand
                ? {
                    id: item.brand.id,
                    name: item.brand.name,
                }
                : null,
            category: item.category
                ? {
                    id: item.category.id,
                    name: item.category.name,
                    slug: item.category.slug,
                }
                : null,
            image: item.mainImage?.url
                ? getMediaUrl(item.mainImage.url)
                : "",
        })),
        meta: {
            pagination: {
                page,
                pageSize,
                pageCount: Math.max(1, Math.ceil(total / pageSize)),
                total,
            },
        },
    };
}


export async function getNewsArticles(params?: {
    page?: number;
    pageSize?: number;
}) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;

    const searchParams = new URLSearchParams();

    searchParams.set(
        'filters[isActive][$eq]',
        'true',
    );

    /*
     * Сначала закреплённые новости,
     * затем остальные по дате.
     */
    searchParams.set(
        'sort[0]',
        'featured:desc',
    );

    searchParams.set(
        'sort[1]',
        'featuredOrder:asc',
    );

    searchParams.set(
        'sort[2]',
        'publishedDate:desc',
    );

    /*
     * Настоящая серверная пагинация.
     * Strapi возвращает только 10 записей.
     */
    searchParams.set(
        'pagination[page]',
        String(page),
    );

    searchParams.set(
        'pagination[pageSize]',
        String(pageSize),
    );

    searchParams.set(
        'populate[0]',
        'cover',
    );

    const res = await fetch(
        `${API_URL}/news-articles?${searchParams.toString()}`,
    );

    const json = await res.json();

    if (!res.ok) {
        console.error(
            'Strapi news error:',
            json,
        );

        return {
            data: [],
            meta: {
                pagination: {
                    page: 1,
                    pageSize,
                    pageCount: 1,
                    total: 0,
                },
            },
        };
    }

    return {
        data: Array.isArray(json.data)
            ? json.data
            : [],

        meta: json.meta ?? {
            pagination: {
                page,
                pageSize,
                pageCount: 1,
                total: 0,
            },
        },
    };
}


export async function getNewsArticleBySlug(
    slug: string,
) {
    const searchParams =
        new URLSearchParams();

    searchParams.set(
        'filters[slug][$eq]',
        slug,
    );

    searchParams.set(
        'filters[isActive][$eq]',
        'true',
    );

    searchParams.set(
        'populate[0]',
        'cover',
    );

    const res = await fetch(
        `${API_URL}/news-articles?${searchParams.toString()}`,
    );

    const json = await res.json();

    if (!res.ok) {
        console.error(
            'Strapi news article error:',
            json,
        );

        return null;
    }

    return Array.isArray(json.data)
        ? json.data[0] ?? null
        : null;
}

export async function getRelatedNews(params: {
    category: string;
    excludedSlug: string;
    limit?: number;
}) {
    const limit = params.limit ?? 3;

    const searchParams =
        new URLSearchParams();

    searchParams.set(
        'filters[isActive][$eq]',
        'true',
    );

    searchParams.set(
        'filters[category][$eq]',
        params.category,
    );

    searchParams.set(
        'filters[slug][$ne]',
        params.excludedSlug,
    );

    searchParams.set(
        'sort[0]',
        'publishedDate:desc',
    );

    searchParams.set(
        'pagination[page]',
        '1',
    );

    searchParams.set(
        'pagination[pageSize]',
        String(limit),
    );

    searchParams.set(
        'populate[0]',
        'cover',
    );

    const res = await fetch(
        `${API_URL}/news-articles?${searchParams.toString()}`,
    );

    const json = await res.json();

    if (!res.ok) {
        console.error(
            'Strapi related news error:',
            json,
        );

        return [];
    }

    return Array.isArray(json.data)
        ? json.data
        : [];
}