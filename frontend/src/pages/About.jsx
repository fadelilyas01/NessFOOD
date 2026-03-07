import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
    return (
        <main className="about-page">
            {/* Hero */}
            <section className="about-hero">
                <div className="container">
                    <h1>Notre Histoire</h1>
                    <p>Découvrez l'authenticité de la cuisine ivoirienne</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-content">
                            <span className="section-label">Notre Histoire</span>
                            <h2>De la Côte d'Ivoire à votre table</h2>
                            <p>
                                <strong>Ness Food</strong> est née d'une passion profonde pour la cuisine
                                africaine authentique et du désir de partager les saveurs uniques de la
                                Côte d'Ivoire avec le monde entier.
                            </p>
                            <p>
                                Notre aventure a commencé quand notre fondatrice, nostalgique des plats
                                de son enfance à Abidjan, a décidé de recréer le plakali traditionnel
                                avec une touche moderne : prêt à consommer, sans compromis sur la qualité.
                            </p>
                            <p>
                                Aujourd'hui, chaque portion de <strong>Plakalidrom</strong> est préparée
                                selon les recettes transmises de génération en génération, en utilisant
                                uniquement des ingrédients naturels soigneusement sélectionnés.
                            </p>
                        </div>
                        <div className="story-image">
                            <img
                                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=700&fit=crop"
                                alt="Préparation traditionnelle"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values section bg-white">
                <div className="container">
                    <div className="section-title">
                        <h2>Nos Valeurs</h2>
                        <p>Ce qui nous guide au quotidien</p>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🌍</div>
                            <h3>Authenticité</h3>
                            <p>
                                Nous préservons les recettes traditionnelles ivoiriennes, transmises
                                de génération en génération, pour vous offrir un goût véritablement authentique.
                            </p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🌱</div>
                            <h3>Naturalité</h3>
                            <p>
                                100% naturel, sans conservateurs ni additifs artificiels. Nous sélectionnons
                                les meilleurs ingrédients pour une qualité irréprochable.
                            </p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">❤️</div>
                            <h3>Passion</h3>
                            <p>
                                Chaque produit est préparé avec amour et attention, comme si nous
                                le préparions pour notre propre famille.
                            </p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h3>Communauté</h3>
                            <p>
                                Nous sommes fiers de créer un pont entre l'Afrique et sa diaspora,
                                en partageant notre culture à travers la cuisine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="about-process section">
                <div className="container">
                    <div className="section-title">
                        <h2>Notre Savoir-Faire</h2>
                        <p>Un processus de fabrication rigoureux</p>
                    </div>
                    <div className="process-timeline">
                        <div className="process-item">
                            <div className="process-number">01</div>
                            <div className="process-content">
                                <h3>Sélection des Ingrédients</h3>
                                <p>
                                    Nous sélectionnons soigneusement le manioc et les autres ingrédients
                                    auprès de producteurs de confiance, en privilégiant la qualité et la fraîcheur.
                                </p>
                            </div>
                        </div>
                        <div className="process-item">
                            <div className="process-number">02</div>
                            <div className="process-content">
                                <h3>Préparation Traditionnelle</h3>
                                <p>
                                    Nos artisans suivent les méthodes de préparation ancestrales pour
                                    garantir une texture et un goût authentiques.
                                </p>
                            </div>
                        </div>
                        <div className="process-item">
                            <div className="process-number">03</div>
                            <div className="process-content">
                                <h3>Contrôle Qualité</h3>
                                <p>
                                    Chaque lot est rigoureusement testé pour assurer une qualité
                                    constante et répondre aux normes les plus strictes.
                                </p>
                            </div>
                        </div>
                        <div className="process-item">
                            <div className="process-number">04</div>
                            <div className="process-content">
                                <h3>Conditionnement</h3>
                                <p>
                                    Un emballage soigné qui préserve la fraîcheur et les saveurs,
                                    tout en étant pratique pour votre quotidien.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta section bg-white">
                <div className="container text-center">
                    <h2>Prêt à découvrir le Plakalidrom ?</h2>
                    <p>
                        Rejoignez des milliers de clients satisfaits et goûtez à l'authenticité
                        de la cuisine ivoirienne.
                    </p>
                    <Link to="/boutique" className="btn btn-primary btn-lg">
                        Découvrir nos produits
                    </Link>
                </div>
            </section>
        </main>
    );
}
