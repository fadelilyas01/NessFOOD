import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useCart } from '../context/useCart';
import { useWishlist } from '../context/useWishlist';
import { toast } from 'react-hot-toast';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imgState, setImgState] = useState('loading'); // 'loading', 'loaded', 'error'

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const result = await addToCart(product, 1);
        if (result.success) {
            toast.success(`${product.name} ajouté au panier !`);
        } else {
            toast.error('Erreur lors de l\'ajout au panier');
        }
    };

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
        >
            <Link to={`/produit/${product.id}`} className="product-link">
                <div className="product-image-container">
                    {imgState === 'loading' && (
                        <div className="product-image-skeleton shimmer"></div>
                    )}
                    {imgState === 'error' ? (
                        <div className="product-image-fallback">
                            <span>Ness Food</span>
                        </div>
                    ) : (
                        <img
                            src={product.primary_image || product.image_url || product.image || 'https://placehold.co/400x300?text=Indisponible'}
                            alt={product.name}
                            className={`product-image ${imgState === 'loaded' ? 'visible' : 'hidden'}`}
                            onLoad={() => setImgState('loaded')}
                            onError={() => setImgState('error')}
                        />
                    )}
                    <div className="product-tags-container" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {product.tags && product.tags.map(tag => (
                            <span key={tag.id} className="badge" style={{ backgroundColor: tag.color || '#var(--color-primary)' }}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                    <motion.div
                        className="product-overlay"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    >
                        <button
                            className="quick-add-btn"
                            onClick={handleAddToCart}
                        >
                            Ajouter au panier
                        </button>
                        <button
                            className={`wishlist-add-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                            }}
                            title="Ajouter aux favoris"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </motion.div>
                </div>

                <div className="product-info">
                    <div className="product-header">
                        <h3 className="product-title">{product.name}</h3>
                        <span className="product-price">{product.price} $CAD</span>
                    </div>

                    <p className="product-description">
                        {(product.short_description || product.description || '').substring(0, 60)}...
                    </p>

                    <div className="product-footer">
                        <div className="rating">
                            {'⭐'.repeat(Math.round(product.average_rating || 5))}
                            <span className="rating-count">({product.average_rating ? `${product.average_rating}/5` : 'Nouveau'})</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
