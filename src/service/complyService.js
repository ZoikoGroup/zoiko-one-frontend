import { api } from "./api";

export const getPolicies = (category) =>
  api.get(`/comply/policies${category ? `?category=${category}` : ""}`);

export const getPolicyById = (id) => api.get(`/comply/policies/${id}`);

export const createPolicy = (payload) => api.post("/comply/policies", payload);

export const updatePolicy = (id, payload) => api.put(`/comply/policies/${id}`, payload);

export const acknowledgePolicy = (policyId) => api.post(`/comply/policies/${policyId}/ack`);

export const getAcknowledgements = (policyId) => api.get(`/comply/policies/${policyId}/acks`);