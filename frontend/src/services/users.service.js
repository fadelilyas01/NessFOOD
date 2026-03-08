import { apiClient } from './apiClient';

export async function getProfile() {
    const response = await apiClient.get('/users/profile/');
    return response.data;
}

export async function updateProfile(data) {
    const response = await apiClient.put('/users/profile/', data);
    return response.data;
}

export async function getAddresses() {
    const response = await apiClient.get('/users/addresses/');
    return response.data;
}

export async function addAddress(address) {
    const response = await apiClient.post('/users/addresses/', address);
    return response.data;
}

export async function redeemLoyaltyPoints() {
    const response = await apiClient.post('/users/loyalty/redeem/');
    return response.data;
}
