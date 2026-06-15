import { api } from "./api";
import { createResourceClient } from "./resourceClient";

export const getPolicies = async (category) => {
  try { return await api.get(`/comply/policies${category ? `?category=${category}` : ""}`); } catch (e) { console.warn("mock fallback for " + "getPolicies"); return []; }
};

export const getPolicyById = async (id) => {
  try { return await api.get(`/comply/policies/${id}`); } catch (e) { console.warn("mock fallback for " + "getPolicyById"); return []; }
};

export const createPolicy = (payload) => api.post("/comply/policies", payload);

export const updatePolicy = (id, payload) => api.put(`/comply/policies/${id}`, payload);

export const acknowledgePolicy = (policyId) => api.post(`/comply/policies/${policyId}/ack`);

export const getAcknowledgements = async (policyId) => {
  try { return await api.get(`/comply/policies/${policyId}/acks`); } catch (e) { console.warn("mock fallback for " + "getAcknowledgements"); return []; }
};

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
