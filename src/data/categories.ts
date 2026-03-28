// src/data/categories.ts
export const categories = [
    {
        id: 'used-equipment',
        title: 'Сельхозтехника б/у',
        slug: 'used-equipment',
        children: [
            { id: 'potato', title: 'Техника для возделывания картофеля', slug: 'potato' },
            { id: 'vegetables', title: 'Техника для овощеводства', slug: 'vegetables' },
            { id: 'hay-feed', title: 'Техника для заготовки сена, кормов', slug: 'hay-feed' },
            { id: 'soil', title: 'Техника для обработки почвы', slug: 'soil' },
            { id: 'other', title: 'Другая сельхозтехника', slug: 'other' },
        ],
    },
    {
        id: 'new-equipment',
        title: 'Сельскохозяйственная техника новая',
        slug: 'new-equipment',
        children: [
            { id: 'bargam', title: 'Bargam S.p.A.', slug: 'bargam' },
            { id: 'dragone', title: 'Dragone s.r.l.', slug: 'dragone' },
        ],
    },
    {
        id: 'grimme-parts',
        title: 'Запчасти Grimme',
        slug: 'grimme-parts',
        children: [],
    },
];