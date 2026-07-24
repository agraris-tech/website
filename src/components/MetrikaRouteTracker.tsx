import {
    useEffect,
} from 'react';

import {
    useLocation,
} from 'react-router-dom';

import {
    initYandexMetrika,
    trackYandexPageView,
} from '../lib/yandexMetrika';

/*
 * Последний заголовок, с которым
 * был отправлен просмотр.
 *
 * Это позволяет дождаться, пока
 * React Helmet обновит title после
 * загрузки товара или новости.
 */
let lastTrackedTitle = '';

export function MetrikaRouteTracker() {
    const location =
        useLocation();

    useEffect(() => {
        const counterId =
            initYandexMetrika();

        /*
         * На localhost или неизвестном
         * домене счётчик отключён.
         */
        if (!counterId) {
            return;
        }

        let disposed = false;
        let completed = false;

        const currentUrl =
            window.location.href;

        const startedAt =
            Date.now();

        let intervalId:
            number | undefined;

        let fallbackId:
            number | undefined;

        function cleanupTimers() {
            if (
                intervalId !==
                undefined
            ) {
                window.clearInterval(
                    intervalId,
                );
            }

            if (
                fallbackId !==
                undefined
            ) {
                window.clearTimeout(
                    fallbackId,
                );
            }
        }

        function sendPageView(
            force = false,
        ) {
            if (
                disposed ||
                completed
            ) {
                return;
            }

            const currentTitle =
                document.title
                    .trim();

            /*
             * После перехода старый title
             * может временно оставаться
             * от предыдущей страницы.
             *
             * Ждём новый title от Helmet.
             */
            const titleIsReady =
                Boolean(
                    currentTitle,
                ) &&
                currentTitle !==
                lastTrackedTitle;

            const maximumWaitReached =
                Date.now() -
                startedAt >=
                5000;

            if (
                !titleIsReady &&
                !force &&
                !maximumWaitReached
            ) {
                return;
            }

            const sent =
                trackYandexPageView(
                    currentUrl,
                    currentTitle,
                );

            if (sent) {
                lastTrackedTitle =
                    currentTitle;
            }

            completed = true;

            cleanupTimers();
        }

        /*
         * Проверяем title каждые 100 мс.
         * Для статических страниц просмотр
         * отправится почти сразу.
         *
         * Для товара или новости дождёмся
         * загрузки Strapi и SEO title.
         */
        intervalId =
            window.setInterval(
                () => {
                    sendPageView();
                },
                100,
            );

        /*
         * Резервная отправка:
         * просмотр не потеряется даже
         * при отсутствии SEO title.
         */
        fallbackId =
            window.setTimeout(
                () => {
                    sendPageView(
                        true,
                    );
                },
                5100,
            );

        return () => {
            disposed = true;

            cleanupTimers();
        };
    }, [
        location.pathname,
        location.search,
        location.hash,
    ]);

    return null;
}