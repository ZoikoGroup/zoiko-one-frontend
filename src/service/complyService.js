import { api } from "./api";
import { createResourceClient } from "./resourceClient";

export const getPolicies = (category) =>
  api.get(`/comply/policies${category ? `?category=${category}` : ""}`);

export const getPolicyById = (id) => api.get(`/comply/policies/${id}`);

export const createPolicy = (payload) => api.post("/comply/policies", payload);

export const updatePolicy = (id, payload) => api.put(`/comply/policies/${id}`, payload);

export const acknowledgePolicy = (policyId) => api.post(`/comply/policies/${policyId}/ack`);

export const getAcknowledgements = (policyId) => api.get(`/comply/policies/${policyId}/acks`);

const mockData = {
  overview: { message: "Zoiko Comply overview (mock)" },
  filingCalendar: [],
  auditLogs: [],
  evidencePacks: [],
  riskAlerts: [],
};

const client = createResourceClient("/api/comply", mockData);

export const getOverview = () => client.list("overview");
export const getFilingCalendar = (params) => client.list("filingCalendar", params);
export const getAuditLogs = (params) => client.list("auditLogs", params);
export const getEvidencePacks = (params) => client.list("evidencePacks", params);
export const getRiskAlerts = (params) => client.list("riskAlerts", params);

export const acknowledgeRiskAlert = (id) => client.update("riskAlerts", id, { acknowledged: true });

export default client;
