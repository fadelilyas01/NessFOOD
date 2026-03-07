import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import './Cart.css';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="cart-empty">
                <div className="container text-center">
                    <div className="empty-icon">🛒</div>
                    <h1>Votre panier est vide</h1>
                    <p>Découvrez nos délicieux produits et commencez vos achats !</p>
                    <Link to="/boutique" className="btn btn-primary btn-lg">
                        Découvrir nos produits
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                <h1>Mon Panier</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id || item.product_id} className="cart-item">
                                <Link to={`/produit/${item.product_id || item.id}`} className="cart-item-image">
                                    <img src={item.image || item.product?.image} alt={item.name || item.product_name} />
                                </Link>

                                <div className="cart-item-info">
                                    <Link to={`/produit/${item.product_id || item.id}`} className="cart-item-name">
                                        {item.name || item.product_name || item.product?.name}
                                    </Link>
                                    <p className="cart-item-weight">{item.weight || item.product?.weight || item.product_weight}</p>
                                    <div className="cart-item-badges">
                                        {(item.badges || item.product?.badges || []).slice(0, 2).map((badge, index) => (
                                            <span key={index} className="badge badge-green">{badge}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="cart-item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id || item.product_id, (item.quantity) - 1)}
                                        aria-label="Diminuer la quantité"
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id || item.product_id, (item.quantity) + 1)}
                                        aria-label="Augmenter la quantité"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-price">
                                    {((item.price || item.product_price || item.product?.price || 0) * item.quantity).toFixed(2)} $CAD
                                </div>

                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id || item.product_id)}
                                    aria-label="Supprimer du panier"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}

                        <button className="clear-cart-btn" onClick={clearCart}>
                            Vider le panier
                        </button>
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h2>Récapitulatif</h2>

                        <div className="summary-row">
                            <span>Sous-total</span>
                            <span>{cartTotal.toFixed(2)} $CAD</span>
                        </div>
                        <div className="summary-row">
                            <span>Livraison</span>
                            <span>{cartTotal >= 50 ? 'Gratuite' : '5.90 $CAD'}</span>
                        </div>

                        {/* Tax Calculations */}
                        <div className="summary-row tax-row">
                            <span>TPS (5%)</span>
                            <span>{(cartTotal * 0.05).toFixed(2)} $CAD</span>
                        </div>
                        <div className="summary-row tax-row">
                            <span>TVQ (9.975%)</span>
                            <span>{(cartTotal * 0.09975).toFixed(2)} $CAD</span>
                        </div>

                        {cartTotal < 50 ? (
                            <div className="shipping-progress">
                                <div className="progress-text">
                                    Plus que <strong>{(50 - cartTotal).toFixed(2)} $</strong> pour la livraison gratuite !
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="shipping-success">
                                🎉 Livraison gratuite débloquée !
                            </div>
                        )}
                        <div className="summary-total">
                            <span>Total (TTC)</span>
                            <span>{(
                                cartTotal * 1.14975 + (cartTotal >= 50 ? 0 : 5.90)
                            ).toFixed(2)} $CAD</span>
                        </div>

                        <Link to="/paiement" className="btn btn-primary btn-lg full-width">
                            Passer la commande
                        </Link>

                        <div className="payment-methods">
                            <p>Paiement 100% sécurisé</p>
                            <div className="payment-icons">
                                <span>💳</span>
                                <span>🅿️</span>
                                <span>🍎</span>
                            </div>
                        </div>

                        <Link to="/boutique" className="continue-shopping">
                            ← Continuer mes achats
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
