import api from './api';

export const createOrder  = async (data)           => (await api.post('/orders', data)).data;
export const getMyOrders  = async ()               => (await api.get('/orders/my')).data;
export const getOrderById = async (id)             => (await api.get(`/orders/${id}`)).data;
export const payOrder     = async (id, paymentData) => (await api.put(`/orders/${id}/pay`, paymentData)).data;
