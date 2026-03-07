import { apiClient } from './apiClient';

export async function getProducts(params = {}) {
    const response = await apiClient.get('/products/', { params });
    return response.data;
}

export async function getProduct(id) {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
}

export async function getFeaturedProducts() {
    const response = await apiClient.get('/products/featured/');
    return response.data;
}

export async function getCategories() {
    const response = await apiClient.get('/products/categories/');
    return response.data;
}
