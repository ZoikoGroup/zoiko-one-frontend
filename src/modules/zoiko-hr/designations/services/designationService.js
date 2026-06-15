import { getDesignationDashboard as mockDashboard } from "../mock-data/designationData";
import { getDesignations as mockDesignations } from "../mock-data/designationData";
import { getDesignationById as mockDesignationById } from "../mock-data/designationData";
import { getDesignationLevels as mockLevels } from "../mock-data/designationData";
import { getDesignationReports as mockReports } from "../mock-data/designationData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getDesignationDashboard() {
  await delay();
  return mockDashboard();
}

export async function getDesignations(filters = {}) {
  await delay();
  let result = [...mockDesignations()];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((r) => r.title.toLowerCase().includes(q) || r.department_name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
  }
  if (filters.status) result = result.filter((r) => r.status === filters.status);
  if (filters.level) result = result.filter((r) => r.level === filters.level);
  if (filters.department) result = result.filter((r) => r.department_name === filters.department);
  return result;
}

export async function getDesignationById(id) {
  await delay();
  return mockDesignationById(id);
}

export async function createDesignation(data) {
  await delay();
  return { success: true, id: Date.now(), ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
}

export async function updateDesignation(id, data) {
  await delay();
  return { success: true, id, ...data, updated_at: new Date().toISOString() };
}

export async function deleteDesignation(id) {
  await delay();
  return { success: true, message: "Designation deleted" };
}

export async function getDesignationLevels() {
  await delay();
  return [...mockLevels()];
}

export async function getDesignationReports() {
  await delay();
  return mockReports();
}
