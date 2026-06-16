import { getComplianceDashboard as mockDashboard } from "../mock-data/dashboardData";
import { getObligations as mockObligations, getObligationsDashboard as mockObligationsDashboard } from "../mock-data/obligationsData";
import { getControls as mockControls, getControlsSummary as mockControlsSummary } from "../mock-data/controlsData";
import { getRisks as mockRisks, getRisksSummary as mockRisksSummary } from "../mock-data/risksData";
import { getAudits as mockAudits, getAuditFindings as mockAuditFindings, getAuditsSummary as mockAuditsSummary } from "../mock-data/auditsData";
import { getEvidence as mockEvidence, getEvidenceSummary as mockEvidenceSummary } from "../mock-data/evidenceData";
import { getPolicies as mockPolicies, getPoliciesSummary as mockPoliciesSummary } from "../mock-data/policiesData";
import { getCalendarEvents as mockCalendarEvents, getCalendarSummary as mockCalendarSummary } from "../mock-data/calendarData";
import { getIncidents as mockIncidents, getIncidentsSummary as mockIncidentsSummary } from "../mock-data/incidentsData";
import { getReports as mockReports, getReportsSummary as mockReportsSummary } from "../mock-data/reportsData";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getDashboard() {
  await delay();
  return { ...mockDashboard() };
}

export async function getObligations() {
  await delay();
  return [...mockObligations()];
}

export async function getObligationsDashboard() {
  await delay();
  return { ...mockObligationsDashboard() };
}

export async function getControls() {
  await delay();
  return [...mockControls()];
}

export async function getControlById(id) {
  await delay();
  return mockControls().find(c => c.id === Number(id)) || null;
}

export async function getControlsSummary() {
  await delay();
  return { ...mockControlsSummary() };
}

export async function getRisks() {
  await delay();
  return [...mockRisks()];
}

export async function getRisksSummary() {
  await delay();
  return { ...mockRisksSummary() };
}

export async function getAudits() {
  await delay();
  return [...mockAudits()];
}

export async function getAuditFindings(auditId) {
  await delay();
  return [...mockAuditFindings(auditId)];
}

export async function getAuditsSummary() {
  await delay();
  return { ...mockAuditsSummary() };
}

export async function getEvidence() {
  await delay();
  return [...mockEvidence()];
}

export async function getEvidenceSummary() {
  await delay();
  return { ...mockEvidenceSummary() };
}

export async function getPolicies() {
  await delay();
  return [...mockPolicies()];
}

export async function getPoliciesSummary() {
  await delay();
  return { ...mockPoliciesSummary() };
}

export async function getCalendarEvents() {
  await delay();
  return [...mockCalendarEvents()];
}

export async function getCalendarSummary() {
  await delay();
  return { ...mockCalendarSummary() };
}

export async function getIncidents() {
  await delay();
  return [...mockIncidents()];
}

export async function getIncidentsSummary() {
  await delay();
  return { ...mockIncidentsSummary() };
}

export async function getReports() {
  await delay();
  return [...mockReports()];
}

export async function getReportsSummary() {
  await delay();
  return { ...mockReportsSummary() };
}
