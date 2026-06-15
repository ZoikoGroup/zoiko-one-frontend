import { api } from "./api";

export const getTimeEntries = (employeeId) =>
  api.get(`/time/entries${employeeId ? `?employee_id=${employeeId}` : ""}`);

export const createTimeEntry = (payload) => api.post("/time/entries", payload);

export const updateTimeEntry = (id, payload) => api.put(`/time/entries/${id}`, payload);

export const getLeaveRequests = (employeeId) =>
  api.get(`/time/leaves${employeeId ? `?employee_id=${employeeId}` : ""}`);

export const createLeaveRequest = (payload) => api.post("/time/leaves", payload);

export const reviewLeaveRequest = (id, payload) => api.put(`/time/leaves/${id}/review`, payload);