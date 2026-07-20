declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

export function trackGoogleAdsLead(leadId: string): void {
    if (typeof window.gtag !== 'function') {
        console.warn('Google Ads tag is not available');
        return;
    }

    window.gtag('event', 'conversion', {
        send_to: 'AW-18176485543/Qrx4CMjtq9McEKfRnNtD',
        transaction_id: leadId,
    });
}