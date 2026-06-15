import { api } from "./api";

export const getPayrollRuns = () => api.get("/payroll/runs");

export const getPayrollRunById = (id) => api.get(`/payroll/runs/${id}`);

export const createPayrollRun = (payload) => api.post("/payroll/runs", payload);

export const updatePayrollRun = (id, payload) => api.put(`/payroll/runs/${id}`, payload);

export const getPayslipsForRun = (runId) => api.get(`/payroll/runs/${runId}/items`);

export const addPayslipItem = (runId, payload) => api.post(`/payroll/runs/${runId}/items`, payload);