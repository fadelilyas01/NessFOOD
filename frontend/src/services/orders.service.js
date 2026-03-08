import { apiClient } from './apiClient';

export async function getOrders() {
    const response = await apiClient.get('/orders/');
    return response.data;
}

export async function getOrder(orderNumber) {
    const response = await apiClient.get(`/orders/${orderNumber}/`);
    return response.data;
}

export async function createOrder(shippingInfo) {
    try {
        const response = await apiClient.post('/orders/create/', shippingInfo);
        return { ok: true, data: response.data };
    } catch (error) {
        return { ok: false, data: error.response?.data };
    }
}

export async function getAnalytics() {
    const response = await apiClient.get('/orders/admin/analytics/');
    return response.data;
}
