import {
    sendGoogleAdsConversion,
} from './googleAds';

const LEAD_CONVERSION_ID =
    'AW-18176485543/Qrx4CMjtq9McEKfRnNtD';

export function trackGoogleAdsLead(
    leadId: string,
): void {
    const cleanLeadId =
        leadId.trim();

    if (!cleanLeadId) {
        return;
    }

    /*
     * На agraris.ru и agraris.tech
     * функция автоматически ничего
     * не отправит.
     */
    sendGoogleAdsConversion({
        send_to:
        LEAD_CONVERSION_ID,

        transaction_id:
        cleanLeadId,
    });
}