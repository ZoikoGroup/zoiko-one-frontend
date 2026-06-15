import { getComplianceDashboard as mockDashboard } from "../mock-data/dashboardData";
import { getPolicies as mockPolicies } from "../mock-data/policiesData";
import { getComplianceTracking as mockTracking } from "../mock-data/trackingData";
import { getAudits as mockAudits } from "../mock-data/auditsData";
import { getViolations as mockViolations } from "../mock-data/violationsData";
import { getRiskAssessments as mockRisks } from "../mock-data/risksData";
import { getRegulations as mockRegulations } from "../mock-data/regulationsData";
import { getCorrectiveActions as mockCorrectiveActions } from "../mock-data/correctiveActionsData";
import { getComplianceReports as mockReports } from "../mock-data/reportsData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getComplianceDashboard() {
  await delay();
  return { ...mockDashboard() };
}

export async function getPolicies() {
  await delay();
  return [...mockPolicies()];
}

export async function createPolicy(data) {
  await delay();
  const policies = mockPolicies();
  const newPolicy = { id: policies.length + 1, ...data };
  return newPolicy;
}

export async function updatePolicy(id, data) {
  await delay();
  return { id, ...data };
}

export async function deletePolicy(id) {
  await delay();
  return { success: true };
}

export async function getComplianceTracking() {
  await delay();
  return [...mockTracking()];
}

export async function getAudits() {
  await delay();
  return [...mockAudits()];
}

export async function createAudit(data) {
  await delay();
  const audits = mockAudits();
  const newAudit = { id: audits.length + 1, ...data };
  return newAudit;
}

export async function getViolations() {
  await delay();
  return [...mockViolations()];
}

export async function getRiskAssessments() {
  await delay();
  return [...mockRisks()];
}

export async function getRegulations() {
  await delay();
  return [...mockRegulations()];
}

export async function getCorrectiveActions() {
  await delay();
  return [...mockCorrectiveActions()];
}

export async function createCorrectiveAction(data) {
  await delay();
  const actions = mockCorrectiveActions();
  const newAction = { id: actions.length + 1, ...data };
  return newAction;
}

export async function getComplianceReports() {
  await delay();
  return [...mockReports()];
}
