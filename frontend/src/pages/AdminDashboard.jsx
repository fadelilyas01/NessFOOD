import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import * as orderService from '../services/orders.service';
import SkeletonLoader from '../components/SkeletonLoader';
import '../styles/AdminDashboard.css';

const COLORS = ['#e67e22', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f'];

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const analytics = await orderService.getAnalytics();
                setData(analytics);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Impossible de charger les statistiques.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard-page container section">
                <h1>Tableau de Bord Admin</h1>
                <div style={{ marginTop: '20px' }}>
                    <SkeletonLoader type="card" count={3} />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container section"><p className="error-msg">{error}</p></div>;
    }

    return (
        <div className="admin-dashboard-page container section">
            <motion.div
                className="dashboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Tableau de Bord Analytics 📊</h1>
                <p>Aperçu des performances de Ness Food sur les 30 derniers jours.</p>
            </motion.div>

            {/* Summary Cards */}
            <div className="stats-grid">
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h3>Chiffre d'Affaires (30J)</h3>
                    <p className="stat-value">{data.summary.revenue_30d.toFixed(2)}$</p>
                </motion.div>
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3>Commandes Payées (30J)</h3>
                    <p className="stat-value">{data.summary.orders_30d}</p>
                </motion.div>
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3>Panier Moyen</h3>
                    <p className="stat-value">
                        {data.summary.orders_30d > 0
                            ? (data.summary.revenue_30d / data.summary.orders_30d).toFixed(2)
                            : '0.00'}$
                    </p>
                </motion.div>
            </div>

            <div className="charts-grid">
                {/* Revenue Line Chart */}
                <motion.div
                    className="chart-container"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3>Évolution des Ventes (7 derniers jours)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.daily_revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#e67e22" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Products Bar Chart */}
                <motion.div
                    className="chart-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3>Top 5 Produits (Volume)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.top_products}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#e67e22">
                                    {data.top_products.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Top Products Table */}
            <motion.div
                className="top-products-table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3>Classement des produits par revenus</h3>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Unités Vendues</th>
                                <th>Total Ventes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.top_products.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.sales.toFixed(2)}$</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
