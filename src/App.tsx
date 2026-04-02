import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ContactPage } from './pages/ContactPage';
import { ProductPage } from './pages/ProductPage';
import { ResponsivePageWrapper } from './components/ResponsivePageWrapper';
import { CartPage } from './pages/CartPage';
import { Toaster } from './components/ui/sonner';
import { ScrollManager } from './components/ScrollManager';
import { RouteLoader } from './components/RouteLoader';
import { LeadRequestModal } from './components/LeadRequestModal';
import { LeadModalProvider, useLeadModal } from './contexts/LeadModalContext';
import {CartProvider} from "./contexts/CartContext";
import SeoHead from "./components/SeoHead";

function GlobalLeadModal() {
    const { open, setOpen, mode, productTitle } = useLeadModal();
    console.log('GlobalLeadModal render', { open, mode, productTitle });

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
        <LeadModalProvider>
            <SeoHead />
            <CartProvider children={undefined}>
            <Router>
                <RouteLoader />
                <ScrollManager />
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ResponsivePageWrapper
                                        desktop={<Home />}
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
                                path="/equipment"
                                element={
                                    <ResponsivePageWrapper
                                        desktop={<EquipmentPage />}
                                    />
                                }
                            />
                            <Route
                                path="/equipment/:slug"
                                element={
                                    <ResponsivePageWrapper
                                        desktop={<ProductPage />}
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
    );
}