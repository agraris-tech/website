export type RegionalContact = {
    phone?: string;
    email?: string;
    whatsappUrl?: string;
    telegramUrl?: string;
    addressShort?: string;
    fullAddress?: string;
    mapType?: 'google' | 'yandex';
    mapEmbedUrl?: string;
    mapExternalUrl?: string;
    workingHours?: string;
    callbackButtonText?: string;
};

export type SiteSettings = {
    companyName?: string;
    companySubtitle?: string;
    legalName?: string;
    companyShortDescription?: string;
    email?: string;
    privacyPolicyUrl?: string;
    termsUrl?: string;
    contactRu?: RegionalContact | null;
    contactBy?: RegionalContact | null;
    contactKz?: RegionalContact | null;
};

export function getRegionalContact(
    settings: SiteSettings | null | undefined,
    hostname: string
): RegionalContact | null {
    if (!settings) return null;

    const host = hostname.replace(/^www\./, '');

    let contact: RegionalContact | null = null;

    if (host === 'agraris.ru') {
        contact = settings.contactRu ?? null;
    } else if (host === 'agraris.tech') {
        contact = settings.contactKz ?? null;
    } else {
        contact = settings.contactBy ?? null;
    }

    if (!contact) return null;

    return {
        ...contact,
        email: contact.email || settings.email, // fallback
    };
}