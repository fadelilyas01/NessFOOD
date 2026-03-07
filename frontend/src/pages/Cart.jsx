import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Cart.css';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

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

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8000/api/orders/validate-coupon/',
                { code: couponCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAppliedCoupon(res.data.coupon);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Code invalide.');
            setAppliedCoupon(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.info('Code promo retiré');
    };

    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.is_percentage) {
            discountAmount = (cartTotal * appliedCoupon.discount_value) / 100;
        } else {
            discountAmount = appliedCoupon.discount_value;
        }
        discountAmount = Math.min(discountAmount, cartTotal);
    }

    const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
    const shippingCost = subtotalAfterDiscount >= 50 ? 0 : 5.90;
    const taxes = (subtotalAfterDiscount + shippingCost) * 0.14975;
    const finalTotal = subtotalAfterDiscount + shippingCost + taxes;

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

                        {/* Coupon Section */}
                        <div className="cart-coupon-section" style={{ margin: '1rem 0', padding: '1rem 0', borderTop: '1px solid var(--color-gray-light)', borderBottom: '1px solid var(--color-gray-light)' }}>
                            {appliedCoupon ? (
                                <div className="applied-coupon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-green-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--color-green)' }}>Code: {appliedCoupon.code}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-green)' }}>
                                            -{appliedCoupon.is_percentage ? `${appliedCoupon.discount_value}%` : `${appliedCoupon.discount_value}$`}
                                        </span>
                                    </div>
                                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer' }}>✕</button>
                                </div>
                            ) : (
                                <div className="coupon-input-group" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Code promo"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--color-gray-light)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || isApplyingCoupon}
                                        style={{ padding: '0.5rem 1rem' }}
                                    >
                                        {isApplyingCoupon ? '...' : 'Appliquer'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {discountAmount > 0 && (
                            <div className="summary-row" style={{ color: 'var(--color-green)' }}>
                                <span>Remise</span>
                                <span>-{discountAmount.toFixed(2)} $CAD</span>
                            </div>
                        )}

                        <div className="summary-row">
                            <span>Livraison</span>
                            <span>{shippingCost === 0 ? 'Gratuite' : '5.90 $CAD'}</span>
                        </div>

                        {/* Tax Calculations */}
                        <div className="summary-row tax-row">
                            <span>TPS (5%)</span>
                            <span>{(subtotalAfterDiscount * 0.05).toFixed(2)} $CAD</span>
                        </div>
                        <div className="summary-row tax-row">
                            <span>TVQ (9.975%)</span>
                            <span>{(subtotalAfterDiscount * 0.09975).toFixed(2)} $CAD</span>
                        </div>

                        {subtotalAfterDiscount < 50 ? (
                            <div className="shipping-progress">
                                <div className="progress-text">
                                    Plus que <strong>{(50 - subtotalAfterDiscount).toFixed(2)} $</strong> pour la livraison gratuite !
                                </div>
                                <div className="progress-track" style={{ marginTop: '0.5rem' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${Math.min((subtotalAfterDiscount / 50) * 100, 100)}%` }}
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
                            <span>{finalTotal.toFixed(2)} $CAD</span>
                        </div>

                        <Link to="/paiement" state={{ appliedCoupon }} className="btn btn-primary btn-lg full-width">
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
