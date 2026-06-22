import api from './api';

// Menu Items
export const adminGetMenuItems  = async ()         => (await api.get('/admin/menu')).data;
export const adminCreateItem    = async (data)     => (await api.post('/admin/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const adminUpdateItem    = async (id, data) => (await api.put(`/admin/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const adminDeleteItem    = async (id)     => (await api.delete(`/admin/menu/${id}`)).data;

// Categories
export const adminCreateCategory = async (data) => (await api.post('/admin/categories', data)).data;

// Orders
export const adminGetOrders     = async ()       => (await api.get('/admin/orders')).data;
export const adminUpdateOrder   = async (id, data) => (await api.put(`/admin/orders/${id}`, data)).data;

// Stats
export const getDashboardStats  = async ()       => (await api.get('/admin/stats')).data;
