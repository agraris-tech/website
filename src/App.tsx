import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ContactPage } from './pages/ContactPage';
import { ProductPage } from './pages/ProductPage';
import { ResponsivePageWrapper } from './components/ResponsivePageWrapper';
import { MobileHomePage } from './pages/mobile/MobileHomePage';
import { MobileAboutPage } from './pages/mobile/MobileAboutPage';
import { MobileEquipmentPage } from './pages/mobile/MobileEquipmentPage';
import { MobileContactPage } from './pages/mobile/MobileContactPage';
import { MobileProductPage } from './pages/mobile/MobileProductPage';
import { TabletHomePage } from './pages/tablet/TabletHomePage';
import { TabletAboutPage } from './pages/tablet/TabletAboutPage';
import { TabletEquipmentPage } from './pages/tablet/TabletEquipmentPage';
import { TabletContactPage } from './pages/tablet/TabletContactPage';
import { TabletProductPage } from './pages/tablet/TabletProductPage';
import { CartPage } from './pages/CartPage';
import { MobileCartPage } from './pages/mobile/MobileCartPage';
import { TabletCartPage } from './pages/tablet/TabletCartPage';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<Home />} 
                    tablet={<TabletHomePage />}
                    mobile={<MobileHomePage />}
                  />
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<AboutPage />}
                    tablet={<TabletAboutPage />}
                    mobile={<MobileAboutPage />}
                  />
                } 
              />
              <Route 
                path="/equipment" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<EquipmentPage />}
                    tablet={<TabletEquipmentPage />}
                    mobile={<MobileEquipmentPage />}
                  />
                } 
              />
              <Route 
                path="/equipment/:id" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<ProductPage />}
                    tablet={<TabletProductPage />}
                    mobile={<MobileProductPage />}
                  />
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<ContactPage />}
                    tablet={<TabletContactPage />}
                    mobile={<MobileContactPage />}
                  />
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ResponsivePageWrapper 
                    desktop={<CartPage />}
                    tablet={<TabletCartPage />}
                    mobile={<MobileCartPage />}
                  />
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </CartProvider>
  );
}