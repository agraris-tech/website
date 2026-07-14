import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ContactPage } from './pages/ContactPage';
import { ProductPage } from './pages/ProductPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ResponsivePageWrapper } from './components/ResponsivePageWrapper';
import { CartPage } from './pages/CartPage';
import { Toaster } from './components/ui/sonner';
import { ScrollManager } from './components/ScrollManager';
import { LeadRequestModal } from './components/LeadRequestModal';
import {
    LeadModalProvider,
    useLeadModal,
} from './contexts/LeadModalContext';
import { CartProvider } from './contexts/CartContext';
import SeoHead from "./components/SeoHead";

// Временно убираем, пока не проверим его содержимое.
// import SeoHead from './components/SeoHead';

function GlobalLeadModal() {
    const { open, setOpen, mode, productTitle } = useLeadModal();
    const { id } = useParams();

    return (
        <LeadRequestModal
            open={open}
            onOpenChange={setOpen}
            mode={mode}
            productTitle={productTitle}
        />
    );
}

export default function App() {
    return (
        <HelmetProvider>
            <LeadModalProvider>
                <CartProvider>
                    <Router>
                        <ScrollManager />

                        <div className="min-h-screen flex flex-col">
                            <Header />

                            <main className="flex-grow">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<>
                                                    <SeoHead />
                                                    <Home />
                                                </>}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/about"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<AboutPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/catalog"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<EquipmentPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/catalog/:slug"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<ProductPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/news"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<NewsPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/news/:id"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<NewsDetailPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/contact"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<ContactPage />}
                                            />
                                        }
                                    />

                                    <Route
                                        path="/cart"
                                        element={
                                            <ResponsivePageWrapper
                                                desktop={<CartPage />}
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
        </HelmetProvider>
    );
}