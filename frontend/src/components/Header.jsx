import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { useWishlist } from '../context/WishlistContext';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import './Header.css';

export default function Header() {
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setUserMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
    };

    return (
        <motion.header
            className={`header ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <motion.span
                        className="logo-icon"
                        whileHover={{ rotate: 20 }}
                    >
                        🍲
                    </motion.span>
                    <span className="logo-text">Ness Food</span>
                </Link>

                {/* Navigation */}
                <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
                    <Link to="/" className="nav-link">Accueil</Link>
                    <Link to="/boutique" className="nav-link">Boutique</Link>
                    <Link to="/a-propos" className="nav-link">À propos</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </nav>

                <SearchBar />

                {/* Actions */}
                <div className="header-actions">
                    <ThemeToggle />

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="user-menu-wrapper">
                            <motion.button
                                className="user-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="user-avatar-placeholder">
                                    {user?.first_name?.charAt(0) || 'U'}
                                </div>
                                <span className="user-name">{user?.first_name}</span>
                            </motion.button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        className="user-dropdown"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <div className="user-dropdown-header">
                                            <strong>{user?.full_name}</strong>
                                            <span>{user?.email}</span>
                                        </div>
                                        <Link to="/profil" className="dropdown-link">Mon profil</Link>
                                        <Link to="/commandes" className="dropdown-link">Mes commandes</Link>
                                        <button onClick={handleLogout} className="dropdown-link logout-btn">
                                            Déconnexion
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/connexion">
                            <motion.button
                                className="auth-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Connexion
                            </motion.button>
                        </Link>
                    )}

                    {/* Wishlist */}
                    <Link to="/favoris" className="cart-btn-wrapper">
                        <motion.div
                            className="cart-btn"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ padding: '0 5px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <AnimatePresence>
                                {wishlist.length > 0 && (
                                    <motion.span
                                        className="cart-badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        key={wishlist.length}
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>

                    {/* Cart */}
                    <Link to="/panier" className="cart-btn-wrapper">
                        <motion.div
                            className="cart-btn"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        className="cart-badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        key={cartCount}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <motion.button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
                    </motion.button>
                </div>
            </div>
        </motion.header>
    );
}
