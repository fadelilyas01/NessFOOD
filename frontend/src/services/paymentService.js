/**
 * Service de paiement Stripe pour le Frontend
 * Gère les appels API de paiement et la redirection Stripe Checkout
 */

import { apiClient } from './apiClient';

/**
 * Obtenir la configuration Stripe
 */
export async function getPaymentConfig() {
    const response = await apiClient.get('/payments/config/');
    return response.data;
}

/**
 * Créer une session de paiement et rediriger vers Stripe
 * @param {string} orderNumber - Numéro de commande à payer
 */
export async function createCheckoutSession(orderNumber) {
    try {
        const response = await apiClient.post('/payments/checkout/', { order_number: orderNumber });
        // Rediriger vers Stripe Checkout
        window.location.href = response.data.checkout_url;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la création du paiement');
    }
}

/**
 * Vérifier le statut du paiement pour une commande
 * @param {string} orderNumber - Numéro de commande à vérifier
 */
export async function checkPaymentStatus(orderNumber) {
    try {
        const response = await apiClient.get(`/payments/status/${orderNumber}/`);
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la vérification du paiement');
    }
}

/**
 * Obtenir les détails du succès de paiement
 * @param {string} orderNumber - Numéro de commande
 * @param {string} sessionId - ID de session Stripe (optionnel)
 */
export async function getPaymentSuccess(orderNumber, sessionId = null) {
    let url = `/payments/success/?order=${orderNumber}`;
    if (sessionId) {
        url += `&session_id=${sessionId}`;
    }

    const response = await apiClient.get(url);
    return response.data;
}

/**
 * Obtenir l'historique de paiement de l'utilisateur
 */
export async function getPaymentHistory() {
    try {
        const response = await apiClient.get('/payments/history/');
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'historique');
    }
}

/**
 * Créer une commande et initier le paiement
 * @param {Object} shippingInfo - Informations de livraison
 */
export async function createOrderAndPay(shippingInfo) {
    // 1. Créer la commande
    try {
        const orderResponse = await apiClient.post('/orders/create/', shippingInfo);
        const orderNumber = orderResponse.data.order.order_number;

        // 2. Créer la session de paiement et rediriger
        await createCheckoutSession(orderNumber);
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la création de la commande');
    }
}
