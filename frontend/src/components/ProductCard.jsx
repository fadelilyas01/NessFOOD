
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/useCart';
import { toast } from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

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
                    <img
                        src={product.primary_image || product.image_url || product.image || 'https://placehold.co/400x300?text=Produit'}
                        alt={product.name}
                        className="product-image"
                    />
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
