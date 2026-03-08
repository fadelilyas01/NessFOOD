import { useState, useCallback } from 'react';
import * as api from '../services/api';
import { ProductsContext } from './useProducts';

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        count: 0,
    });

    const loadProducts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.getProducts(params);

            // Handle paginated response
            if (data.results) {
                setProducts(data.results);
                setPagination({
                    page: params.page || 1,
                    totalPages: Math.ceil(data.count / 12),
                    count: data.count,
                });
            } else if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadFeaturedProducts = useCallback(async () => {
        try {
            const data = await api.getFeaturedProducts();
            setFeaturedProducts(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Failed to load featured products:', err);
        }
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    }, []);

    const getProduct = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.getProduct(id);
            return data;
        } catch {
            setError('Produit non trouvé');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        products,
        featuredProducts,
        categories,
        loading,
        error,
        pagination,
        loadProducts,
        loadFeaturedProducts,
        loadCategories,
        getProduct,
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}
