import React, {useEffect, useState} from 'react';
import {Tractor, Combine, Truck, Cog} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card';
import {Badge} from './ui/badge';
import {getEquipmentCards, getBrands, getTopBrands} from '../services/strapi';

type EquipmentCardItem = {
    id: number;
    title: string;
    description: string;
    badge: string;
    iconKey: string;
    items: string[];
    sortOrder?: number;
    isActive?: boolean;
};

type BrandItem = {
    id: number;
    name: string;
    sortOrder?: number;
    isActive?: boolean;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    tractor: Tractor,
    combine: Combine,
    truck: Truck,
    cog: Cog,
};

export function Equipment() {
    const [equipmentCards, setEquipmentCards] = useState<EquipmentCardItem[]>([]);
    const [topBrands, setTopBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [cardsData] = await Promise.all([
                    getEquipmentCards(),
                ]);

                setEquipmentCards(cardsData);
            } catch (error) {
                console.error('Failed to load equipment section data:', error);
            } finally {

            }
        }

        loadData().then(r =>console.log() );
    }, []);

    useEffect(() => {
        async function loadTopBrands() {
            try {
                const data = await getTopBrands(8);
                setTopBrands(data);
            } catch (error) {
                console.error('Failed to load top brands:', error);
            }
        }

        loadTopBrands();
    }, []);

    return (
        <section id="equipment" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
                        Наша техника
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Широкий выбор сельскохозяйственной техники от мировых лидеров
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {
                        equipmentCards.map((category:any) => {
                            const Icon = iconMap[category.iconKey] || Tractor;

                            return (
                                <Card key={category.id} className="hover:shadow-lg transition-shadow border-gray-200">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-4">
                                            <div
                                                className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-8 h-8 text-green-700"/>
                                            </div>
                                            <Badge className="bg-green-700">{category.badge}</Badge>
                                        </div>
                                        <CardTitle className="text-gray-900">{category.title}</CardTitle>
                                        <CardDescription className="text-gray-600">
                                            {category.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(category.items) &&
                                                category.items.map((item:any, idx:any) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                    >
      {item}
    </span>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }
                    )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                    <h3 className="text-2xl md:text-3xl mb-8 text-center text-gray-900">
                        Поставляем технику ведущих брендов
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {topBrands.map((brand:any) => (
                                    <div
                                        key={brand.documentId}
                                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24"
                                    >
                                        <span className="text-gray-700">{brand.name}</span>
                                    </div>
                                ))}
                    </div>
                </div>
            </div>
        </section>
    );
}