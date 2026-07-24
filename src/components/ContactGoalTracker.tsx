import {
    useEffect,
} from 'react';

import {
    trackYandexContactGoal,
    type YandexContactChannel,
} from '../lib/yandexMetrika';

function detectContactChannel(
    href: string,
): YandexContactChannel | null {
    const normalizedHref =
        href
            .trim()
            .toLowerCase();

    if (
        normalizedHref.startsWith(
            'tel:',
        )
    ) {
        return 'phone';
    }

    if (
        normalizedHref.startsWith(
            'mailto:',
        )
    ) {
        return 'email';
    }

    if (
        normalizedHref.includes(
            'wa.me/',
        ) ||
        normalizedHref.includes(
            'whatsapp.com/',
        ) ||
        normalizedHref.includes(
            'api.whatsapp.com/',
        )
    ) {
        return 'whatsapp';
    }

    if (
        normalizedHref.includes(
            't.me/',
        ) ||
        normalizedHref.includes(
            'telegram.me/',
        ) ||
        normalizedHref.startsWith(
            'tg:',
        )
    ) {
        return 'telegram';
    }

    return null;
}

/*
 * Отслеживает все контактные ссылки
 * на сайте:
 *
 * Header
 * Footer
 * ContactPage
 * ProductPage
 * другие компоненты
 */
export function ContactGoalTracker() {
    useEffect(() => {
        function handleDocumentClick(
            event: MouseEvent,
        ) {
            if (
                !(
                    event.target
                    instanceof Element
                )
            ) {
                return;
            }

            const link =
                event.target.closest(
                    'a[href]',
                ) as
                    | HTMLAnchorElement
                    | null;

            if (!link) {
                return;
            }

            const href =
                link.getAttribute(
                    'href',
                ) || '';

            const channel =
                detectContactChannel(
                    href,
                );

            if (!channel) {
                return;
            }

            trackYandexContactGoal(
                channel,
            );
        }

        /*
         * capture=true:
         * цель отправится до того,
         * как другой обработчик вызовет
         * preventDefault или переход.
         */
        document.addEventListener(
            'click',
            handleDocumentClick,
            true,
        );

        return () => {
            document.removeEventListener(
                'click',
                handleDocumentClick,
                true,
            );
        };
    }, []);

    return null;
}