import { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import * as userService from '../services/users.service';
import '../styles/Loyalty.css';

export default function Loyalty() {
    const { user, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [lastCoupon, setLastCoupon] = useState(null);

    const points = user?.loyalty_profile?.points || 0;
    const totalEarned = user?.loyalty_profile?.total_points_earned || 0;
    const progressPercentage = Math.min((points / 100) * 100, 100);
    const canRedeem = points >= 100;

    const handleRedeem = async () => {
        if (!canRedeem) return;
        setLoading(true);
        try {
            const data = await userService.redeemLoyaltyPoints();
            toast.success(data.message);
            setLastCoupon({
                code: data.coupon_code,
                discount: data.discount
            });
            await refreshProfile(); // Refresh points
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erreur lors de la conversion des points');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loyalty-page container section">
            <motion.div
                className="loyalty-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Mon Programme de Fidélité ⭐</h1>
                <p>Cumulez des points à chaque commande et échangez-les contre des réductions exclusives.</p>
            </motion.div>

            <div className="loyalty-grid">
                <motion.div
                    className="loyalty-card balance-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2>Solde Actuel</h2>
                    <div className="points-display">
                        <span className="points-number">{points}</span>
                        <span className="points-label">pts</span>
                    </div>

                    <div className="progress-container">
                        <div className="progress-bar-bg">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            ></motion.div>
                        </div>
                        <p className="progress-text">
                            {canRedeem
                                ? "Félicitations ! Vous pouvez générer un coupon."
                                : `Encore ${100 - points} points pour un coupon de 10$.`
                            }
                        </p>
                    </div>

                    <button
                        className="btn btn-primary redeem-btn"
                        disabled={!canRedeem || loading}
                        onClick={handleRedeem}
                    >
                        {loading ? 'Conversion en cours...' : 'Convertir 100 pts en 10$'}
                    </button>

                    {lastCoupon && (
                        <motion.div
                            className="coupon-success"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <h3>🎉 Votre Coupon est prêt !</h3>
                            <div className="coupon-code-box">
                                <code>{lastCoupon.code}</code>
                            </div>
                            <p>Utilisez ce code lors de votre prochaine commande pour obtenir <strong>{lastCoupon.discount}$</strong> de réduction.</p>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="loyalty-card info-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>Comment ça marche ?</h2>
                    <ul className="loyalty-steps">
                        <li>
                            <div className="step-icon">🛒</div>
                            <div>
                                <strong>Commandez vos plats préférés</strong>
                                <p>Gagnez 1 point pour chaque dollar dépensé (hors taxes/livraison).</p>
                            </div>
                        </li>
                        <li>
                            <div className="step-icon">⭐</div>
                            <div>
                                <strong>Cumulez 100 points</strong>
                                <p>Vos points s'affichent automatiquement sur votre tableau de bord.</p>
                            </div>
                        </li>
                        <li>
                            <div className="step-icon">🎁</div>
                            <div>
                                <strong>Profitez d'une réduction</strong>
                                <p>Générez un code promo de 10$ utilisable quand vous le souhaitez.</p>
                            </div>
                        </li>
                    </ul>

                    <div className="loyalty-stats">
                        <p>Total cumulé Historique : <strong>{totalEarned} pts</strong></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
