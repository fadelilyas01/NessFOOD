import { Link, useSearchParams } from 'react-router-dom';
import '../styles/PaymentResult.css';

export default function PaymentCancel() {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('order');

    return (
        <main className="payment-result-page cancel">
            <div className="container">
                <div className="result-card">
                    <div className="result-icon cancel-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </div>

                    <h1>Paiement annulé</h1>
                    <p className="result-subtitle">
                        Votre paiement a été annulé. Aucun montant n'a été débité.
                    </p>

                    {orderNumber && (
                        <p className="order-ref">
                            Commande #{orderNumber}
                        </p>
                    )}

                    <div className="result-actions">
                        <Link to="/panier" className="btn btn-primary">
                            Retour au panier
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
