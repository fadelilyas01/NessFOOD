import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPaymentSuccess } from '../services/paymentService';
import { useCart } from '../context/useCart';
import './PaymentResult.css';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { clearCart } = useCart();

    useEffect(() => {
        const loadOrder = async () => {
            const orderNumber = searchParams.get('order');
            const sessionId = searchParams.get('session_id');

            if (orderNumber) {
                try {
                    const data = await getPaymentSuccess(orderNumber, sessionId);
                    if (data.order) {
                        setOrder(data.order);
                        clearCart();
                    }
                } catch (error) {
                    console.error('Failed to load order:', error);
                }
            }
            setLoading(false);
        };

        loadOrder();
    }, [searchParams, clearCart]);

    if (loading) {
        return (
            <main className="payment-result-page">
                <div className="container">
                    <div className="result-card loading">
                        <div className="spinner"></div>
                        <p>Vérification du paiement...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="payment-result-page success">
            <div className="container">
                <div className="result-card">
                    <div className="result-icon success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>

                    <h1>Paiement réussi !</h1>
                    <p className="result-subtitle">
                        Merci pour votre commande. Un email de confirmation vous a été envoyé.
                    </p>

                    {order && (
                        <div className="order-details">
                            <div className="order-row">
                                <span>Numéro de commande</span>
                                <strong>#{order.order_number}</strong>
                            </div>
                            <div className="order-row">
                                <span>Total payé</span>
                                <strong>{parseFloat(order.total).toFixed(2)} $CAD</strong>
                            </div>
                            <div className="order-row">
                                <span>Livraison estimée</span>
                                <strong>2-3 jours ouvrés</strong>
                            </div>
                        </div>
                    )}

                    <div className="result-actions">
                        <Link to="/" className="btn btn-primary">
                            Retour à l'accueil
                        </Link>
                        <Link to="/boutique" className="btn btn-secondary">
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
