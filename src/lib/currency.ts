export type SupportedCurrency = 'EUR' | 'RUB' | 'KZT' | 'BYN';

export function getDomainCurrency(hostname: string): SupportedCurrency {
    if (hostname.includes('agraris.ru')) return 'RUB';
    if (hostname.includes('agraris.tech')) return 'KZT';
    if (hostname.includes('agraristech.by')) return 'BYN';
    return 'EUR';
}

export function convertFromEur(
    amount: number,
    currency: SupportedCurrency,
    rates: {
        rubRate?: number | null;
        kztRate?: number | null;
        bynRate?: number | null;
    } | null
): number {
    if (currency === 'EUR') return amount;
    if (!rates) return amount;

    if (currency === 'RUB' && rates.rubRate) return amount * rates.rubRate;
    if (currency === 'KZT' && rates.kztRate) return amount * rates.kztRate;
    if (currency === 'BYN' && rates.bynRate) return amount * rates.bynRate;

    return amount;
}

export function formatConvertedPrice(amount: number | null, currency: SupportedCurrency) {
    if (amount === null || amount === undefined) return 'По запросу';

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}