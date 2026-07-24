import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import {
    Header,
} from './components/Header';

import {
    Footer,
} from './components/Footer';

import {
    Home,
} from './pages/Home';

import {
    AboutPage,
} from './pages/AboutPage';

import {
    EquipmentPage,
} from './pages/EquipmentPage';

import {
    ContactPage,
} from './pages/ContactPage';

import {
    ProductPage,
} from './pages/ProductPage';

import {
    NewsPage,
} from './pages/NewsPage';

import {
    NewsDetailPage,
} from './pages/NewsDetailPage';

import {
    CartPage,
} from './pages/CartPage';

import {
    ResponsivePageWrapper,
} from './components/ResponsivePageWrapper';

import {
    Toaster,
} from './components/ui/sonner';

import {
    ScrollManager,
} from './components/ScrollManager';

import {
    MetrikaRouteTracker,
} from './components/MetrikaRouteTracker';

import {
    LeadRequestModal,
} from './components/LeadRequestModal';

import {
    LeadModalProvider,
    useLeadModal,
} from './contexts/LeadModalContext';

import {
    CartProvider,
} from './contexts/CartContext';

import SeoHead from './components/SeoHead';

function GlobalLeadModal() {
    const {
        open,
        setOpen,
        mode,
        productTitle,
    } = useLeadModal();

    return (
        <LeadRequestModal
            open={open}
            onOpenChange={
                setOpen
            }
            mode={mode}
            productTitle={
                productTitle
            }
        />
    );
}

export default function App() {
    return (
        <LeadModalProvider>
            <CartProvider>
                <Router>
                    <ScrollManager />

                    <MetrikaRouteTracker />

                    <div className="min-h-screen flex flex-col">
                        <Header />

                        <main className="flex-grow">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <>
                                                    <SeoHead />

                                                    <Home />
                                                </>
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/about"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <AboutPage />
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/catalog"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <EquipmentPage />
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/catalog/:slug"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <ProductPage />
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/news"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <NewsPage />
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/news/:slug"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <NewsDetailPage />
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path="/contact"
                                    element={
                                        <ResponsivePageWrapper
                                            desktop={
                                                <ContactPage />
                                            }
                                        />
                                    }
                                />

                            </Routes>

                            <GlobalLeadModal />
                        </main>

                        <Footer />
                    </div>

                    <Toaster />
                </Router>
            </CartProvider>
        </LeadModalProvider>
    );
}