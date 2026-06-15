import { api } from "./api";
import { createResourceClient } from "./resourceClient";

export const getReports = () => api.get("/insights/reports");

export const getReportById = (id) => api.get(`/insights/reports/${id}`);

export const createReport = (payload) => api.post("/insights/reports", payload);

export const updateReport = (id, payload) => api.put(`/insights/reports/${id}`, payload);

export const runReport = (reportId, payload) => api.post(`/insights/reports/${reportId}/run`, payload);

export const getReportRuns = (reportId) => api.get(`/insights/reports/${reportId}/runs`);

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
