import { getDepartmentDashboard as mockDashboard } from "../mock-data/departmentData";
import { getDepartments as mockDepartments } from "../mock-data/departmentData";
import { getDepartmentById as mockDepartmentById } from "../mock-data/departmentData";
import { getDepartmentReports as mockReports } from "../mock-data/departmentData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getDepartmentDashboard() {
  await delay();
  return mockDashboard();
}

export async function getDepartments(filters = {}) {
  await delay();
  let result = [...mockDepartments()];
  if (filters.status) result = result.filter((d) => d.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || (d.head && d.head.toLowerCase().includes(q)));
  }
  return result;
}

export async function getDepartmentById(id) {
  await delay();
  return mockDepartmentById(id);
}

export async function createDepartment(data) {
  await delay();
  return { success: true, id: Date.now(), ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
}

export async function updateDepartment(id, data) {
  await delay();
  return { success: true, id, ...data, updated_at: new Date().toISOString() };
}

export async function deleteDepartment(id) {
  await delay();
  return { success: true, message: "Department deleted" };
}

export async function getDepartmentReports() {
  await delay();
  return mockReports();
}
