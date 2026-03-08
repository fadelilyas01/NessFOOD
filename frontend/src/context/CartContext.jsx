import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useAuth } from './useAuth';
import { CartContext } from './useCart';



export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);

    // Charger le panier depuis le backend si authentifié
    useEffect(() => {
        if (isAuthenticated) {
            loadCart();
        } else {
            // Charger depuis localStorage pour les invités
            const savedCart = localStorage.getItem('nessfood_cart');
            if (savedCart) {
                try {
                    const parsed = JSON.parse(savedCart);
                    setCartItems(parsed);
                    calculateTotal(parsed);
                } catch {
                    setCartItems([]);
                }
            }
        }
    }, [isAuthenticated, loadCart]);

    // Sauvegarder dans localStorage si non authentifié
    useEffect(() => {
        if (!isAuthenticated && cartItems.length > 0) {
            localStorage.setItem('nessfood_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    const loadCart = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            const data = await api.getCart();
            const items = data.items || [];
            setCartItems(items);
            setCartTotal(parseFloat(data.total) || 0);
            setShippingCost(parseFloat(data.shipping_cost) || 0);
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            const price = item.product_price || item.price || 0;
            return sum + (price * item.quantity);
        }, 0);
        setCartTotal(total);
        setShippingCost(total >= 35 ? 0 : 4.99);
    };

    const addToCart = useCallback(async (product, quantity = 1) => {
        if (isAuthenticated) {
            // Utiliser l'API backend
            setLoading(true);
            try {
                const data = await api.addToCart(product.id, quantity);
                if (data.cart) {
                    setCartItems(data.cart.items || []);
                    setCartTotal(parseFloat(data.cart.total) || 0);
                    setShippingCost(parseFloat(data.cart.shipping_cost) || 0);
                }
                return { success: true };
            } catch (error) {
                console.error('Failed to add to cart:', error);
                return { success: false, error: 'Erreur lors de l\'ajout au panier' };
            } finally {
                setLoading(false);
            }
        } else {
            // Panier invité (localStorage)
            setCartItems(prevItems => {
                const existingIndex = prevItems.findIndex(item => item.id === product.id);
                let newItems;

                if (existingIndex >= 0) {
                    newItems = prevItems.map((item, index) =>
                        index === existingIndex
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    newItems = [...prevItems, {
                        ...product,
                        quantity,
                        product_id: product.id,
                        product_name: product.name,
                        product_price: product.price,
                        product_image: product.image,
                    }];
                }

                calculateTotal(newItems);
                return newItems;
            });
            return { success: true };
        }
    }, [isAuthenticated]);

    const removeFromCart = useCallback(async (itemId) => {
        if (isAuthenticated) {
            setLoading(true);
            try {
                const data = await api.removeCartItem(itemId);
                if (data.cart) {
                    setCartItems(data.cart.items || []);
                    setCartTotal(parseFloat(data.cart.total) || 0);
                    setShippingCost(parseFloat(data.cart.shipping_cost) || 0);
                }
            } catch (error) {
                console.error('Failed to remove item:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setCartItems(prevItems => {
                const newItems = prevItems.filter(item =>
                    item.id !== itemId && item.product_id !== itemId
                );
                calculateTotal(newItems);
                return newItems;
            });
        }
    }, [isAuthenticated]);

    const updateQuantity = useCallback(async (itemId, quantity) => {
        if (quantity < 1) {
            return removeFromCart(itemId);
        }

        if (isAuthenticated) {
            setLoading(true);
            try {
                const data = await api.updateCartItem(itemId, quantity);
                if (data.cart) {
                    setCartItems(data.cart.items || []);
                    setCartTotal(parseFloat(data.cart.total) || 0);
                    setShippingCost(parseFloat(data.cart.shipping_cost) || 0);
                }
            } catch (error) {
                console.error('Failed to update quantity:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setCartItems(prevItems => {
                const newItems = prevItems.map(item =>
                    (item.id === itemId || item.product_id === itemId)
                        ? { ...item, quantity }
                        : item
                );
                calculateTotal(newItems);
                return newItems;
            });
        }
    }, [isAuthenticated, removeFromCart]);

    const clearCart = useCallback(async () => {
        if (isAuthenticated) {
            setLoading(true);
            try {
                await api.clearCart();
                setCartItems([]);
                setCartTotal(0);
                setShippingCost(0);
            } catch (error) {
                console.error('Failed to clear cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setCartItems([]);
            setCartTotal(0);
            setShippingCost(0);
            localStorage.removeItem('nessfood_cart');
        }
    }, [isAuthenticated]);

    // Synchroniser le panier invité vers le backend après connexion
    const syncCartToBackend = useCallback(async () => {
        const guestCart = localStorage.getItem('nessfood_cart');
        if (guestCart && isAuthenticated) {
            try {
                const items = JSON.parse(guestCart);
                for (const item of items) {
                    await api.addToCart(item.id || item.product_id, item.quantity);
                }
                localStorage.removeItem('nessfood_cart');
                await loadCart();
            } catch (error) {
                console.error('Failed to sync cart:', error);
            }
        }
    }, [isAuthenticated, loadCart]);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = cartTotal + shippingCost;

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        shippingCost,
        grandTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        syncCartToBackend,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
