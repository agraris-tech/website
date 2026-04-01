import { ReactNode, useEffect } from 'react';
import { PageLoader } from './PageLoader';

type PageWrapperProps = {
    loading?: boolean;
    children?: ReactNode;
};

export function PageWrapper({ loading = false, children }: PageWrapperProps) {
    useEffect(() => {
        document.body.style.overflow = loading ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [loading]);

    return (
        <>
            {children ?? null}
            {loading && <PageLoader />}
        </>
    );
}