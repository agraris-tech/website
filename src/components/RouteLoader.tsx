import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';

export function RouteLoader() {
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 350);

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    if (!visible) return null;

    return <PageLoader />;
}