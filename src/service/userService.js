import { api } from "./api";

const BASE = "/hr/admin/users";

export const getUsers = (params = {}) => api.get(BASE, { params });
export const getUser = (id) => api.get(`${BASE}/${id}`);
export const createUser = (payload) => api.post(BASE, payload);
export const updateUser = (id, payload) => api.put(`${BASE}/${id}`, payload);
export const resetPassword = (id) => api.post(`${BASE}/${id}/reset-password`);
export const deactivateUser = (id) => api.delete(`${BASE}/${id}`);
export const activateUser = (id) => api.post(`${BASE}/${id}/activate`);
