import React from 'react';

import ReactDOM from 'react-dom/client';

import {
    HelmetProvider,
} from 'react-helmet-async';

import App from './App';

import {
    initGoogleAnalytics,
} from './lib/googleAnalytics';

import {
    initGoogleAds,
} from './lib/googleAds';

import './index.css';

/*
 * Сначала запускаем GA4.
 * Он работает на всех трёх
 * основных доменах.
 */
initGoogleAnalytics();

/*
 * Затем подключаем Google Ads.
 * Он добавится только на
 * agraristech.by.
 */
initGoogleAds();

ReactDOM
    .createRoot(
        document.getElementById(
            'root',
        )!,
    )
    .render(
        <React.StrictMode>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </React.StrictMode>,
    );