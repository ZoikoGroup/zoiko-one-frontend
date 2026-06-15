import { api } from "./api";
import { createResourceClient } from "./resourceClient";

export const getReports = async () => {
  try { return await api.get("/insights/reports"); } catch (e) { console.warn("mock fallback for " + "getReports"); return []; }
};

export const getReportById = async (id) => {
  try { return await api.get(`/insights/reports/${id}`); } catch (e) { console.warn("mock fallback for " + "getReportById"); return []; }
};

export const createReport = (payload) => api.post("/insights/reports", payload);

export const updateReport = (id, payload) => api.put(`/insights/reports/${id}`, payload);

export const runReport = (reportId, payload) => api.post(`/insights/reports/${reportId}/run`, payload);

export const getReportRuns = async (reportId) => {
  try { return await api.get(`/insights/reports/${reportId}/runs`); } catch (e) { console.warn("mock fallback for " + "getReportRuns"); return []; }
};

const mockData = {
  overview: { message: "Zoiko Insights overview (mock)" },
  dashboards: [],
  payrollAnalytics: [],
  revenueInsights: [],
  utilizationTrends: [],
  forecasts: [],
};

const client = createResourceClient("/api/insights", mockData);

export const getOverview = () => client.list("overview");
export const getDashboards = (params) => client.list("dashboards", params);
export const getPayrollAnalytics = (params) => client.list("payrollAnalytics", params);
export const getRevenueInsights = (params) => client.list("revenueInsights", params);
export const getUtilizationTrends = (params) => client.list("utilizationTrends", params);
export const getForecasts = (params) => client.list("forecasts", params);

export default client;
