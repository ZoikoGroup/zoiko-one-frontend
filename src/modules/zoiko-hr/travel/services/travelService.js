import { getTravelDashboard as mockDashboard } from "../mock-data/dashboardData";
import { getTravelRequests as mockRequests } from "../mock-data/travelRequests";
import { getApprovals as mockApprovals } from "../mock-data/approvalsData";
import { getItineraries as mockItineraries } from "../mock-data/itinerariesData";
import { getExpenses as mockExpenses } from "../mock-data/expensesData";
import { getTravelReports as mockReports } from "../mock-data/reportsData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const requests = [...mockRequests()];

export async function getTravelDashboard() {
  await delay();
  return { ...mockDashboard() };
}

export async function getTravelRequests() {
  await delay();
  return [...requests];
}

export async function getTravelRequestById(id) {
  await delay();
  return requests.find((r) => r.id === Number(id)) || null;
}

export async function createTravelRequest(data) {
  await delay();
  const newReq = { id: requests.length + 1, ...data, status: "pending", createdAt: new Date().toISOString().split("T")[0], notes: data.notes || "" };
  requests.unshift(newReq);
  return { ...newReq };
}

export async function updateTravelRequest(id, data) {
  await delay();
  const idx = requests.findIndex((r) => r.id === Number(id));
  if (idx === -1) throw new Error("Travel request not found");
  requests[idx] = { ...requests[idx], ...data };
  return { ...requests[idx] };
}

export async function deleteTravelRequest(id) {
  await delay();
  const idx = requests.findIndex((r) => r.id === Number(id));
  if (idx === -1) throw new Error("Travel request not found");
  requests.splice(idx, 1);
  return { success: true };
}

export async function getApprovals() {
  await delay();
  return [...mockApprovals()];
}

export async function approveRequest(id) {
  await delay();
  const approvals = mockApprovals();
  const idx = approvals.findIndex((a) => a.id === Number(id));
  if (idx === -1) throw new Error("Approval not found");
  approvals[idx].status = "approved";
  return { ...approvals[idx] };
}

export async function rejectRequest(id) {
  await delay();
  const approvals = mockApprovals();
  const idx = approvals.findIndex((a) => a.id === Number(id));
  if (idx === -1) throw new Error("Approval not found");
  approvals[idx].status = "rejected";
  return { ...approvals[idx] };
}

export async function getItineraries() {
  await delay();
  return [...mockItineraries()];
}

export async function getExpenses() {
  await delay();
  return [...mockExpenses()];
}

export async function getTravelReports() {
  await delay();
  return [...mockReports()];
}
