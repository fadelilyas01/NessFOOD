import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { WishlistContext } from './useWishlist';

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
        if (isAlreadyInWishlist) {
            toast('Déjà dans vos favoris', { icon: 'ℹ️' });
            return;
        }

        setWishlist([...wishlist, product]);
        toast.success(`${product.name} ajouté aux favoris`);
    };

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId));
        toast.success('Retiré des favoris');
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
