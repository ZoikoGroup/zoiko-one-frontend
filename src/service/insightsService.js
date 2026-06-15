import { api } from "./api";

export const getReports = () => api.get("/insights/reports");

export const getReportById = (id) => api.get(`/insights/reports/${id}`);

export const createReport = (payload) => api.post("/insights/reports", payload);

export const updateReport = (id, payload) => api.put(`/insights/reports/${id}`, payload);

export const runReport = (reportId, payload) => api.post(`/insights/reports/${reportId}/run`, payload);

export const getReportRuns = (reportId) => api.get(`/insights/reports/${reportId}/runs`);