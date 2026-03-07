import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import './Checkout.css';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);
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

    const shippingCost = cartTotal >= 50 ? 0 : 5.90;
    const taxes = (cartTotal + shippingCost) * 0.14975;
    const totalWithTaxes = cartTotal + shippingCost + taxes;

    if (cartItems.length === 0 && !orderComplete) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            // Simulation du traitement de la commande
            setOrderId(Date.now().toString().slice(-8));
            setOrderComplete(true);
            clearCart();
        }
    };

    if (orderComplete) {
        return (
            <main className="checkout-success">
                <div className="container text-center">
                    <div className="success-icon">✓</div>
                    <h1>Commande confirmée !</h1>
                    <p className="success-message">
                        Merci pour votre commande ! Vous recevrez un email de confirmation
                        à l'adresse <strong>{formData.email}</strong>.
                    </p>
                    <div className="success-details">
                        <p>Numéro de commande: <strong>#NF{orderId}</strong></p>
                        <p>Livraison estimée: <strong>2-3 jours ouvrés</strong></p>
                    </div>
                    <Link to="/" className="btn btn-primary btn-lg">
                        Retour à l'accueil
                    </Link>
                </div>
            </main>
        );
    }

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
                                    <div className="card-form">
                                        <div className="form-group">
                                            <label className="form-label">Numéro de carte</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Date d'expiration</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="MM/AA"
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="123"
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="form-buttons">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                        ← Retour
                                    </button>
                                    <button type="submit" className="btn btn-green btn-lg">
                                        Payer {totalWithTaxes.toFixed(2)} $CAD
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
