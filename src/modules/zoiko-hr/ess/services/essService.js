import { getEssDashboard, recentRequests } from "../mock-data/dashboardData";
import { getLeaveBalance, getLeaveRequests } from "../mock-data/leaveData";
import { getAttendanceSummary } from "../mock-data/attendanceData";
import { getProfile, getMyDocuments, getEssRequests } from "../mock-data/profileData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getEssDashboardData() {
  await delay();
  return { ...getEssDashboard(), recentRequests: [...recentRequests] };
}

export async function getLeaveBalanceData() {
  await delay();
  return { ...getLeaveBalance() };
}

export async function getLeaveRequestsData() {
  await delay();
  return [...getLeaveRequests()];
}

export async function createLeaveRequest(data) {
  await delay(500);
  const newReq = { id: Date.now(), ...data, status: "pending", appliedOn: new Date().toISOString().split("T")[0] };
  return newReq;
}

export async function getAttendanceSummaryData() {
  await delay();
  return { ...getAttendanceSummary() };
}

export async function getProfileData() {
  await delay();
  return { ...getProfile() };
}

export async function updateProfileData(data) {
  await delay(500);
  return { ...getProfile(), ...data };
}

export async function getMyDocumentsData() {
  await delay();
  return [...getMyDocuments()];
}

export async function getEssRequestsData() {
  await delay();
  return [...getEssRequests()];
}

export async function createEssRequestData(data) {
  await delay(500);
  const newReq = { id: Date.now(), ...data, status: "pending", createdOn: new Date().toISOString().split("T")[0], updatedOn: new Date().toISOString().split("T")[0] };
  return newReq;
}

export async function getEssSettingsData() {
  await delay();
  return {
    notifications: {
      email: true,
      push: true,
      sms: false,
      leaveUpdates: true,
      requestUpdates: true,
      attendanceReminders: true,
      documentUpdates: false,
    },
    privacy: {
      profileVisibility: "internal",
      showEmail: true,
      showPhone: false,
      showEmergencyContact: true,
    },
    documentAccess: {
      allowDownload: true,
      sharePayslips: false,
      shareCertificates: true,
    },
    preferences: {
      theme: "light",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      itemsPerPage: 10,
    },
  };
}

export async function updateEssSettingsData(data) {
  await delay(500);
  return data;
}
