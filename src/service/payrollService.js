import { api } from "./api";
import {
  COMPLIANCE_COUNTRIES,
  DEFAULT_COUNTRY,
  getComplianceRates,
  getTaxSlabs,
  getFieldPack,
  getCountryMeta,
} from "./compliancePacks";

// Re-exported so components only need one import path (payrollService)
// instead of reaching into compliancePacks.js directly.
export { COMPLIANCE_COUNTRIES, DEFAULT_COUNTRY, getFieldPack, getCountryMeta };

// ── Dashboard ──────────────────────────────────────────
export const getDashboardSummary = async () => {
  try {
    return await api.get("/api/payroll/dashboard/summary");
  } catch (err) {
    throw err;
  }
};

export const getDashboardTrend = async () => {
  try {
    const res = await api.get("/api/payroll/dashboard/trend");
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

export const getRecentActivity = async () => {
  try {
    const res = await api.get("/api/payroll/dashboard/activity");
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

// ── Employees ──────────────────────────────────────────
export const getEmployees = async (params) => {
  try {
    const res = await api.get("/api/payroll/employees", { params });
    return res?.items || res?.data || res || [];
  } catch {
    return [];
  }
};

export const getEmployeeById = async (id) => {
  try {
    return await api.get(`/api/payroll/employees/${id}`);
  } catch (err) {
    throw err;
  }
};

export const createEmployee = async (payload) => {
  try {
    return await api.post("/api/payroll/employees", payload);
  } catch (err) {
    throw err;
  }
};

export const updateEmployee = async (id, payload) => {
  try {
    return await api.put(`/api/payroll/employees/${id}`, payload);
  } catch (err) {
    throw err;
  }
};

export const deleteEmployee = async (id) => {
  try {
    return await api.delete(`/api/payroll/employees/${id}`);
  } catch (err) {
    throw err;
  }
};

export const bulkCreateEmployees = async (employees) => {
  try {
    // Expected response shape: { created: [...employees], failed: [{ row, reason }] }
    return await api.post("/api/payroll/employees/bulk", { employees });
  } catch (err) {
    throw err;
  }
};

export const bulkDeleteEmployees = async (employeeIds) => {
  try {
    return await api.post("/api/payroll/employees/bulk-delete", { employee_ids: employeeIds });
  } catch (err) {
    throw err;
  }
};

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
export const EMPLOYEE_STATUSES = ["Active", "On Leave", "Inactive"];
export const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Support",
];

// ── Payroll Runs ───────────────────────────────────────
export const fetchRuns = async (params) => {
  try {
    const res = await api.get("/api/payroll/runs", { params });
    return Array.isArray(res) ? res : res?.data || res?.items || [];
  } catch {
    return [];
  }
};

export const createRun = async (payload) => {
  try {
    return await api.post("/api/payroll/runs", payload);
  } catch (err) {
    throw err;
  }
};

export const approveRun = async (id) => {
  try {
    return await api.put(`/api/payroll/runs/${id}/approve`);
  } catch (err) {
    throw err;
  }
};

export const updateRun = async (id, payload) => {
  try {
    return await api.put(`/api/payroll/runs/${id}`, payload);
  } catch (err) {
    throw err;
  }
};

export const deletePayRun = async (id) => {
  try {
    return await api.delete(`/api/payroll/runs/${id}`);
  } catch (err) {
    throw err;
  }
};

// ── Payslips ───────────────────────────────────────────
export const getPayslips = async (params) => {
  try {
    const res = await api.get("/api/payroll/payslips", { params });
    return Array.isArray(res) ? res : res?.data || res?.items || [];
  } catch {
    return [];
  }
};

export const getPayslipById = async (id) => {
  try {
    return await api.get(`/api/payroll/payslips/${id}`);
  } catch (err) {
    throw err;
  }
};

export const downloadPayslip = async (payslip) => {
  const res = await api.get(`/api/payroll/payslips/${payslip.id}/download`, { responseType: "blob" });
  const blob = res instanceof Blob ? res : res?.data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payslip-${payslip.id || "download"}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Compliance / Filings ───────────────────────────────
//
// fetchContributionRates / fetchTaxSlabs are now country-aware:
//   1. They ask the backend for country-specific data (?country=XX).
//   2. If the backend returns nothing yet (most backends won't have
//      per-country data on day one) they fall back to the local
//      compliancePacks.js lookup, so the UI is never empty and never
//      silently shows the wrong country's numbers.
//
// This is the seam described in the earlier analysis: once the backend
// grows real per-country compliance data, only the "if (data.length > 0)"
// branch matters — no component changes needed.

export const fetchComplianceData = async (params) => {
  try {
    const res = await api.get("/api/payroll/filings", { params });
    return Array.isArray(res) ? res : res?.data || res?.items || [];
  } catch {
    return [];
  }
};

export const fetchContributionRates = async (countryCode = DEFAULT_COUNTRY) => {
  try {
    const res = await api.get("/api/payroll/compliance/contribution-rates", {
      params: { country: countryCode },
    });
    const data = Array.isArray(res) ? res : res?.data || res?.items || [];
    if (data.length > 0) return data;
    return getComplianceRates(countryCode).rows;
  } catch {
    // Backend not reachable / not country-aware yet — use the local pack.
    return getComplianceRates(countryCode).rows;
  }
};

export const fetchTaxSlabs = async (countryCode = DEFAULT_COUNTRY) => {
  try {
    const res = await api.get("/api/payroll/compliance/tax-slabs", {
      params: { country: countryCode },
    });
    const data = Array.isArray(res) ? res : res?.data || res?.items || [];
    if (data.length > 0) return data;
    return getTaxSlabs(countryCode).slabs;
  } catch {
    return getTaxSlabs(countryCode).slabs;
  }
};

export const updateCompanyDetails = async (payload) => {
  try {
    return await api.put("/api/payroll/compliance/company-details", payload);
  } catch (err) {
    throw err;
  }
};

// ── Compliance Documents (upload → extraction) ─────────
//
// This endpoint doesn't exist on the backend yet. Contract it should
// follow, so the frontend (ComplianceDocumentUpload.jsx) already works
// once it's built — no component changes needed, just implement this:
//
// POST /api/payroll/compliance/documents   (multipart/form-data)
//   fields: file, country  (ISO-ish code, e.g. "IN" / "US" / "UK")
//   response 201:
//   {
//     id: string,
//     fileName: string,
//     uploadedAt: string (ISO timestamp),
//     country: string,
//     status: "processing" | "parsed" | "failed",
//     extracted: {
//       contributionRates: [{ id, label, employee, employer, total }] | null,
//       taxSlabs: [{ id, min, max, rate, tax }] | null,
//       requirements: [{ label, note }] | null
//     } | null,
//     error: string | null
//   }
//
// GET /api/payroll/compliance/documents?country=XX
//   response 200: array of the same document shape as above
//
// DELETE /api/payroll/compliance/documents/:id
//   response 204
//
// Until this exists, uploadComplianceDocument() rejects and the UI marks
// the file "unavailable" (queued, not lost) rather than failing silently.

export const uploadComplianceDocument = async (file, countryCode = DEFAULT_COUNTRY) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("country", countryCode);
  try {
    return await api.post("/api/payroll/compliance/documents", formData);
  } catch (err) {
    throw err;
  }
};

export const fetchComplianceDocuments = async (countryCode = DEFAULT_COUNTRY) => {
  try {
    const res = await api.get("/api/payroll/compliance/documents", { params: { country: countryCode } });
    return Array.isArray(res) ? res : res?.data || res?.items || [];
  } catch {
    return [];
  }
};

export const deleteComplianceDocument = async (id) => {
  try {
    return await api.delete(`/api/payroll/compliance/documents/${id}`);
  } catch (err) {
    throw err;
  }
};