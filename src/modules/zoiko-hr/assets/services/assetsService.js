import { getAssetsDashboard } from "../mock-data/dashboardData";
import { getAssets } from "../mock-data/assetsData";
import { getAssetRequests } from "../mock-data/assetRequests";
import { getMaintenanceRecords } from "../mock-data/maintenanceData";
import { getAssetReports } from "../mock-data/reportsData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getAssetsDashboardData() {
  await delay();
  return { ...getAssetsDashboard() };
}

export async function getAssetsList() {
  await delay();
  return [...getAssets()];
}

export async function getAssetById(id) {
  await delay();
  return getAssets().find((a) => a.id === Number(id)) || null;
}

export async function createAsset(data) {
  await delay(200);
  const newAsset = { id: Date.now(), ...data };
  return newAsset;
}

export async function updateAsset(id, data) {
  await delay(200);
  return { id, ...data };
}

export async function deleteAsset(id) {
  await delay(200);
  return { success: true };
}

export async function getAssetByEmployee(empId) {
  await delay();
  return getAssets().filter((a) => a.employeeName && a.department);
}

export async function getAssetRequestsList() {
  await delay();
  return [...getAssetRequests()];
}

export async function createAssetRequest(data) {
  await delay(200);
  return { id: Date.now(), ...data };
}

export async function getMaintenanceRecordsList() {
  await delay();
  return [...getMaintenanceRecords()];
}

export async function createMaintenanceRecord(data) {
  await delay(200);
  return { id: Date.now(), ...data };
}

export async function resolveMaintenance(id, resolution) {
  await delay(200);
  return { id, resolution, resolvedOn: new Date().toISOString().split("T")[0], status: "resolved" };
}

export async function getAssetReportsList() {
  await delay();
  return [...getAssetReports()];
}
