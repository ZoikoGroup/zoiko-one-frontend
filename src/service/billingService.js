import { createResourceClient } from "./resourceClient";

const mockData = {
  overview: { message: "Zoiko Billing overview (mock)" },
  invoices: [],
  recurring: [],
  paymentLinks: [],
  collections: [],
};

const client = createResourceClient("/api/billing", mockData);

export const getOverview = () => client.list("overview");
export const getInvoices = (params) => client.list("invoices", params);
export const getRecurringBilling = (params) => client.list("recurring", params);
export const getPaymentLinks = (params) => client.list("paymentLinks", params);
export const getCollections = (params) => client.list("collections", params);

export const createInvoice = (payload) => client.create("invoices", payload);
export const updateInvoice = (id, payload) => client.update("invoices", id, payload);
export const deleteInvoice = (id) => client.remove("invoices", id);

export default client;
