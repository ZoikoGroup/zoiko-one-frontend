import { apiFetch, buildUrl } from "./client";

const PERFORMANCE_BASE = "/api/zoiko-hr/performance";

export interface ReviewCycleRecord {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCycleListResponse {
  data: ReviewCycleRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface PerformanceReviewRecord {
  id: string;
  employeeId: string;
  reviewerId: string | null;
  cycleId: string;
  overallRating: number | null;
  status: string;
  strengths: string | null;
  improvements: string | null;
  notes: string | null;
  submittedAt: string | null;
  acknowledgedAt: string | null;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  reviewer?: { id: string; firstName: string; lastName: string; employeeId: string };
  cycle?: { id: string; name: string; startDate?: string; endDate?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  data: PerformanceReviewRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface GoalRecord {
  id: string;
  employeeId: string;
  title: string;
  description: string | null;
  category: string;
  startDate: string;
  targetDate: string | null;
  completedDate: string | null;
  status: string;
  progress: number;
  notes: string | null;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  updates?: GoalUpdateRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalListResponse {
  data: GoalRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface GoalUpdateRecord {
  id: string;
  goalId: string;
  updateText: string;
  previousProgress: number | null;
  newProgress: number | null;
  createdAt: string;
  createdBy: string | null;
}

export interface FeedbackRecord {
  id: string;
  employeeId: string;
  giverId: string | null;
  type: string;
  category: string | null;
  content: string;
  isConfidential: boolean;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  giver?: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackListResponse {
  data: FeedbackRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface PerformanceDashboardStats {
  activeCycles: number;
  totalReviews: number;
  draftReviews: number;
  submittedReviews: number;
  acknowledgedReviews: number;
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  goalCompletionPct: number;
  recentFeedbacks: FeedbackRecord[];
  topRated: PerformanceReviewRecord[];
}

// ── Dashboard ──

export async function fetchPerformanceDashboard(): Promise<{ data: PerformanceDashboardStats }> {
  return apiFetch<{ data: PerformanceDashboardStats }>(`${PERFORMANCE_BASE}/dashboard`);
}

// ── Review Cycles ──

export async function fetchCycles(filters?: {
  search?: string; status?: string; skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<ReviewCycleListResponse> {
  const qs = buildUrl(`${PERFORMANCE_BASE}/cycles`, {
    search: filters?.search,
    status: filters?.status,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${PERFORMANCE_BASE}/cycles` ? `${PERFORMANCE_BASE}/cycles` : qs;
  return apiFetch<ReviewCycleListResponse>(url);
}

export async function fetchCycle(id: string): Promise<{ data: ReviewCycleRecord }> {
  return apiFetch<{ data: ReviewCycleRecord }>(`${PERFORMANCE_BASE}/cycles/${id}`);
}

export async function createCycle(body: {
  name: string; description?: string; startDate: string; endDate: string; status?: string;
}): Promise<{ data: ReviewCycleRecord }> {
  return apiFetch<{ data: ReviewCycleRecord }>(`${PERFORMANCE_BASE}/cycles`, {
    method: "POST", body: JSON.stringify(body),
  });
}

export async function updateCycle(id: string, body: {
  name?: string; description?: string; startDate?: string; endDate?: string; status?: string;
}): Promise<{ data: ReviewCycleRecord }> {
  return apiFetch<{ data: ReviewCycleRecord }>(`${PERFORMANCE_BASE}/cycles/${id}`, {
    method: "PUT", body: JSON.stringify(body),
  });
}

export async function deleteCycle(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${PERFORMANCE_BASE}/cycles/${id}?reason=${encodeURIComponent(reason)}` : `${PERFORMANCE_BASE}/cycles/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

// ── Reviews ──

export async function fetchReviews(filters?: {
  search?: string; status?: string; employeeId?: string; cycleId?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<ReviewListResponse> {
  const qs = buildUrl(`${PERFORMANCE_BASE}/reviews`, {
    search: filters?.search,
    status: filters?.status,
    employeeId: filters?.employeeId,
    cycleId: filters?.cycleId,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${PERFORMANCE_BASE}/reviews` ? `${PERFORMANCE_BASE}/reviews` : qs;
  return apiFetch<ReviewListResponse>(url);
}

export async function fetchReview(id: string): Promise<{ data: PerformanceReviewRecord }> {
  return apiFetch<{ data: PerformanceReviewRecord }>(`${PERFORMANCE_BASE}/reviews/${id}`);
}

export async function createReview(body: {
  employeeId: string; reviewerId?: string; cycleId: string;
  overallRating?: number; status?: string; strengths?: string;
  improvements?: string; notes?: string;
}): Promise<{ data: PerformanceReviewRecord }> {
  return apiFetch<{ data: PerformanceReviewRecord }>(`${PERFORMANCE_BASE}/reviews`, {
    method: "POST", body: JSON.stringify(body),
  });
}

export async function updateReview(id: string, body: {
  reviewerId?: string; overallRating?: number; status?: string;
  strengths?: string; improvements?: string; notes?: string;
}): Promise<{ data: PerformanceReviewRecord }> {
  return apiFetch<{ data: PerformanceReviewRecord }>(`${PERFORMANCE_BASE}/reviews/${id}`, {
    method: "PUT", body: JSON.stringify(body),
  });
}

export async function deleteReview(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${PERFORMANCE_BASE}/reviews/${id}?reason=${encodeURIComponent(reason)}` : `${PERFORMANCE_BASE}/reviews/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

// ── Goals ──

export async function fetchGoals(filters?: {
  search?: string; status?: string; employeeId?: string; category?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<GoalListResponse> {
  const qs = buildUrl(`${PERFORMANCE_BASE}/goals`, {
    search: filters?.search,
    status: filters?.status,
    employeeId: filters?.employeeId,
    category: filters?.category,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${PERFORMANCE_BASE}/goals` ? `${PERFORMANCE_BASE}/goals` : qs;
  return apiFetch<GoalListResponse>(url);
}

export async function fetchGoal(id: string): Promise<{ data: GoalRecord }> {
  return apiFetch<{ data: GoalRecord }>(`${PERFORMANCE_BASE}/goals/${id}`);
}

export async function createGoal(body: {
  employeeId: string; title: string; description?: string;
  category?: string; startDate: string; targetDate?: string;
  status?: string; progress?: number; notes?: string;
}): Promise<{ data: GoalRecord }> {
  return apiFetch<{ data: GoalRecord }>(`${PERFORMANCE_BASE}/goals`, {
    method: "POST", body: JSON.stringify(body),
  });
}

export async function updateGoal(id: string, body: {
  title?: string; description?: string; category?: string;
  startDate?: string; targetDate?: string; completedDate?: string;
  status?: string; progress?: number; notes?: string;
}): Promise<{ data: GoalRecord }> {
  return apiFetch<{ data: GoalRecord }>(`${PERFORMANCE_BASE}/goals/${id}`, {
    method: "PUT", body: JSON.stringify(body),
  });
}

export async function deleteGoal(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${PERFORMANCE_BASE}/goals/${id}?reason=${encodeURIComponent(reason)}` : `${PERFORMANCE_BASE}/goals/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

export async function createGoalUpdate(goalId: string, body: {
  updateText: string; previousProgress?: number; newProgress?: number;
}): Promise<{ data: GoalUpdateRecord }> {
  return apiFetch<{ data: GoalUpdateRecord }>(`${PERFORMANCE_BASE}/goals/${goalId}/updates`, {
    method: "POST", body: JSON.stringify(body),
  });
}

// ── Feedback ──

export async function fetchFeedbacks(filters?: {
  search?: string; employeeId?: string; giverId?: string; type?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<FeedbackListResponse> {
  const qs = buildUrl(`${PERFORMANCE_BASE}/feedback`, {
    search: filters?.search,
    employeeId: filters?.employeeId,
    giverId: filters?.giverId,
    type: filters?.type,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${PERFORMANCE_BASE}/feedback` ? `${PERFORMANCE_BASE}/feedback` : qs;
  return apiFetch<FeedbackListResponse>(url);
}

export async function createFeedback(body: {
  employeeId: string; giverId?: string; type?: string;
  category?: string; content: string; isConfidential?: boolean;
}): Promise<{ data: FeedbackRecord }> {
  return apiFetch<{ data: FeedbackRecord }>(`${PERFORMANCE_BASE}/feedback`, {
    method: "POST", body: JSON.stringify(body),
  });
}

export async function deleteFeedback(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${PERFORMANCE_BASE}/feedback/${id}?reason=${encodeURIComponent(reason)}` : `${PERFORMANCE_BASE}/feedback/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}
