import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export function getAuthToken() {
    return localStorage.getItem('access_token');
}

export function setAuthTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

export function clearAuthTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshed = await refreshToken();
            if (refreshed) {
                originalRequest.headers['Authorization'] = `Bearer ${getAuthToken()}`;
                return apiClient(originalRequest);
            }
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        return Promise.reject(error);
    }
);

// We keep apiRequest for backward compatibility just in case, but prefer direct apiClient usage
export async function apiRequest(endpoint, options = {}) {
    const { method = 'GET', body, ...restOptions } = options;
    try {
        const response = await apiClient({
            url: endpoint,
            method,
            data: body ? JSON.parse(body) : undefined,
            ...restOptions,
        });
        return {
            ok: response.status >= 200 && response.status < 300,
            json: async () => response.data,
            ...response,
        };
    } catch (error) {
        throw error;
    }
}

export async function refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
        const response = await axios.post(`${API_BASE}/auth/refresh/`, { refresh });
        if (response.status === 200) {
            localStorage.setItem('access_token', response.data.access);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    clearAuthTokens();
    return false;
}

export { API_BASE, apiClient };
