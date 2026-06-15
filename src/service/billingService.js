import { api } from "./api";

export const getClients = () => api.get("/billing/clients");

export const getClientById = (id) => api.get(`/billing/clients/${id}`);

export const createClient = (payload) => api.post("/billing/clients", payload);

export const updateClient = (id, payload) => api.put(`/billing/clients/${id}`, payload);

export const getInvoices = (clientId) =>
  api.get(`/billing/invoices${clientId ? `?client_id=${clientId}` : ""}`);

export const getInvoiceById = (id) => api.get(`/billing/invoices/${id}`);

export const createInvoice = (payload) => api.post("/billing/invoices", payload);

export const updateInvoice = (id, payload) => api.put(`/billing/invoices/${id}`, payload);