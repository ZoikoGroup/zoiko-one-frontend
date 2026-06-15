import { dashboardStats, employeeDocuments, companyDocuments, templates, approvals, expiryTracking, complianceDocuments, documentsAnalytics } from "../mock-data/index";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats() { await delay(); return { ...dashboardStats }; }
export async function getEmployeeDocuments() { await delay(); return [...employeeDocuments]; }
export async function getCompanyDocuments() { await delay(); return [...companyDocuments]; }
export async function getTemplates() { await delay(); return [...templates]; }
export async function getApprovals() { await delay(); return [...approvals]; }
export async function getExpiryTracking() { await delay(); return [...expiryTracking]; }
export async function getComplianceDocuments() { await delay(); return [...complianceDocuments]; }
export async function getDocumentsAnalytics() { await delay(); return [...documentsAnalytics]; }
