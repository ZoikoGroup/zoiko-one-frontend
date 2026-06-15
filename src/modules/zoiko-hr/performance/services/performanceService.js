import { dashboardStats, goalsOKRs, kpis, feedbackList, reviews, appraisals, performanceAnalytics } from "../mock-data/index";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats() { await delay(); return { ...dashboardStats }; }
export async function getGoalsOKRs() { await delay(); return [...goalsOKRs]; }
export async function getKPIs() { await delay(); return [...kpis]; }
export async function getFeedback() { await delay(); return [...feedbackList]; }
export async function getReviews() { await delay(); return [...reviews]; }
export async function getAppraisals() { await delay(); return [...appraisals]; }
export async function getPerformanceAnalytics() { await delay(); return [...performanceAnalytics]; }
