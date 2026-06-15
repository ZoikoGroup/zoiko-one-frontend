import {
  dashboardStats, jobRequisitions, candidates,
  interviews, offers, hiringAnalytics,
} from "../mock-data/index";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats() {
  await delay();
  return { ...dashboardStats };
}

export async function getJobRequisitions() {
  await delay();
  return [...jobRequisitions];
}

export async function getCandidates(filters = {}) {
  await delay();
  let result = [...candidates];
  if (filters.status) result = result.filter((c) => c.status === filters.status);
  if (filters.position) result = result.filter((c) => c.position === filters.position);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  return result;
}

export async function getCandidateById(id) {
  await delay();
  return candidates.find((c) => c.id === Number(id)) || null;
}

export async function getInterviews() {
  await delay();
  return [...interviews];
}

export async function getOffers() {
  await delay();
  return [...offers];
}

export async function getHiringAnalytics() {
  await delay();
  return [...hiringAnalytics];
}
