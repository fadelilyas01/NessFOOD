import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Login.css';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        password_confirm: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate('/');
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

    // Auto-generate username from email
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setFormData({
            ...formData,
            email: email,
            username: email.split('@')[0] || '',
        });
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Créer un compte</h1>
                    <p className="auth-subtitle">Rejoignez la communauté Ness Food</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="first_name">Prénom *</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    className="form-input"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="last_name">Nom *</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    className="form-input"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password_confirm">Confirmer le mot de passe *</label>
                            <input
                                type="password"
                                id="password_confirm"
                                name="password_confirm"
                                className="form-input"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Déjà un compte ?</p>
                        <Link to="/connexion" className="auth-link">Se connecter</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
