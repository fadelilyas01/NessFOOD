import { useState } from 'react';
import '../styles/Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <main className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Contactez-nous</h1>
                    <p>Une question ? Nous sommes là pour vous aider !</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            {submitted ? (
                                <div className="form-success">
                                    <div className="success-icon">✓</div>
                                    <h2>Message envoyé !</h2>
                                    <p>
                                        Merci pour votre message. Notre équipe vous répondra
                                        dans les plus brefs délais.
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({ name: '', email: '', subject: '', message: '' });
                                        }}
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2>Envoyez-nous un message</h2>
                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">Nom complet *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="form-input"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="email">Email *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-input"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="subject">Sujet *</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                className="form-input"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Choisir un sujet</option>
                                                <option value="commande">Question sur une commande</option>
                                                <option value="produit">Information produit</option>
                                                <option value="livraison">Livraison</option>
                                                <option value="partenariat">Partenariat</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="message">Message *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                className="form-input form-textarea"
                                                rows="6"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder="Écrivez votre message ici..."
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            Envoyer le message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <div className="info-card">
                                <h3>Informations de contact</h3>
                                <ul className="contact-details">
                                    <li>
                                        <span className="contact-icon">📧</span>
                                        <div>
                                            <strong>Email</strong>
                                            <a href="mailto:contact@nessfood.com">contact@nessfood.com</a>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="contact-icon">📞</span>
                                        <div>
                                            <strong>Téléphone</strong>
                                            <a href="tel:+16138840638">+1 613 884-0638</a>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="contact-icon">📍</span>
                                        <div>
                                            <strong>Adresse</strong>
                                            <span>Québec, Canada</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="contact-icon">🕐</span>
                                        <div>
                                            <strong>Horaires</strong>
                                            <span>Lun - Ven: 9h - 18h<br />Sam: 10h - 16h</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="social-card">
                                <h3>Suivez-nous</h3>
                                <p>Restez connecté pour les dernières nouvelles et offres exclusives</p>
                                <div className="social-buttons">
                                    <a href="#" className="social-btn" aria-label="Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="social-btn" aria-label="Instagram">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    </a>
                                    <a href="#" className="social-btn" aria-label="WhatsApp">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="social-btn" aria-label="TikTok">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="faq-link-card">
                                <h3>Questions fréquentes ?</h3>
                                <p>Consultez notre FAQ pour des réponses rapides aux questions les plus courantes.</p>
                                <a href="/faq" className="btn btn-secondary">
                                    Voir la FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
