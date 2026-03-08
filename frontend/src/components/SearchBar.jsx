import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products.service';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import '../styles/SearchBar.css';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch products based on debounced term
    const { data, isLoading } = useQuery({
        queryKey: ['products', 'search', debouncedTerm],
        queryFn: () => getProducts({ search: debouncedTerm, limit: 5 }),
        enabled: debouncedTerm.length > 2,
    });

    const products = data?.results || [];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleProductClick = (id) => {
        setIsOpen(false);
        setSearchTerm('');
        navigate(`/produit/${id}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsOpen(false);
            navigate(`/boutique?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <form className="search-form" onSubmit={handleSubmit}>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Chercher un plat..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => { if (searchTerm.length > 2) setIsOpen(true); }}
                />
            </form>

            <AnimatePresence>
                {isOpen && debouncedTerm.length > 2 && (
                    <motion.div
                        className="search-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isLoading ? (
                            <div className="search-loading">Recherche en cours...</div>
                        ) : products.length > 0 ? (
                            <ul className="search-results">
                                {products.map((product) => (
                                    <li key={product.id} onClick={() => handleProductClick(product.id)}>
                                        <img
                                            src={product.images[0]?.image || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="search-result-img"
                                        />
                                        <div className="search-result-info">
                                            <span className="search-result-name">{product.name}</span>
                                            <span className="search-result-price">{product.price} $CAD</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="search-no-results">Aucun produit trouvé.</div>
                        )}

                        {products.length > 0 && (
                            <button className="search-view-all" onClick={handleSubmit}>
                                Voir tous les résultats
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
