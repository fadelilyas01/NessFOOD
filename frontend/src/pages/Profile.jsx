
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import * as api from '../services/api';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // info, orders, addresses
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, addressesData] = await Promise.all([
                    api.getOrders(),
                    api.getAddresses()
                ]);
                setOrders(ordersData);
                setAddresses(addressesData);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (!user) return null;

    return (
        <main className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.first_name.charAt(0)}
                    </div>
                    <div className="profile-welcome">
                        <h1>Bonjour, {user.first_name} !</h1>
                        <p>{user.email}</p>
                    </div>
                    <button onClick={logout} className="btn btn-outline-danger btn-sm">
                        Déconnexion
                    </button>
                </div>

                <div className="profile-content">
                    {/* Sidebar de navigation */}
                    <aside className="profile-nav">
                        <button
                            className={`nav-item ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            👤 Mes informations
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            🛍️ Mes commandes
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            📍 Mes adresses
                        </button>
                    </aside>

                    {/* Contenu principal */}
                    <div className="profile-panel">
                        {activeTab === 'info' && (
                            <div className="info-panel">
                                <h2>Informations personnelles</h2>
                                <div className="info-grid">
                                    <div className="info-group">
                                        <label>Prénom</label>
                                        <div className="info-value">{user.first_name}</div>
                                    </div>
                                    <div className="info-group">
                                        <label>Nom</label>
                                        <div className="info-value">{user.last_name}</div>
                                    </div>
                                    <div className="info-group full-width">
                                        <label>Email</label>
                                        <div className="info-value">{user.email}</div>
                                    </div>
                                    <div className="info-group full-width">
                                        <label>Téléphone</label>
                                        <div className="info-value">{user.phone || 'Non renseigné'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="orders-panel">
                                <h2>Historique des commandes</h2>
                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Vous n'avez pas encore passé de commande.</p>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => (
                                            <div key={order.id} className="order-card">
                                                <div className="order-header">
                                                    <span className="order-number">#{order.order_number}</span>
                                                    <span className={`order-status status-${order.status}`}>
                                                        {order.status_display}
                                                    </span>
                                                </div>
                                                <div className="order-details">
                                                    <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                                    <p>Total: <strong>{order.total}€</strong></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="addresses-panel">
                                <h2>Mes Adresses</h2>
                                {addresses.length === 0 ? (
                                    <div className="empty-state">
                                        <p>Aucune adresse enregistrée.</p>
                                    </div>
                                ) : (
                                    <div className="address-list">
                                        {addresses.map(address => (
                                            <div key={address.id} className="address-card">
                                                <strong>{address.full_name}</strong>
                                                <p>{address.address_line1}</p>
                                                <p>{address.postal_code} {address.city}</p>
                                                <p>{address.country}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
