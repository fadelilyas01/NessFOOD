import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { ThemeProvider } from './context/ThemeProvider';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import './index.css';

import { FAQ, Shipping, Returns, Legal, Privacy, Terms } from './pages/InfoPages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--color-black)',
                      color: 'var(--color-white)',
                      boxShadow: 'var(--shadow-lg)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                    },
                    success: {
                      iconTheme: {
                        primary: 'var(--color-green)',
                        secondary: 'var(--color-white)',
                      },
                    },
                  }}
                />
                <div className="app">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/boutique" element={<Shop />} />
                    <Route path="/produit/:id" element={<ProductDetail />} />
                    <Route path="/panier" element={<Cart />} />
                    <Route path="/favoris" element={<Wishlist />} />
                    <Route path="/paiement" element={<Checkout />} />
                    <Route path="/paiement/succes" element={<PaymentSuccess />} />
                    <Route path="/paiement/annule" element={<PaymentCancel />} />
                    <Route path="/a-propos" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />
                    <Route path="/profil" element={<Profile />} />
                    <Route path="/commandes" element={<OrderHistory />} />

                    {/* Info Pages */}
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/livraison" element={<Shipping />} />
                    <Route path="/retours" element={<Returns />} />
                    <Route path="/mentions-legales" element={<Legal />} />
                    <Route path="/confidentialite" element={<Privacy />} />
                    <Route path="/cgv" element={<Terms />} />
                  </Routes>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;
