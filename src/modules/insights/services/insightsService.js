import { getExecutiveDashboard } from "../mock-data/dashboardData.js";
import { getWorkforceAnalytics, getWorkforceTableData } from "../mock-data/workforceData.js";
import { getPayrollAnalytics } from "../mock-data/payrollData.js";
import { getFinancialAnalytics } from "../mock-data/financialData.js";
import { getProjectAnalytics } from "../mock-data/projectData.js";
import { getInventoryAnalytics } from "../mock-data/inventoryData.js";
import { getComplianceAnalytics } from "../mock-data/complianceData.js";
import { getForecastingData } from "../mock-data/forecastingData.js";
import { getCustomReportsData, getSavedReportsData } from "../mock-data/reportsData.js";

function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchExecutiveDashboard() {
  await delay();
  return getExecutiveDashboard();
}

export async function fetchWorkforceAnalytics() {
  await delay();
  return getWorkforceAnalytics();
}

export async function fetchWorkforceTableData() {
  await delay();
  return getWorkforceTableData();
}

export async function fetchPayrollAnalytics() {
  await delay();
  return getPayrollAnalytics();
}

export async function fetchFinancialAnalytics() {
  await delay();
  return getFinancialAnalytics();
}

export async function fetchProjectAnalytics() {
  await delay();
  return getProjectAnalytics();
}

export async function fetchInventoryAnalytics() {
  await delay();
  return getInventoryAnalytics();
}

export async function fetchComplianceAnalytics() {
  await delay();
  return getComplianceAnalytics();
}

export async function fetchForecastingData() {
  await delay();
  return getForecastingData();
}

export async function fetchCustomReportsData() {
  await delay();
  return getCustomReportsData();
}

export async function fetchSavedReportsData() {
  await delay();
  return getSavedReportsData();
}
