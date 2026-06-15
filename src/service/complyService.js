import { createResourceClient } from "./resourceClient";

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
