import { apiFetch, buildUrl } from "./client";

const BASE = "/api/zoiko-hr/recruitment";

// ── Types ──

export type JobStatus = "OPEN" | "CLOSED" | "DRAFT" | "ON_HOLD";
export type CandidateStage = "APPLIED" | "SCREENING" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "INTERVIEWED" | "OFFERED" | "HIRED" | "REJECTED" | "WITHDRAWN";
export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "RESCHEDULED" | "CANCELLED";
export type OfferStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  openPositions: number;
  status: JobStatus;
  createdDate: string;
  description?: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface Candidate {
  id: string;
  name: string;
  positionApplied: string;
  email: string;
  phone: string;
  experience: number;
  currentStage: CandidateStage;
  status: string;
  appliedDate: string;
  resumeUrl?: string;
  notes?: string;
  source?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: string;
  status: InterviewStatus;
  feedback?: string;
  rating?: number;
  notes?: string;
}

export interface Offer {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  salary: number;
  currency: string;
  status: OfferStatus;
  sentDate?: string;
  responseDate?: string;
  notes?: string;
  offerLetterUrl?: string;
}

export interface RecruitmentDashboardStats {
  totalOpenPositions: number;
  activeCandidates: number;
  interviewsScheduled: number;
  offersSent: number;
  offersAccepted: number;
  hiringSuccessRate: number;
}

export interface RecruitmentFunnelData {
  stage: string;
  count: number;
}

export interface TimeToHireData {
  month: string;
  days: number;
}

export interface SourceEffectivenessData {
  source: string;
  applications: number;
  interviews: number;
  hires: number;
  conversionRate: number;
}

export interface DepartmentHireData {
  department: string;
  hires: number;
}

export interface MonthlyActivityData {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
}

// ── Dashboard ──

export async function fetchRecruitmentDashboard(): Promise<{ data: RecruitmentDashboardStats }> {
  return apiFetch<{ data: RecruitmentDashboardStats }>(`${BASE}/dashboard`);
}

// ── Job Openings ──

export async function fetchJobOpenings(filters?: {
  search?: string;
  status?: string;
  departmentId?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: string;
}): Promise<{ data: JobOpening[]; total: number; skip: number; take: number }> {
  const qs = buildUrl(BASE, {
    search: filters?.search,
    status: filters?.status,
    departmentId: filters?.departmentId,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === BASE ? BASE : qs;
  return apiFetch<{ data: JobOpening[]; total: number; skip: number; take: number }>(url);
}

export async function createJobOpening(body: {
  organizationId?: string;
  title: string;
  departmentId: string;
  location?: string;
  employmentType?: string;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  status?: string;
  openingsCount?: number;
}): Promise<{ data: JobOpening }> {
  return apiFetch<{ data: JobOpening }>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateJobOpening(id: string, body: {
  title?: string;
  departmentId?: string;
  location?: string;
  employmentType?: string;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  openingsCount?: number;
}): Promise<{ data: JobOpening }> {
  return apiFetch<{ data: JobOpening }>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function closeJobOpening(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action: "close" }),
  });
}

// ── Candidates ──

export async function fetchCandidates(filters?: {
  search?: string;
  stage?: string;
  jobId?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: string;
}): Promise<{ data: Candidate[]; total: number; skip: number; take: number }> {
  const qs = buildUrl(`${BASE}/candidates`, {
    search: filters?.search,
    stage: filters?.stage,
    jobId: filters?.jobId,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${BASE}/candidates` ? `${BASE}/candidates` : qs;
  return apiFetch<{ data: Candidate[]; total: number; skip: number; take: number }>(url);
}

export async function createCandidate(body: {
  organizationId?: string;
  jobId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  source?: string;
  stage?: string;
}): Promise<{ data: Candidate }> {
  return apiFetch<{ data: Candidate }>(`${BASE}/candidates`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateCandidateStage(id: string, stage: CandidateStage, reason?: string): Promise<{ data: Candidate }> {
  return apiFetch<{ data: Candidate }>(`${BASE}/candidates/${id}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage, reason }),
  });
}

