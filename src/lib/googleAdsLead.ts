import {
    sendGoogleAdsConversion,
} from './googleAds';

import {
    trackYandexLeadSuccess,
    type YandexLeadType,
} from './yandexMetrika';

const LEAD_CONVERSION_ID =
    'AW-18176485543/Qrx4CMjtq9McEKfRnNtD';

/*
 * Имя функции оставляем прежним,
 * чтобы не менять существующие формы.
 *
 * Теперь после успешной заявки:
 *
 * 1. На текущем домене отправляется
 *    цель Яндекс Метрики lead_success.
 *
 * 2. На agraristech.by дополнительно
 *    отправляется Google Ads-конверсия.
 *
 * На agraris.ru и agraris.tech
 * Google Ads автоматически отключён
 * внутри sendGoogleAdsConversion().
 */
export function trackGoogleAdsLead(
    leadId: string,
    leadType:
        YandexLeadType = 'lead',
): void {
    const cleanLeadId =
        leadId.trim();

    if (!cleanLeadId) {
        return;
    }

    trackYandexLeadSuccess(
        cleanLeadId,
        leadType,
    );

    sendGoogleAdsConversion({
        send_to:
        LEAD_CONVERSION_ID,

        transaction_id:
        cleanLeadId,
    });
}