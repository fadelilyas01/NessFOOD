import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import './OrderHistory.css';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.getOrders();
                setOrders(data.results || data || []);
            } catch (err) {
                console.error("Erreur chargement des commandes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner"></div></div>;
    }

    return (
        <main className="order-history-page section">
            <div className="container">
                <h1>Historique des commandes</h1>
                {orders.length === 0 ? (
                    <div className="no-orders text-center">
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <Link to="/boutique" className="btn btn-primary mt-4" style={{ marginTop: '1rem', display: 'inline-block' }}>Commencer mes achats</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3>Commande #{order.order_number}</h3>
                                    <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <p>Date: {new Date(order.created_at).toLocaleDateString('fr-CA')}</p>
                                    <p>Total: {parseFloat(order.total_amount).toFixed(2)} $CAD</p>
                                </div>
                                <div className="order-items">
                                    <ul>
                                        {order.items?.map(item => (
                                            <li key={item.id}>
                                                {item.quantity}x {item.product_name} - {parseFloat(item.price).toFixed(2)} $CAD
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
