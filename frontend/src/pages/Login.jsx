import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { syncCartToBackend } = useCart();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Sync guest cart to backend
            await syncCartToBackend();
            navigate('/profil');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Connexion</h1>
                    <p className="auth-subtitle">Content de vous revoir !</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Pas encore de compte ?</p>
                        <Link to="/inscription" className="auth-link">Créer un compte</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
