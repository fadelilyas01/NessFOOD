import { apiClient } from './apiClient';

export async function subscribeNewsletter(email) {
    try {
        const response = await apiClient.post('/newsletter/subscribe/', { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.email?.[0] || 'Erreur lors de l\'inscription');
    }
}
