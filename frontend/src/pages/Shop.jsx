import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProductsQuery, useCategoriesQuery } from '../hooks/useProductsQuery';
import './Shop.css';

export default function Shop() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');

    const { data: productsData, isLoading: isProductsLoading } = useProductsQuery();
    const { data: categoriesData } = useCategoriesQuery();

    const products = productsData?.results || productsData || [];
    const fetchedCategories = categoriesData?.results || categoriesData || [];

    const categories = [
        { id: 'all', name: 'Tous les produits' },
        ...fetchedCategories.map(c => ({ id: c.slug, name: c.name }))
    ];

    const filteredProducts = products
        .filter(product => filter === 'all' || product.category?.slug === filter || product.category === filter)
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default: // featured
                    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
            }
        });

    if (isProductsLoading) {
        return (
            <main className="shop-page" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </main>
        );
    }

    return (
        <main className="shop-page">
            {/* Hero Banner */}
            <section className="shop-hero">
                <div className="container">
                    <h1>Notre Boutique</h1>
                    <p>Découvrez tous nos produits authentiques préparés avec amour</p>
                </div>
            </section>

            {/* Shop Content */}
            <section className="shop-content section">
                <div className="container">
                    {/* Filters */}
                    <div className="shop-filters">
                        <div className="filter-categories">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                                    onClick={() => setFilter(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <div className="filter-sort">
                            <label htmlFor="sort">Trier par:</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="featured">Mis en avant</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                                <option value="name">Nom</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="shop-products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <p>Aucun produit trouvé dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Info Banner */}
            <section className="shop-info">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-icon">🚚</span>
                            <div>
                                <strong>Livraison rapide</strong>
                                <p>Expédié sous 24h</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">🔒</span>
                            <div>
                                <strong>Paiement sécurisé</strong>
                                <p>CB, PayPal, Apple Pay</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📞</span>
                            <div>
                                <strong>Service client</strong>
                                <p>À votre écoute 7j/7</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">✨</span>
                            <div>
                                <strong>Qualité garantie</strong>
                                <p>Satisfait ou remboursé</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
