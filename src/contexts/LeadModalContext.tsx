import { createContext, useContext, useState, PropsWithChildren } from 'react';

type LeadMode = 'callback' | 'product_offer';

type LeadModalContextType = {
    open: boolean;
    mode: LeadMode;
    productTitle: string;
    openCallback: () => void;
    openProductOffer: (productTitle: string) => void;
    closeModal: () => void;
    setOpen: (open: boolean) => void;
};

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<LeadMode>('callback');
    const [productTitle, setProductTitle] = useState('');

    const openCallback = () => {
        setMode('callback');
        setProductTitle('');
        setOpen(true);
    };

    const openProductOffer = (title: string) => {
        setMode('product_offer');
        setProductTitle(title);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <LeadModalContext.Provider
            value={{
                open,
                mode,
                productTitle,
                openCallback,
                openProductOffer,
                closeModal,
                setOpen,
            }}
        >
            {children}
        </LeadModalContext.Provider>
    );
}

export function useLeadModal() {
    const context = useContext(LeadModalContext);

    if (!context) {
        throw new Error('useLeadModal must be used within LeadModalProvider');
    }

    return context;
}