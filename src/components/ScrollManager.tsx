import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollState = {
    scrollToFilters?: boolean;
};

export function ScrollManager() {
    const location = useLocation();
    const state = location.state as { preserveScroll?: boolean; scrollToFilters?: boolean } | null;

    useLayoutEffect(() => {
        if (state?.preserveScroll || state?.scrollToFilters) return;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
        });
    }, [location.pathname, location.search, location.key, state?.preserveScroll, state?.scrollToFilters]);

    return null;
}