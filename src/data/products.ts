// src/data/products.ts
export type Product = {
    id: string;                 // например p243346198
    slug: string;               // kartofeleuborochnyj-kombajn-grimme
    title: string;
    categoryId: string;
    subcategoryId?: string;
    price: number | null;
    currency: 'BYN';
    availability: 'in_stock' | 'out_of_stock' | 'on_request';
    brand?: string;
    manufacturerCountry?: string;
    importer?: string;
    importerLocation?: string;
    description?: string;
    specs?: Record<string, string>;
    images: string[];
    sourceUrl: string;
    featured?: boolean;
};