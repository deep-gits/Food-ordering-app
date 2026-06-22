import api from './api';

export const getMenuItems   = async (params) => (await api.get('/menu', { params })).data;
export const getMenuItemById = async (id)    => (await api.get(`/menu/${id}`)).data;
export const getCategories  = async ()       => (await api.get('/menu/categories')).data;
export const getFeaturedItems = async ()     => (await api.get('/menu/featured')).data;
