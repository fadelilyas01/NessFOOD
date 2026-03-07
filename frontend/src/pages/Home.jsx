import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useProductsQuery } from '../hooks/useProductsQuery';
import './Home.css';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: featuredData, isLoading: isFeaturedLoading } = useProductsQuery({ is_featured: true });
    const { data: heroData, isLoading: isHeroLoading } = useProductsQuery({ is_hero_slider: true });

    const isLoading = isFeaturedLoading || isHeroLoading;
    const featuredProducts = featuredData?.results || [];

    // Select specific products for the hero slider
    // If not found, fallback to first 3 featured products
    const heroProducts = useMemo(() => {
        let hero = heroData?.results || [];
        if (hero.length === 0 && featuredProducts.length > 0) {
            hero = featuredProducts.slice(0, 3);
        }
        return hero;
    }, [heroData, featuredProducts]);

    // Auto-scroll slider logic (Netflix style 5s)
    useEffect(() => {
        if (heroProducts.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [heroProducts]);

    if (isLoading) {
        return (
            <main className="home">
                <section className="hero-slider" style={{ backgroundColor: 'var(--color-beige)' }}>
                    <div className="container" style={{ display: 'flex', height: '100%', alignItems: 'center', padding: '5%' }}>
                        <div style={{ width: '50%' }}>
                            <div style={{ width: '80px', marginBottom: '1rem' }}><SkeletonLoader type="badge" count={1} /></div>
                            <SkeletonLoader type="title" count={1} />
                            <div style={{ marginTop: '1rem', marginBottom: '2rem' }}><SkeletonLoader type="text" count={3} /></div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '180px' }}><SkeletonLoader type="btn" count={1} /></div>
                                <div style={{ width: '180px' }}><SkeletonLoader type="btn" count={1} /></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="featured section bg-white">
                    <div className="container">
                        <div className="products-grid">
                            <SkeletonLoader type="card" count={4} />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // Default static hero if no products found (Fallback)
    if (heroProducts.length === 0) {
        return (
            <main className="home">
                <section className="hero-fallback">
                    <div className="hero-overlay"></div>
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hero-content text-center"
                        >
                            <h1 className="hero-title-large">L'Excellence du Goût Ivoirien</h1>
                            <p className="hero-subtitle">Découvrez le Plakalidrom et nos spécialités faites maison, livrées chez vous.</p>
                            <div style={{ marginTop: '2rem' }}>
                                <Link to="/boutique" className="btn btn-primary btn-lg">
                                    Voir la carte
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="home">
            {/* Hero Slider Section (Netflix Style) */}
            <section className="hero-slider">
                {heroProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${product.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'})` }}
                    >
                        <div className="container">
                            <motion.div
                                className="slide-content"
                                initial="hidden"
                                animate={index === currentSlide ? "visible" : "hidden"}
                                variants={staggerContainer}
                            >
                                <motion.span className="slide-badge" variants={fadeInUp}>
                                    Nouveau
                                </motion.span>
                                <motion.h1 className="slide-title" variants={fadeInUp}>
                                    {product.name}
                                </motion.h1>
                                <motion.p className="slide-description" variants={fadeInUp}>
                                    {product.description?.substring(0, 150)}...
                                </motion.p>
                                <motion.div className="slide-buttons" variants={fadeInUp}>
                                    <Link to={`/produit/${product.id}`} className="btn btn-primary btn-lg">
                                        🛒 Commander • {product.price} $CAD
                                    </Link>
                                    <Link to="/boutique" className="btn btn-secondary btn-lg">
                                        Voir le menu
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                ))}

                {/* Progress Bar for Countdown */}
                <div className="progress-bar-container">
                    {heroProducts.map((_, index) => (
                        index === currentSlide && <div key={index} className="progress-bar"></div>
                    ))}
                </div>

                {/* Dots Navigation */}
                <div className="slider-dots">
                    {heroProducts.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits section">
                <div className="container">
                    <motion.div
                        className="benefits-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <BenefitCard
                            icon="⚡"
                            title="Prêt en 5 minutes"
                            desc="Réchauffez simplement au micro-ondes ou à la poêle pour un repas délicieux."
                        />
                        <BenefitCard
                            icon="🌿"
                            title="100% Naturel"
                            desc="Ingrédients soigneusement sélectionnés, sans conservateurs ni additifs."
                        />
                        <BenefitCard
                            icon="🇨🇮"
                            title="Authenticité Ivoirienne"
                            desc="Recette traditionnelle transmise de génération en génération."
                        />
                        <BenefitCard
                            icon="❤️"
                            title="Fait avec Amour"
                            desc="Préparé avec passion pour vous offrir le meilleur du goût africain."
                        />
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured section bg-white">
                <div className="container">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Nos Produits Phares</h2>
                        <p>Découvrez notre sélection de spécialités authentiques</p>
                    </motion.div>

                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
                        <Link to="/boutique" className="btn btn-secondary btn-lg">
                            Voir tous les produits
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works section">
                <div className="container">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Simple comme 1, 2, 3</h2>
                        <p>Un repas délicieux en quelques étapes</p>
                    </motion.div>
                    <div className="steps-grid">
                        <StepCard number="1" title="Commandez" desc="Choisissez vos produits préférés et passez commande en quelques clics." />
                        <div className="step-arrow">→</div>
                        <StepCard number="2" title="Recevez" desc="Livraison rapide directement chez vous, partout au Québec." />
                        <div className="step-arrow">→</div>
                        <StepCard number="3" title="Dégustez" desc="Réchauffez et savourez l'authentique goût de la Côte d'Ivoire." />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials section bg-white">
                <div className="container">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ce que disent nos clients</h2>
                        <p>La satisfaction de nos clients est notre plus belle récompense</p>
                    </motion.div>

                    <div className="testimonials-grid">
                        <TestimonialCard
                            name="Marie K."
                            text="Le meilleur Plakali que j'ai mangé depuis mon retour de Babi ! La sauce est incroyable."
                            stars={5}
                        />
                        <TestimonialCard
                            name="Jean-Marc D."
                            text="Livraison rapide et emballage soigné. On sent que c'est fait maison avec amour."
                            stars={5}
                        />
                        <TestimonialCard
                            name="Sophie L."
                            text="Une découverte fantastique. Je commande maintenant toutes les semaines pour mes déjeuners."
                            stars={4}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>Prêt à découvrir le goût authentique ?</h2>
                        <p>Commandez maintenant et recevez votre Plakalidrom en 48h</p>
                        <Link to="/boutique" className="btn btn-primary btn-lg">
                            Commander maintenant
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

// Helper Components
function BenefitCard({ icon, title, desc }) {
    return (
        <motion.div
            className="benefit-card"
            variants={fadeInUp}
            whileHover={{ y: -10 }}
        >
            <div className="benefit-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </motion.div>
    );
}

function StepCard({ number, title, desc }) {
    return (
        <motion.div
            className="step-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="step-number">{number}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </motion.div>
    );
}

function TestimonialCard({ name, text, stars }) {
    return (
        <motion.div
            className="testimonial-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
        >
            <div className="testimonial-stars">{'★'.repeat(stars)}</div>
            <p className="testimonial-text">"{text}"</p>
            <div className="testimonial-author">
                <div className="author-avatar">{name.charAt(0)}</div>
                <span style={{ fontWeight: 600, color: 'var(--color-brown)' }}>{name}</span>
            </div>
        </motion.div>
    );
}
