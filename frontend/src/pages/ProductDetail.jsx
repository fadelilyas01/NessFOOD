import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useProductQuery } from '../hooks/useProductsQuery';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Fetch Product Data
    const { data: product, isLoading: loading } = useProductQuery(id);
    const relatedProducts = product?.related_products || [];

    // State
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (id) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            setQuantity(1);
            setActiveImage(0);
        }
    }, [id]);

    if (loading) {
        return (
            <main className="product-detail" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-not-found">
                <div className="container text-center">
                    <h1>Produit non trouvé</h1>
                    <p>Ce produit n'existe pas ou a été supprimé.</p>
                    <Link to="/boutique" className="btn btn-primary">
                        Retour à la boutique
                    </Link>
                </div>
            </main>
        );
    }

    // Format data from API to UI
    const images = product.images && product.images.length > 0
        ? product.images.map(img => img.image)
        : [product.image || 'https://placehold.co/600x600?text=No+Image'];

    // Use nutrition_info from snake_case API
    const nutrition = product.nutrition_info || {};

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/panier');
    };

    return (
        <main className="product-detail">
            {/* Notification */}
            {showNotification && (
                <div className="cart-notification">
                    <span>✓</span> Produit ajouté au panier !
                    <Link to="/panier">Voir le panier</Link>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Accueil</Link>
                    <span>/</span>
                    <Link to="/boutique">Boutique</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>
            </div>

            {/* Product Content */}
            <section className="product-content section">
                <div className="container">
                    <div className="product-grid">
                        {/* Gallery */}
                        <div className="product-gallery">
                            <div className="gallery-main">
                                <img
                                    src={images[activeImage]}
                                    alt={product.name}
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="gallery-thumbs">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`gallery-thumb ${index === activeImage ? 'active' : ''}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img src={img} alt={`${product.name} ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="product-info">
                            <div className="product-badges-detail">
                                {product.tags && product.tags.map((tag) => (
                                    <span key={tag.id} className="badge" style={{ backgroundColor: tag.color || '#var(--color-primary)' }}>{tag.name}</span>
                                ))}
                            </div>

                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-price-detail" style={{ margin: '1rem 0' }}>
                                <span className="price-current" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{Number(product.price).toFixed(2)} $CAD</span>
                                {product.original_price && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                        <span className="price-original" style={{ textDecoration: 'line-through', color: '#888' }}>{Number(product.original_price).toFixed(2)} $CAD</span>
                                        <span className="discount-badge" style={{ backgroundColor: '#e11d48', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>-{product.discount_percentage}%</span>
                                    </div>
                                )}
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                                    <span className="price-weight">Poids: {product.weight}</span> •
                                    <span className="stock-status" style={{ marginLeft: '0.5rem', color: product.in_stock ? 'var(--color-green)' : '#e11d48', fontWeight: 600 }}>{product.in_stock ? 'En stock' : 'Rupture de stock'}</span>
                                </div>
                                <div className="product-rating-summary" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className="stars" style={{ color: '#f59e0b', fontSize: '1.2rem' }}>
                                        {'★'.repeat(Math.round(product.average_rating || 5))}{'☆'.repeat(5 - Math.round(product.average_rating || 5))}
                                    </div>
                                    <a href="#avis" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'underline' }}>({product.reviews?.length || 0} avis)</a>
                                </div>
                            </div>

                            <div className="product-description-text">
                                {product.description.split('\n').map((para, index) => (
                                    <p key={index}>{para}</p>
                                ))}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}>
                                        +
                                    </button>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                    Ajouter au panier
                                </button>
                            </div>

                            <button className="btn btn-green btn-lg full-width" onClick={handleBuyNow}>
                                Acheter maintenant
                            </button>

                            {/* Product Meta */}
                            <div className="product-meta">
                                <div className="meta-item">
                                    <span className="meta-icon">🚚</span>
                                    <div>
                                        <strong>Livraison rapide</strong>
                                        <p>Expédié sous 24h</p>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-icon">❄️</span>
                                    <div>
                                        <strong>Conservation</strong>
                                        <p>12 mois au congélateur</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructions Section */}
            {product.instructions && (
                <section className="product-instructions section bg-white">
                    <div className="container">
                        <div className="instructions-grid">
                            <div className="instructions-content">
                                <h2>Instructions de préparation</h2>
                                <div className="instructions-text">
                                    {product.instructions.split('\n').map((para, index) => (
                                        <p key={index}>{para}</p>
                                    ))}
                                </div>
                            </div>
                            {Object.keys(nutrition).length > 0 && (
                                <div className="nutrition-card">
                                    <h3>Valeurs nutritionnelles</h3>
                                    <p className="nutrition-subtitle">Pour 100g</p>
                                    <ul className="nutrition-list">
                                        {Object.entries(nutrition).map(([key, value]) => (
                                            <li key={key}>
                                                <span style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>
                                                <span>{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section className="product-reviews section">
                <div className="container">
                    <h2>Avis clients ({product.reviews?.length || 0})</h2>
                    <div className="reviews-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map(review => (
                                <div key={review.id} className="review-card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0, fontWeight: 600 }}>{review.user_name || 'Client régulier'}</h4>
                                        <div className="stars" style={{ color: '#f59e0b' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(review.created_at).toLocaleDateString('fr-CA')}</span>
                                    {review.comment && <p style={{ marginTop: '0.5rem', color: '#444' }}>{review.comment}</p>}
                                </div>
                            ))
                        ) : (
                            <div className="no-reviews" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'center', borderRadius: '8px' }}>
                                <p>Aucun avis pour l'instant. Soyez le premier à donner votre avis après achat !</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Similar Products Section */}
            {relatedProducts.length > 0 && (
                <section className="similar-products section">
                    <div className="container">
                        <h2>Vous aimerez aussi</h2>
                        <div className="products-grid">
                            {relatedProducts.map(related => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
