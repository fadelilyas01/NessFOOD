import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';

export const useProductsQuery = (params = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => api.getProducts(params)
    });
};

export const useProductQuery = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(id),
        enabled: !!id
    });
};

export const useFeaturedProductsQuery = () => {
    return useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => api.getFeaturedProducts()
    });
};

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => api.getCategories()
    });
};
