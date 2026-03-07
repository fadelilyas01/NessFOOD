import { Link } from 'react-router-dom';
import './InfoPages.css';

export function FAQ() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Foire Aux Questions</h1>
                <div className="info-content">
                    <div className="faq-item">
                        <h3>Quels sont les délais de livraison ?</h3>
                        <p>Nous livrons généralement sous 24 à 48 heures pour la région de Montréal et Québec, et 2 à 4 jours ouvrables pour le reste du Canada.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Comment conserver le Plakali ?</h3>
                        <p>Le Plakali se conserve au frais pendant 3 jours après réception, ou jusqu'à 6 mois au congélateur.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Le paiement est-il sécurisé ?</h3>
                        <p>Oui, nous utilisons Stripe pour traiter les paiements, garantissant une sécurité optimale (cryptage SSL).</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export function Shipping() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Livraison</h1>
                <div className="info-content">
                    <p>Nous expédions nos produits frais dans des emballages isothermes respectant la chaîne du froid.</p>
                    <h2>Zones de livraison</h2>
                    <p>Nous livrons actuellement partout au Québec, en Ontario et New-Brunswick. Pour d'autres provinces, veuillez nous contacter.</p>
                    <h2>Frais de port</h2>
                    <p>La livraison est offerte à partir de 50 $CAD d'achat avant taxes. En dessous, des frais forfaitaires de 5.90 $CAD s'appliquent.</p>
                </div>
            </div>
        </main>
    );
}

export function Returns() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Retours et Remboursements</h1>
                <div className="info-content">
                    <p>Compte tenu de la nature périssable de nos produits, nous ne pouvons pas accepter les retours alimentaires. Cependant, si votre commande arrive endommagée ou incorrecte, nous nous engageons à vous rembourser ou à remplacer les produits concernés.</p>
                    <p>Contactez notre service client sous 24h avec une photo du problème.</p>
                </div>
            </div>
        </main>
    );
}

export function Legal() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Mentions Légales</h1>
                <div className="info-content">
                    <h2>Éditeur du site</h2>
                    <p>Ness Food Inc.<br />Siège social : Québec, Canada<br />NEQ: 1234567890<br />Email : contact@nessfood.com</p>
                    <h2>Hébergement</h2>
                    <p>Ce site est hébergé par Vercel Inc.</p>
                    <h2>Propriété intellectuelle</h2>
                    <p>L'ensemble de ce site relève de la législation canadienne sur le droit d'auteur et la propriété intellectuelle.</p>
                </div>
            </div>
        </main>
    );
}

export function Privacy() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Politique de Confidentialité</h1>
                <div className="info-content">
                    <p>Nous prenons la protection de vos données très au sérieux. Les informations recueillies sur ce site sont uniquement utilisées pour le traitement de votre commande et l'amélioration de nos services.</p>
                    <p>Nous ne partageons jamais vos données avec des tiers à des fins commerciales.</p>
                    <p>Vous disposez d'un droit d'accès, de modification et de suppression de vos données personnelles.</p>
                </div>
            </div>
        </main>
    );
}

export function Terms() {
    return (
        <main className="info-page section">
            <div className="container">
                <h1>Conditions Générales de Vente (CGV)</h1>
                <div className="info-content">
                    <h2>Article 1 : Champs d'application</h2>
                    <p>Les présentes CGV s'appliquent à toutes les ventes conclues par le biais du site internet Ness Food.</p>
                    <h2>Article 2 : Commandes</h2>
                    <p>La commande est validée une fois le paiement accepté. Ness Food se réserve le droit de refuser une commande en cas de litige antérieur.</p>
                    <h2>Article 3 : Prix</h2>
                    <p>Les prix nos produits sont indiqués en Dollars Canadiens ($CAD) et n'incluent pas les taxes (TPS et TVQ) sauf indication contraire.</p>
                </div>
            </div>
        </main>
    );
}
