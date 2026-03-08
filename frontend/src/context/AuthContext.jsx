import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifier si l'utilisateur est connecté au montage
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await api.getProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch {
                    // Token expiré ou invalide
                    api.clearAuthTokens();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const { ok, data } = await api.login(email, password);
            if (ok) {
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: data.detail || 'Email ou mot de passe incorrect' };
            }
        } catch {
            return { success: false, error: 'Erreur de connexion' };
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const data = await api.register(userData);
            if (data.tokens) {
                api.setAuthTokens(data.tokens.access, data.tokens.refresh);
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: data.email?.[0] || data.password?.[0] || 'Erreur d\'inscription' };
            }
        } catch {
            return { success: false, error: 'Erreur d\'inscription' };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        try {
            const userData = await api.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh profile', error);
        }
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