// ── Interviews ──

export async function fetchInterviews(filters?: {
  candidateId?: string;
  jobId?: string;
  interviewerId?: string;
  status?: string;
  search?: string;
  skip?: number;
  take?: number;
}): Promise<{ data: Interview[]; total: number; skip: number; take: number }> {
  const qs = buildUrl(`${BASE}/interviews`, {
    candidateId: filters?.candidateId,
    jobId: filters?.jobId,
    interviewerId: filters?.interviewerId,
    status: filters?.status,
    search: filters?.search,
    skip: filters?.skip,
    take: filters?.take,
  });
  const url = qs === `${BASE}/interviews` ? `${BASE}/interviews` : qs;
  return apiFetch<{ data: Interview[]; total: number; skip: number; take: number }>(url);
}

export async function createInterview(body: {
  organizationId?: string;
  candidateId?: string;
  jobId?: string;
  interviewerId?: string;
  scheduledAt?: string;
  type?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
}): Promise<{ data: Interview }> {
  return apiFetch<{ data: Interview }>(`${BASE}/interviews`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateInterviewStatus(id: string, status: InterviewStatus, feedback?: string, rating?: number): Promise<{ data: Interview }> {
  return apiFetch<{ data: Interview }>(`${BASE}/interviews/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, feedback, rating }),
  });
}

// ── Offers ──

export async function fetchOffers(filters?: {
  candidateId?: string;
  jobId?: string;
  status?: string;
  search?: string;
  skip?: number;
  take?: number;
}): Promise<{ data: Offer[]; total: number; skip: number; take: number }> {
  const qs = buildUrl(`${BASE}/offers`, {
    candidateId: filters?.candidateId,
    jobId: filters?.jobId,
    status: filters?.status,
    search: filters?.search,
    skip: filters?.skip,
    take: filters?.take,
  });
  const url = qs === `${BASE}/offers` ? `${BASE}/offers` : qs;
  return apiFetch<{ data: Offer[]; total: number; skip: number; take: number }>(url);
}

export async function createOffer(body: {
  organizationId?: string;
  candidateId?: string;
  jobId?: string;
  salary?: number;
  benefits?: string;
  startDate?: string;
  expiresAt?: string;
  notes?: string;
}): Promise<{ data: Offer }> {
  return apiFetch<{ data: Offer }>(`${BASE}/offers`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateOfferStatus(id: string, status: OfferStatus, rejectionReason?: string): Promise<{ data: Offer }> {
  return apiFetch<{ data: Offer }>(`${BASE}/offers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, rejectionReason }),
  });
}

// ── Reports ──

export async function fetchRecruitmentFunnel(): Promise<{ data: RecruitmentFunnelData[] }> {
  return apiFetch<{ data: RecruitmentFunnelData[] }>(`${BASE}/reports/hiring-funnel`);
}

export async function fetchTimeToHire(): Promise<{ data: TimeToHireData[] }> {
  return apiFetch<{ data: TimeToHireData[] }>(`${BASE}/reports/time-to-hire`);
}

export async function fetchSourceEffectiveness(): Promise<{ data: SourceEffectivenessData[] }> {
  return apiFetch<{ data: SourceEffectivenessData[] }>(`${BASE}/reports/source-effectiveness`);
}

export async function fetchOfferAcceptanceRate(): Promise<{ data: number }> {
  return apiFetch<{ data: number }>(`${BASE}/reports/offer-acceptance`);
}

export async function fetchHiringByDepartment(): Promise<{ data: DepartmentHireData[] }> {
  return apiFetch<{ data: DepartmentHireData[] }>(`${BASE}/reports/department-hiring`);
}

export async function fetchMonthlyRecruitmentActivity(): Promise<{ data: MonthlyActivityData[] }> {
  return apiFetch<{ data: MonthlyActivityData[] }>(`${BASE}/reports/monthly-activity`);
}
