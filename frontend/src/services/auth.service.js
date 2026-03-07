import { apiClient, setAuthTokens, clearAuthTokens } from './apiClient';

export async function register(userData) {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
}

export async function login(email, password) {
    try {
        const response = await apiClient.post('/auth/login/', { email, password });
        setAuthTokens(response.data.access, response.data.refresh);
        return { ok: true, data: response.data };
    } catch (error) {
        return { ok: false, data: error.response?.data || { detail: 'Erreur de connexion' } };
    }
}

export async function logout() {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
        try {
            await apiClient.post('/auth/logout/', { refresh });
        } catch (e) {
            console.error(e);
        }
    }
    clearAuthTokens();
}
