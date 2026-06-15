import { getWorkforceDashboard as mockDashboard } from "../mock-data/dashboardData";
import { getWorkforcePlans as mockPlans } from "../mock-data/plansData";
import { getHeadcountData as mockHeadcount } from "../mock-data/headcountData";
import { getSuccessionPlans as mockSuccession } from "../mock-data/successionData";
import { getScenarios as mockScenarios } from "../mock-data/scenariosData";
import { getWorkforceReports as mockReports } from "../mock-data/reportsData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let plans = [...mockPlans()];
let scenarios = [...mockScenarios()];

export async function getWorkforceDashboard() {
  await delay();
  return { ...mockDashboard() };
}

export async function getWorkforcePlans() {
  await delay();
  return [...plans];
}

export async function createWorkforcePlan(data) {
  await delay();
  const newPlan = {
    id: plans.length + 1,
    ...data,
    createdBy: "Current User",
    createdDate: new Date().toISOString().split("T")[0],
    notes: "",
  };
  plans = [newPlan, ...plans];
  return newPlan;
}

export async function updateWorkforcePlan(id, data) {
  await delay();
  plans = plans.map((p) => (p.id === id ? { ...p, ...data } : p));
  return plans.find((p) => p.id === id);
}

export async function deleteWorkforcePlan(id) {
  await delay();
  plans = plans.filter((p) => p.id !== id);
  return { success: true };
}

export async function getHeadcountData() {
  await delay();
  return [...mockHeadcount()];
}

export async function getSuccessionPlans() {
  await delay();
  return [...mockSuccession()];
}

export async function getScenarios() {
  await delay();
  return [...scenarios];
}

export async function createScenario(data) {
  await delay();
  const newScenario = {
    id: scenarios.length + 1,
    ...data,
    createdDate: new Date().toISOString().split("T")[0],
  };
  scenarios = [newScenario, ...scenarios];
  return newScenario;
}

export async function getWorkforceReports() {
  await delay();
  return [...mockReports()];
}
