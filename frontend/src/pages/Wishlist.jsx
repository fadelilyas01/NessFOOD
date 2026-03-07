import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
    const { wishlist } = useWishlist();

    return (
        <main className="wishlist-page">
            <section className="shop-hero">
                <div className="container">
                    <h1>Mes Favoris</h1>
                    <p>Retrouvez ici tous les plats que vous avez mis de côté.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {wishlist.length === 0 ? (
                        <div className="text-center" style={{ padding: 'var(--space-12) 0' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🥺</div>
                            <h2>Votre liste de favoris est vide</h2>
                            <p style={{ color: 'var(--color-gray)', marginBottom: 'var(--space-6)' }}>
                                Vous n'avez pas encore ajouté de plat à vos favoris.
                            </p>
                            <Link to="/boutique" className="btn btn-primary btn-lg">
                                Explorer le menu
                            </Link>
                        </div>
                    ) : (
                        <div className="shop-products-grid">
                            {wishlist.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
