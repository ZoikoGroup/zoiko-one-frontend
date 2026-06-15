import { api } from "./api";
import { createResourceClient } from "./resourceClient";

export const getClients = () => api.get("/billing/clients");

export const getClientById = (id) => api.get(`/billing/clients/${id}`);

export const createClient = (payload) => api.post("/billing/clients", payload);

export const updateClient = (id, payload) => api.put(`/billing/clients/${id}`, payload);

export const getInvoices = (clientId) =>
  api.get(`/billing/invoices${clientId ? `?client_id=${clientId}` : ""}`);

export const getInvoiceById = (id) => api.get(`/billing/invoices/${id}`);

export const createInvoice = (payload) => api.post("/billing/invoices", payload);

export const updateInvoice = (id, payload) => api.put(`/billing/invoices/${id}`, payload);

const mockData = {
  overview: { message: "Zoiko Billing overview (mock)" },
  invoices: [],
  recurring: [],
  paymentLinks: [],
  collections: [],
};

const client = createResourceClient("/api/billing", mockData);

export const getOverview = () => client.list("overview");
export const getRecurringBilling = (params) => client.list("recurring", params);
export const getPaymentLinks = (params) => client.list("paymentLinks", params);
export const getCollections = (params) => client.list("collections", params);

export const deleteInvoice = (id) => client.remove("invoices", id);

export default client;
