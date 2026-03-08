import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../styles/Checkout.css';

export default function Checkout() {
    const { cartItems, cartTotal } = useCart();
    const location = useLocation();
    const appliedCoupon = location.state?.appliedCoupon || null;

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        paymentMethod: 'card'
    });

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
    const totalWithTaxes = subtotalAfterDiscount + shippingCost + taxes;

    if (cartItems.length === 0) {
        return (
            <main className="checkout-empty">
                <div className="container text-center">
                    <h1>Votre panier est vide</h1>
                    <p>Ajoutez des produits avant de passer commande.</p>
                    <Link to="/boutique" className="btn btn-primary">
                        Voir nos produits
                    </Link>
                </div>
            </main>
        );
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            if (formData.paymentMethod !== 'card') {
                toast.error('Seuls les paiements par carte sont supportés pour le moment.');
                return;
            }
            setIsProcessing(true);
            try {
                const token = localStorage.getItem('token');

                // 1. Create order
                const orderData = {
                    shipping_name: `${formData.firstName} ${formData.lastName}`,
                    shipping_email: formData.email,
                    shipping_phone: formData.phone,
                    shipping_address: formData.address,
                    shipping_city: formData.city,
                    shipping_postal_code: formData.postalCode,
                    shipping_country: 'Canada',
                    coupon_code: appliedCoupon?.code || null,
                };

                const orderRes = await axios.post('http://localhost:8000/api/orders/create/', orderData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const orderNumber = orderRes.data.order.order_number;

                // 2. Init Stripe Checkout
                const checkoutRes = await axios.post('http://localhost:8000/api/payments/checkout/',
                    { order_number: orderNumber },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // 3. Redirect to Stripe
                if (checkoutRes.data.checkout_url) {
                    window.location.href = checkoutRes.data.checkout_url;
                } else {
                    toast.error('Erreur lors de l\'initialisation du paiement');
                    setIsProcessing(false);
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    toast.error("Veuillez vous connecter pour procéder au paiement.");
                } else {
                    toast.error(err.response?.data?.error || 'Une erreur est survenue lors de la validation de la commande.');
                }
                setIsProcessing(false);
            }
        }
    };

    // Removed local orderComplete render because it's handled by PaymentSuccess.jsx

    return (
        <main className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <Link to="/panier" className="back-link">← Retour au panier</Link>
                    <h1>Finaliser la commande</h1>
                </div>

                {/* Étapes de progression */}
                <div className="checkout-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Livraison</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Paiement</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    {/* Formulaire */}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="form-section">
                                <h2>Informations de livraison</h2>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="firstName">Prénom *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            className="form-input"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="lastName">Nom *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            className="form-input"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="address">Adresse *</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="form-input"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="123 Rue Example"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="city">Ville *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="form-input"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="postalCode">Code postal *</label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            className="form-input"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">Téléphone *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+1 514 123 4567"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg full-width">
                                    Continuer vers le paiement
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-section">
                                <h2>Mode de paiement</h2>

                                <div className="payment-options">
                                    <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="payment-icon">💳</span>
                                        <span>Carte bancaire</span>
                                    </label>
                                    <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={formData.paymentMethod === 'paypal'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="payment-icon">🅿️</span>
                                        <span>PayPal</span>
                                    </label>
                                </div>

                                {formData.paymentMethod === 'card' && (
                                    <div className="card-form-notification" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-gray-light)', borderRadius: 'var(--radius-sm)' }}>
                                        <p style={{ margin: 0, color: 'var(--color-gray-dark)' }}>
                                            ℹ️ Vous allez être redirigé vers <strong>Stripe</strong> pour un paiement sécurisé. (Les paiements via Apple Pay et Google Pay sont également supportés).
                                        </p>
                                    </div>
                                )}

                                <div className="form-buttons">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={isProcessing}>
                                        ← Retour
                                    </button>
                                    <button type="submit" className="btn btn-green btn-lg" disabled={isProcessing}>
                                        {isProcessing ? 'Redirection...' : `Payer ${totalWithTaxes.toFixed(2)} $CAD`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Résumé de la commande */}
                    <div className="order-summary">
                        <h2>Votre commande</h2>

                        <div className="order-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="order-item-image">
                                        <img src={item.image} alt={item.name} />
                                        <span className="order-item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.name}</span>
                                        <span className="order-item-weight">{item.weight}</span>
                                    </div>
                                    <span className="order-item-price">
                                        {(item.price * item.quantity).toFixed(2)} $CAD
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="order-row">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} $CAD</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="order-row" style={{ color: 'var(--color-green)' }}>
                                    <span>Remise</span>
                                    <span>-{discountAmount.toFixed(2)} $CAD</span>
                                </div>
                            )}
                            <div className="order-row">
                                <span>Livraison</span>
                                <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} $CAD`}</span>
                            </div>
                            <div className="order-row">
                                <span>Taxes (TPS+TVQ)</span>
                                <span>{taxes.toFixed(2)} $CAD</span>
                            </div>
                            <div className="order-row total">
                                <span>Total</span>
                                <span>{totalWithTaxes.toFixed(2)} $CAD</span>
                            </div>
                        </div>

                        <div className="secure-badge">
                            🔒 Paiement 100% sécurisé
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
