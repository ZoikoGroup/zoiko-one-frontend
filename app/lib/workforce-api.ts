// ── REAL API RE-EXPORTS ──
export * from "./api/workforce.api";
export * from "./api/leave.api";
export * from "./api/attendance.api";
export * from "./api/performance.api";
export * from "./api/recruitment.api";

// ═══════════════════════════════════════════════════════════════
// Employee Onboarding Management
// ═══════════════════════════════════════════════════════════════

// ── Types ──

export type OnboardingStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type DocumentVerifyStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type AssetStatus = "ASSIGNED" | "PENDING" | "RETURNED";
export type ProbationStatus = "ACTIVE" | "EXTENDED" | "CONFIRMED";
export type WelcomeKitStatus = "SENT" | "PENDING" | "ACKNOWLEDGED";

export interface NewJoiner {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
  reportingManager: string;
  status: OnboardingStatus;
  email: string;
  phone: string;
}

export interface DocumentVerification {
  id: string;
  employeeId: string;
  employeeName: string;
  aadhaarStatus: DocumentVerifyStatus;
  panStatus: DocumentVerifyStatus;
  educationStatus: DocumentVerifyStatus;
  experienceStatus: DocumentVerifyStatus;
  bankDetailsStatus: DocumentVerifyStatus;
  aadhaarNotes?: string;
  panNotes?: string;
  educationNotes?: string;
  experienceNotes?: string;
  bankNotes?: string;
}

export interface AssetAllocation {
  id: string;
  employeeId: string;
  employeeName: string;
  laptopStatus: AssetStatus;
  emailStatus: AssetStatus;
  idCardStatus: AssetStatus;
  accessCardStatus: AssetStatus;
  softwareStatus: AssetStatus;
  laptopNotes?: string;
  emailNotes?: string;
  idCardNotes?: string;
  accessCardNotes?: string;
  softwareNotes?: string;
}

export interface WelcomeKit {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  welcomeEmail: WelcomeKitStatus;
  policiesShared: WelcomeKitStatus;
  employeeHandbook: WelcomeKitStatus;
  orgStructure: WelcomeKitStatus;
  teamIntroduction: WelcomeKitStatus;
}

export interface Probation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  manager: string;
  status: ProbationStatus;
  reviewNotes?: string;
}

export interface OnboardingDashboardStats {
  pendingJoiners: number;
  joiningThisWeek: number;
  documentsPending: number;
  assetsPending: number;
  activeProbations: number;
  completedOnboarding: number;
}

export interface OnboardingCompletionRate {
  month: string;
  rate: number;
}

export interface DeptOnboardingData {
  department: string;
  onboarded: number;
}

export interface ProbationSummaryData {
  status: string;
  count: number;
}

export interface AssetSummaryData {
  type: string;
  assigned: number;
  pending: number;
}

export interface MonthlyJoiningTrend {
  month: string;
  joinings: number;
}

// ── Mock Data ──

const mockNewJoiners: NewJoiner[] = [
  { id: "nj-001", employeeName: "Rahul Sharma", employeeId: "EMP-042", department: "Engineering", designation: "Senior Frontend Developer", joiningDate: "2026-06-15", reportingManager: "Priya Patel", status: "PENDING", email: "rahul.sharma@zoiko.com", phone: "+1-555-0201" },
  { id: "nj-002", employeeName: "Sneha Reddy", employeeId: "EMP-043", department: "Engineering", designation: "Backend Engineer", joiningDate: "2026-06-10", reportingManager: "Arjun Nair", status: "IN_PROGRESS", email: "sneha.reddy@zoiko.com", phone: "+1-555-0202" },
  { id: "nj-003", employeeName: "Amit Verma", employeeId: "EMP-044", department: "Human Resources", designation: "HR Manager", joiningDate: "2026-06-01", reportingManager: "Ananya Gupta", status: "IN_PROGRESS", email: "amit.verma@zoiko.com", phone: "+1-555-0203" },
  { id: "nj-004", employeeName: "Kavita Singh", employeeId: "EMP-045", department: "Marketing", designation: "Marketing Specialist", joiningDate: "2026-06-20", reportingManager: "Rohan Joshi", status: "PENDING", email: "kavita.singh@zoiko.com", phone: "+1-555-0204" },
  { id: "nj-005", employeeName: "Vikram Patel", employeeId: "EMP-046", department: "Engineering", designation: "DevOps Engineer", joiningDate: "2026-06-12", reportingManager: "Priya Patel", status: "PENDING", email: "vikram.patel@zoiko.com", phone: "+1-555-0205" },
  { id: "nj-006", employeeName: "Neha Kapoor", employeeId: "EMP-047", department: "Design", designation: "Product Designer", joiningDate: "2026-06-22", reportingManager: "Rohan Joshi", status: "PENDING", email: "neha.kapoor@zoiko.com", phone: "+1-555-0206" },
  { id: "nj-007", employeeName: "Deepak Kumar", employeeId: "EMP-048", department: "Data", designation: "Data Analyst", joiningDate: "2026-06-08", reportingManager: "Arjun Nair", status: "IN_PROGRESS", email: "deepak.kumar@zoiko.com", phone: "+1-555-0207" },
  { id: "nj-008", employeeName: "Pooja Mehta", employeeId: "EMP-049", department: "Engineering", designation: "QA Engineer", joiningDate: "2026-05-15", reportingManager: "Priya Patel", status: "COMPLETED", email: "pooja.mehta@zoiko.com", phone: "+1-555-0208" },
  { id: "nj-009", employeeName: "Suresh Iyer", employeeId: "EMP-050", department: "Engineering", designation: "Backend Engineer", joiningDate: "2026-05-01", reportingManager: "Arjun Nair", status: "COMPLETED", email: "suresh.iyer@zoiko.com", phone: "+1-555-0209" },
  { id: "nj-010", employeeName: "Anjali Desai", employeeId: "EMP-051", department: "Marketing", designation: "Marketing Specialist", joiningDate: "2026-05-10", reportingManager: "Rohan Joshi", status: "COMPLETED", email: "anjali.desai@zoiko.com", phone: "+1-555-0210" },
];

const mockDocumentVerifications: DocumentVerification[] = [
  { id: "dv-001", employeeId: "EMP-042", employeeName: "Rahul Sharma", aadhaarStatus: "PENDING", panStatus: "PENDING", educationStatus: "PENDING", experienceStatus: "PENDING", bankDetailsStatus: "PENDING" },
  { id: "dv-002", employeeId: "EMP-043", employeeName: "Sneha Reddy", aadhaarStatus: "VERIFIED", panStatus: "VERIFIED", educationStatus: "PENDING", experienceStatus: "VERIFIED", bankDetailsStatus: "PENDING", educationNotes: "Awaiting degree certificate" },
  { id: "dv-003", employeeId: "EMP-044", employeeName: "Amit Verma", aadhaarStatus: "VERIFIED", panStatus: "VERIFIED", educationStatus: "VERIFIED", experienceStatus: "VERIFIED", bankDetailsStatus: "PENDING", bankNotes: "Bank account details not submitted" },
  { id: "dv-004", employeeId: "EMP-045", employeeName: "Kavita Singh", aadhaarStatus: "PENDING", panStatus: "PENDING", educationStatus: "PENDING", experienceStatus: "PENDING", bankDetailsStatus: "PENDING" },
  { id: "dv-005", employeeId: "EMP-046", employeeName: "Vikram Patel", aadhaarStatus: "PENDING", panStatus: "PENDING", educationStatus: "PENDING", experienceStatus: "PENDING", bankDetailsStatus: "PENDING" },
  { id: "dv-006", employeeId: "EMP-047", employeeName: "Neha Kapoor", aadhaarStatus: "PENDING", panStatus: "PENDING", educationStatus: "PENDING", experienceStatus: "PENDING", bankDetailsStatus: "PENDING" },
  { id: "dv-007", employeeId: "EMP-048", employeeName: "Deepak Kumar", aadhaarStatus: "VERIFIED", panStatus: "PENDING", educationStatus: "VERIFIED", experienceStatus: "PENDING", bankDetailsStatus: "PENDING", panNotes: "PAN card image unclear" },
  { id: "dv-008", employeeId: "EMP-049", employeeName: "Pooja Mehta", aadhaarStatus: "VERIFIED", panStatus: "VERIFIED", educationStatus: "VERIFIED", experienceStatus: "VERIFIED", bankDetailsStatus: "VERIFIED" },
  { id: "dv-009", employeeId: "EMP-050", employeeName: "Suresh Iyer", aadhaarStatus: "VERIFIED", panStatus: "VERIFIED", educationStatus: "VERIFIED", experienceStatus: "VERIFIED", bankDetailsStatus: "VERIFIED" },
  { id: "dv-010", employeeId: "EMP-051", employeeName: "Anjali Desai", aadhaarStatus: "VERIFIED", panStatus: "VERIFIED", educationStatus: "VERIFIED", experienceStatus: "VERIFIED", bankDetailsStatus: "REJECTED", bankNotes: "Invalid account number" },
];

const mockAssetAllocations: AssetAllocation[] = [
  { id: "aa-001", employeeId: "EMP-042", employeeName: "Rahul Sharma", laptopStatus: "PENDING", emailStatus: "PENDING", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "PENDING" },
  { id: "aa-002", employeeId: "EMP-043", employeeName: "Sneha Reddy", laptopStatus: "ASSIGNED", emailStatus: "ASSIGNED", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "ASSIGNED", laptopNotes: "Dell Latitude 5420", emailNotes: "sneha.reddy@zoiko.com" },
  { id: "aa-003", employeeId: "EMP-044", employeeName: "Amit Verma", laptopStatus: "ASSIGNED", emailStatus: "ASSIGNED", idCardStatus: "ASSIGNED", accessCardStatus: "ASSIGNED", softwareStatus: "ASSIGNED", laptopNotes: "MacBook Pro M3", emailNotes: "amit.verma@zoiko.com", idCardNotes: "ID: HR-044", accessCardNotes: "Floor 3 access" },
  { id: "aa-004", employeeId: "EMP-045", employeeName: "Kavita Singh", laptopStatus: "PENDING", emailStatus: "PENDING", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "PENDING" },
  { id: "aa-005", employeeId: "EMP-046", employeeName: "Vikram Patel", laptopStatus: "PENDING", emailStatus: "PENDING", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "PENDING" },
  { id: "aa-006", employeeId: "EMP-047", employeeName: "Neha Kapoor", laptopStatus: "PENDING", emailStatus: "PENDING", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "PENDING" },
  { id: "aa-007", employeeId: "EMP-048", employeeName: "Deepak Kumar", laptopStatus: "ASSIGNED", emailStatus: "PENDING", idCardStatus: "PENDING", accessCardStatus: "PENDING", softwareStatus: "PENDING", laptopNotes: "HP EliteBook 840" },
  { id: "aa-008", employeeId: "EMP-049", employeeName: "Pooja Mehta", laptopStatus: "ASSIGNED", emailStatus: "ASSIGNED", idCardStatus: "ASSIGNED", accessCardStatus: "RETURNED", softwareStatus: "ASSIGNED", accessCardNotes: "Temporary access card returned" },
  { id: "aa-009", employeeId: "EMP-050", employeeName: "Suresh Iyer", laptopStatus: "ASSIGNED", emailStatus: "ASSIGNED", idCardStatus: "ASSIGNED", accessCardStatus: "ASSIGNED", softwareStatus: "ASSIGNED" },
  { id: "aa-010", employeeId: "EMP-051", employeeName: "Anjali Desai", laptopStatus: "ASSIGNED", emailStatus: "ASSIGNED", idCardStatus: "ASSIGNED", accessCardStatus: "ASSIGNED", softwareStatus: "RETURNED", softwareNotes: "Adobe license reassigned" },
];

const mockWelcomeKits: WelcomeKit[] = [
  { id: "wk-001", employeeId: "EMP-042", employeeName: "Rahul Sharma", department: "Engineering", welcomeEmail: "PENDING", policiesShared: "PENDING", employeeHandbook: "PENDING", orgStructure: "PENDING", teamIntroduction: "PENDING" },
  { id: "wk-002", employeeId: "EMP-043", employeeName: "Sneha Reddy", department: "Engineering", welcomeEmail: "SENT", policiesShared: "SENT", employeeHandbook: "PENDING", orgStructure: "SENT", teamIntroduction: "PENDING" },
  { id: "wk-003", employeeId: "EMP-044", employeeName: "Amit Verma", department: "Human Resources", welcomeEmail: "ACKNOWLEDGED", policiesShared: "ACKNOWLEDGED", employeeHandbook: "ACKNOWLEDGED", orgStructure: "SENT", teamIntroduction: "SENT" },
  { id: "wk-004", employeeId: "EMP-045", employeeName: "Kavita Singh", department: "Marketing", welcomeEmail: "PENDING", policiesShared: "PENDING", employeeHandbook: "PENDING", orgStructure: "PENDING", teamIntroduction: "PENDING" },
  { id: "wk-005", employeeId: "EMP-046", employeeName: "Vikram Patel", department: "Engineering", welcomeEmail: "PENDING", policiesShared: "PENDING", employeeHandbook: "PENDING", orgStructure: "PENDING", teamIntroduction: "PENDING" },
  { id: "wk-006", employeeId: "EMP-047", employeeName: "Neha Kapoor", department: "Design", welcomeEmail: "PENDING", policiesShared: "PENDING", employeeHandbook: "PENDING", orgStructure: "PENDING", teamIntroduction: "PENDING" },
  { id: "wk-007", employeeId: "EMP-048", employeeName: "Deepak Kumar", department: "Data", welcomeEmail: "SENT", policiesShared: "SENT", employeeHandbook: "PENDING", orgStructure: "PENDING", teamIntroduction: "SENT" },
  { id: "wk-008", employeeId: "EMP-049", employeeName: "Pooja Mehta", department: "Engineering", welcomeEmail: "ACKNOWLEDGED", policiesShared: "ACKNOWLEDGED", employeeHandbook: "ACKNOWLEDGED", orgStructure: "ACKNOWLEDGED", teamIntroduction: "ACKNOWLEDGED" },
  { id: "wk-009", employeeId: "EMP-050", employeeName: "Suresh Iyer", department: "Engineering", welcomeEmail: "ACKNOWLEDGED", policiesShared: "ACKNOWLEDGED", employeeHandbook: "ACKNOWLEDGED", orgStructure: "ACKNOWLEDGED", teamIntroduction: "ACKNOWLEDGED" },
  { id: "wk-010", employeeId: "EMP-051", employeeName: "Anjali Desai", department: "Marketing", welcomeEmail: "ACKNOWLEDGED", policiesShared: "ACKNOWLEDGED", employeeHandbook: "ACKNOWLEDGED", orgStructure: "ACKNOWLEDGED", teamIntroduction: "ACKNOWLEDGED" },
];

const mockProbations: Probation[] = [
  { id: "pr-001", employeeId: "EMP-049", employeeName: "Pooja Mehta", department: "Engineering", startDate: "2026-05-15", endDate: "2026-08-15", manager: "Priya Patel", status: "ACTIVE", reviewNotes: "First review scheduled for June 15" },
  { id: "pr-002", employeeId: "EMP-050", employeeName: "Suresh Iyer", department: "Engineering", startDate: "2026-05-01", endDate: "2026-08-01", manager: "Arjun Nair", status: "ACTIVE", reviewNotes: "Mid-review completed - performing well" },
  { id: "pr-003", employeeId: "EMP-051", employeeName: "Anjali Desai", department: "Marketing", startDate: "2026-05-10", endDate: "2026-08-10", manager: "Rohan Joshi", status: "ACTIVE", reviewNotes: "On track for confirmation" },
  { id: "pr-004", employeeId: "EMP-043", employeeName: "Sneha Reddy", department: "Engineering", startDate: "2026-06-10", endDate: "2026-09-10", manager: "Arjun Nair", status: "ACTIVE" },
  { id: "pr-005", employeeId: "EMP-044", employeeName: "Amit Verma", department: "Human Resources", startDate: "2026-06-01", endDate: "2026-09-01", manager: "Ananya Gupta", status: "ACTIVE" },
  { id: "pr-006", employeeId: "EMP-048", employeeName: "Deepak Kumar", department: "Data", startDate: "2026-06-08", endDate: "2026-09-08", manager: "Arjun Nair", status: "ACTIVE" },
  { id: "pr-007", employeeId: "EMP-052", employeeName: "Ravi Joshi", department: "Engineering", startDate: "2026-03-01", endDate: "2026-06-01", manager: "Priya Patel", status: "EXTENDED", reviewNotes: "Extended by 1 month - needs improvement in code quality" },
  { id: "pr-008", employeeId: "EMP-053", employeeName: "Meera Nair", department: "Design", startDate: "2026-02-15", endDate: "2026-05-15", manager: "Rohan Joshi", status: "CONFIRMED", reviewNotes: "Confirmed - excellent performance" },
  { id: "pr-009", employeeId: "EMP-054", employeeName: "Arun Kumar", department: "Engineering", startDate: "2026-01-01", endDate: "2026-04-01", manager: "Arjun Nair", status: "CONFIRMED", reviewNotes: "Confirmed - strong technical skills" },
  { id: "pr-010", employeeId: "EMP-055", employeeName: "Divya Sharma", department: "Marketing", startDate: "2026-02-01", endDate: "2026-05-01", manager: "Rohan Joshi", status: "EXTENDED", reviewNotes: "Extended - needs to improve campaign performance" },
];

// ── API Functions ──

export async function fetchOnboardingDashboard(): Promise<{ data: OnboardingDashboardStats }> {
  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);
  const isThisWeek = (d: string) => {
    const date = new Date(d);
    return date >= today && date <= weekLater;
  };
  const stats: OnboardingDashboardStats = {
    pendingJoiners: mockNewJoiners.filter((j) => j.status === "PENDING").length,
    joiningThisWeek: mockNewJoiners.filter((j) => isThisWeek(j.joiningDate)).length,
    documentsPending: mockDocumentVerifications.filter((dv) => dv.aadhaarStatus === "PENDING" || dv.panStatus === "PENDING" || dv.educationStatus === "PENDING" || dv.experienceStatus === "PENDING" || dv.bankDetailsStatus === "PENDING").length,
    assetsPending: mockAssetAllocations.filter((aa) => aa.laptopStatus === "PENDING" || aa.emailStatus === "PENDING" || aa.idCardStatus === "PENDING" || aa.accessCardStatus === "PENDING" || aa.softwareStatus === "PENDING").length,
    activeProbations: mockProbations.filter((p) => p.status === "ACTIVE" || p.status === "EXTENDED").length,
    completedOnboarding: mockNewJoiners.filter((j) => j.status === "COMPLETED").length,
  };
  return { data: stats };
}

export async function fetchNewJoiners(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: NewJoiner[]; total: number; skip: number; take: number }> {
  let filtered = [...mockNewJoiners];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((j) => j.employeeName.toLowerCase().includes(s) || j.employeeId.toLowerCase().includes(s) || j.department.toLowerCase().includes(s) || j.designation.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((j) => j.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateNewJoinerStatus(id: string, status: OnboardingStatus): Promise<{ data: NewJoiner }> {
  const idx = mockNewJoiners.findIndex((j) => j.id === id);
  if (idx === -1) throw new Error("New joiner not found");
  mockNewJoiners[idx].status = status;
  return { data: mockNewJoiners[idx] };
}

export async function fetchDocumentVerifications(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: DocumentVerification[]; total: number; skip: number; take: number }> {
  let filtered = [...mockDocumentVerifications];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((dv) => dv.employeeName.toLowerCase().includes(s) || dv.employeeId.toLowerCase().includes(s));
  }
  if (filters?.status) {
    filtered = filtered.filter((dv) => dv.aadhaarStatus === filters.status || dv.panStatus === filters.status || dv.educationStatus === filters.status || dv.experienceStatus === filters.status || dv.bankDetailsStatus === filters.status);
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateDocumentStatus(id: string, field: keyof Pick<DocumentVerification, "aadhaarStatus" | "panStatus" | "educationStatus" | "experienceStatus" | "bankDetailsStatus">, status: DocumentVerifyStatus): Promise<{ data: DocumentVerification }> {
  const idx = mockDocumentVerifications.findIndex((dv) => dv.id === id);
  if (idx === -1) throw new Error("Document verification not found");
  mockDocumentVerifications[idx][field] = status;
  return { data: mockDocumentVerifications[idx] };
}

export async function fetchAssetAllocations(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: AssetAllocation[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAssetAllocations];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((aa) => aa.employeeName.toLowerCase().includes(s) || aa.employeeId.toLowerCase().includes(s));
  }
  if (filters?.status) {
    filtered = filtered.filter((aa) => aa.laptopStatus === filters.status || aa.emailStatus === filters.status || aa.idCardStatus === filters.status || aa.accessCardStatus === filters.status || aa.softwareStatus === filters.status);
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateAssetStatus(id: string, field: keyof Pick<AssetAllocation, "laptopStatus" | "emailStatus" | "idCardStatus" | "accessCardStatus" | "softwareStatus">, status: AssetStatus): Promise<{ data: AssetAllocation }> {
  const idx = mockAssetAllocations.findIndex((aa) => aa.id === id);
  if (idx === -1) throw new Error("Asset allocation not found");
  mockAssetAllocations[idx][field] = status;
  return { data: mockAssetAllocations[idx] };
}

export async function fetchWelcomeKits(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: WelcomeKit[]; total: number; skip: number; take: number }> {
  let filtered = [...mockWelcomeKits];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((wk) => wk.employeeName.toLowerCase().includes(s) || wk.employeeId.toLowerCase().includes(s) || wk.department.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateWelcomeKitStatus(id: string, field: keyof Pick<WelcomeKit, "welcomeEmail" | "policiesShared" | "employeeHandbook" | "orgStructure" | "teamIntroduction">, status: WelcomeKitStatus): Promise<{ data: WelcomeKit }> {
  const idx = mockWelcomeKits.findIndex((wk) => wk.id === id);
  if (idx === -1) throw new Error("Welcome kit not found");
  mockWelcomeKits[idx][field] = status;
  return { data: mockWelcomeKits[idx] };
}

export async function fetchProbations(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Probation[]; total: number; skip: number; take: number }> {
  let filtered = [...mockProbations];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((p) => p.employeeName.toLowerCase().includes(s) || p.employeeId.toLowerCase().includes(s) || p.department.toLowerCase().includes(s) || p.manager.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateProbationStatus(id: string, status: ProbationStatus): Promise<{ data: Probation }> {
  const idx = mockProbations.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Probation not found");
  mockProbations[idx].status = status;
  return { data: mockProbations[idx] };
}

// ── Reports ──

export async function fetchOnboardingCompletionRate(): Promise<{ data: OnboardingCompletionRate[] }> {
  return {
    data: [
      { month: "Jan", rate: 85 }, { month: "Feb", rate: 78 }, { month: "Mar", rate: 92 },
      { month: "Apr", rate: 88 }, { month: "May", rate: 95 }, { month: "Jun", rate: 82 },
    ],
  };
}

export async function fetchDeptOnboarding(): Promise<{ data: DeptOnboardingData[] }> {
  const deptMap = new Map<string, number>();
  mockNewJoiners.filter((j) => j.status === "COMPLETED" || j.status === "IN_PROGRESS").forEach((j) => {
    deptMap.set(j.department, (deptMap.get(j.department) ?? 0) + 1);
  });
  return { data: Array.from(deptMap.entries()).map(([department, onboarded]) => ({ department, onboarded })) };
}

export async function fetchProbationSummary(): Promise<{ data: ProbationSummaryData[] }> {
  const statuses: ProbationStatus[] = ["ACTIVE", "EXTENDED", "CONFIRMED"];
  return { data: statuses.map((s) => ({ status: s, count: mockProbations.filter((p) => p.status === s).length })) };
}

export async function fetchAssetSummary(): Promise<{ data: AssetSummaryData[] }> {
  return {
    data: [
      { type: "Laptop", assigned: mockAssetAllocations.filter((a) => a.laptopStatus === "ASSIGNED").length, pending: mockAssetAllocations.filter((a) => a.laptopStatus === "PENDING").length },
      { type: "Email", assigned: mockAssetAllocations.filter((a) => a.emailStatus === "ASSIGNED").length, pending: mockAssetAllocations.filter((a) => a.emailStatus === "PENDING").length },
      { type: "ID Card", assigned: mockAssetAllocations.filter((a) => a.idCardStatus === "ASSIGNED").length, pending: mockAssetAllocations.filter((a) => a.idCardStatus === "PENDING").length },
      { type: "Access Card", assigned: mockAssetAllocations.filter((a) => a.accessCardStatus === "ASSIGNED").length, pending: mockAssetAllocations.filter((a) => a.accessCardStatus === "PENDING").length },
      { type: "Software", assigned: mockAssetAllocations.filter((a) => a.softwareStatus === "ASSIGNED").length, pending: mockAssetAllocations.filter((a) => a.softwareStatus === "PENDING").length },
    ],
  };
}

export async function fetchMonthlyJoiningTrends(): Promise<{ data: MonthlyJoiningTrend[] }> {
  return {
    data: [
      { month: "Jan", joinings: 3 }, { month: "Feb", joinings: 5 }, { month: "Mar", joinings: 2 },
      { month: "Apr", joinings: 6 }, { month: "May", joinings: 4 }, { month: "Jun", joinings: 7 },
    ],
  };
}

// ── Asset Management Types ──

export type AssetItemStatus = "ACTIVE" | "UNDER_REPAIR" | "RETIRED";
export type AssetAllocationStatus = "ALLOCATED" | "RETURNED";
export type AssetMaintenanceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface AssetItem {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  brand: string;
  model: string;
  purchaseDate: string;
  status: AssetItemStatus;
  assignedTo?: string;
}

export interface AssetAllocationRecord {
  id: string;
  employee: string;
  asset: string;
  department: string;
  allocatedDate: string;
  returnDate: string;
  status: AssetAllocationStatus;
}

export interface AssetReturnRecord {
  id: string;
  asset: string;
  employee: string;
  returnedDate: string;
  condition: string;
  remarks: string;
}

export interface AssetMaintenanceRecord {
  id: string;
  asset: string;
  issueReported: string;
  assignedVendor: string;
  cost: number;
  status: AssetMaintenanceStatus;
  reportedDate: string;
}

export interface AssetDashboardStats {
  totalAssets: number;
  allocatedAssets: number;
  availableAssets: number;
  assetsUnderMaintenance: number;
  returnedAssets: number;
  assetUtilizationPercent: number;
}

export interface AssetUtilizationData {
  month: string;
  utilized: number;
  idle: number;
}

export interface DeptAllocationData {
  department: string;
  count: number;
}

export interface MaintenanceCostData {
  month: string;
  cost: number;
}

export interface AssetLifecycleData {
  status: string;
  count: number;
}

// ── Mock Data ──

const mockAssets: AssetItem[] = [
  { id: "ast-001", assetId: "AST-001", assetName: "MacBook Pro 16\"", category: "Laptops", brand: "Apple", model: "M3 Pro", purchaseDate: "2025-01-15", status: "ACTIVE", assignedTo: "Alice Johnson" },
  { id: "ast-002", assetId: "AST-002", assetName: "Dell UltraSharp 27\"", category: "Monitors", brand: "Dell", model: "U2723QE", purchaseDate: "2025-01-20", status: "ACTIVE", assignedTo: "Bob Smith" },
  { id: "ast-003", assetId: "AST-003", assetName: "Samsung Galaxy S24", category: "Mobiles", brand: "Samsung", model: "S24", purchaseDate: "2025-02-01", status: "UNDER_REPAIR" },
  { id: "ast-004", assetId: "AST-004", assetName: "HID Proximity Card", category: "Access Cards", brand: "HID", model: "Prox", purchaseDate: "2025-01-10", status: "ACTIVE" },
  { id: "ast-005", assetId: "AST-005", assetName: "MS 365 Business Premium", category: "Software Licenses", brand: "Microsoft", model: "Business Premium", purchaseDate: "2025-01-01", status: "ACTIVE", assignedTo: "Charlie Brown" },
  { id: "ast-006", assetId: "AST-006", assetName: "Lenovo ThinkPad X1", category: "Laptops", brand: "Lenovo", model: "X1 Carbon Gen 11", purchaseDate: "2025-02-15", status: "ACTIVE", assignedTo: "Diana Prince" },
  { id: "ast-007", assetId: "AST-007", assetName: "LG 32\" 4K Monitor", category: "Monitors", brand: "LG", model: "32UN880-B", purchaseDate: "2025-03-01", status: "ACTIVE", assignedTo: "Edward Norton" },
  { id: "ast-008", assetId: "AST-008", assetName: "iPhone 15 Pro", category: "Mobiles", brand: "Apple", model: "15 Pro", purchaseDate: "2025-03-10", status: "RETIRED" },
  { id: "ast-009", assetId: "AST-009", assetName: "MIFARE Classic Card", category: "Access Cards", brand: "NXP", model: "MIFARE", purchaseDate: "2025-02-20", status: "ACTIVE", assignedTo: "Fiona Apple" },
  { id: "ast-010", assetId: "AST-010", assetName: "Adobe Creative Cloud", category: "Software Licenses", brand: "Adobe", model: "All Apps", purchaseDate: "2025-01-05", status: "ACTIVE", assignedTo: "George Lucas" },
  { id: "ast-011", assetId: "AST-011", assetName: "Herman Miller Aeron", category: "Other Equipment", brand: "Herman Miller", model: "Aeron", purchaseDate: "2025-04-01", status: "ACTIVE", assignedTo: "Hannah Montana" },
  { id: "ast-012", assetId: "AST-012", assetName: "HP EliteBook 840", category: "Laptops", brand: "HP", model: "EliteBook 840 G10", purchaseDate: "2025-04-15", status: "UNDER_REPAIR" },
  { id: "ast-013", assetId: "AST-013", assetName: "Dell 24\" Monitor", category: "Monitors", brand: "Dell", model: "P2422H", purchaseDate: "2025-05-01", status: "ACTIVE", assignedTo: "Ian Malcolm" },
  { id: "ast-014", assetId: "AST-014", assetName: "Google Pixel 8", category: "Mobiles", brand: "Google", model: "Pixel 8", purchaseDate: "2025-05-10", status: "ACTIVE" },
  { id: "ast-015", assetId: "AST-015", assetName: "iClass SE Reader", category: "Access Cards", brand: "HID", model: "iClass SE", purchaseDate: "2025-03-15", status: "RETIRED" },
  { id: "ast-016", assetId: "AST-016", assetName: "Slack Enterprise Grid", category: "Software Licenses", brand: "Slack", model: "Enterprise", purchaseDate: "2025-01-20", status: "ACTIVE", assignedTo: "Jane Doe" },
  { id: "ast-017", assetId: "AST-017", assetName: "Jarvis Standing Desk", category: "Other Equipment", brand: "Jarvis", model: "Bamboo", purchaseDate: "2025-06-01", status: "ACTIVE", assignedTo: "Kevin Hart" },
  { id: "ast-018", assetId: "AST-018", assetName: "MacBook Air 15\"", category: "Laptops", brand: "Apple", model: "M3", purchaseDate: "2025-06-15", status: "ACTIVE" },
  { id: "ast-019", assetId: "AST-019", assetName: "Samsung 49\" Ultrawide", category: "Monitors", brand: "Samsung", model: "CRG9", purchaseDate: "2025-07-01", status: "ACTIVE", assignedTo: "Laura Croft" },
  { id: "ast-020", assetId: "AST-020", assetName: "OnePlus 12", category: "Mobiles", brand: "OnePlus", model: "12", purchaseDate: "2025-07-15", status: "ACTIVE", assignedTo: "Mike Ross" },
];

const mockAllocations: AssetAllocationRecord[] = [
  { id: "alloc-001", employee: "Alice Johnson", asset: "MacBook Pro 16\"", department: "Engineering", allocatedDate: "2025-01-20", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-002", employee: "Bob Smith", asset: "Dell UltraSharp 27\"", department: "Engineering", allocatedDate: "2025-01-25", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-003", employee: "Charlie Brown", asset: "MS 365 Business Premium", department: "Marketing", allocatedDate: "2025-02-01", returnDate: "2025-05-01", status: "RETURNED" },
  { id: "alloc-004", employee: "Diana Prince", asset: "Lenovo ThinkPad X1", department: "HR", allocatedDate: "2025-02-20", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-005", employee: "Edward Norton", asset: "LG 32\" 4K Monitor", department: "Design", allocatedDate: "2025-03-05", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-006", employee: "Fiona Apple", asset: "MIFARE Classic Card", department: "Marketing", allocatedDate: "2025-02-25", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-007", employee: "George Lucas", asset: "Adobe Creative Cloud", department: "Design", allocatedDate: "2025-01-10", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-008", employee: "Hannah Montana", asset: "Herman Miller Aeron", department: "HR", allocatedDate: "2025-04-05", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-009", employee: "Ian Malcolm", asset: "Dell 24\" Monitor", department: "Engineering", allocatedDate: "2025-05-05", returnDate: "2025-06-05", status: "RETURNED" },
  { id: "alloc-010", employee: "Jane Doe", asset: "Slack Enterprise Grid", department: "Engineering", allocatedDate: "2025-01-25", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-011", employee: "Kevin Hart", asset: "Jarvis Standing Desk", department: "Data", allocatedDate: "2025-06-05", returnDate: "", status: "ALLOCATED" },
  { id: "alloc-012", employee: "Laura Croft", asset: "Samsung 49\" Ultrawide", department: "Design", allocatedDate: "2025-07-05", returnDate: "", status: "ALLOCATED" },
];

const mockReturns: AssetReturnRecord[] = [
  { id: "ret-001", asset: "MS 365 Business Premium", employee: "Charlie Brown", returnedDate: "2025-05-01", condition: "Good", remarks: "License no longer needed" },
  { id: "ret-002", asset: "Dell 24\" Monitor", employee: "Ian Malcolm", returnedDate: "2025-06-05", condition: "Excellent", remarks: "Upgraded to ultrawide" },
  { id: "ret-003", asset: "iPhone 15 Pro", employee: "System", returnedDate: "2025-04-01", condition: "Damaged", remarks: "Screen cracked, sent for disposal" },
  { id: "ret-004", asset: "iClass SE Reader", employee: "System", returnedDate: "2025-04-15", condition: "Fair", remarks: "Retired from active use" },
  { id: "ret-005", asset: "Samsung Galaxy S24", employee: "System", returnedDate: "2025-06-01", condition: "Good", remarks: "Returned after repair" },
];

const mockMaintenance: AssetMaintenanceRecord[] = [
  { id: "mnt-001", asset: "Samsung Galaxy S24", issueReported: "Battery draining fast", assignedVendor: "Samsung Care", cost: 150, status: "IN_PROGRESS", reportedDate: "2025-05-15" },
  { id: "mnt-002", asset: "HP EliteBook 840", issueReported: "Keyboard not working", assignedVendor: "HP Support", cost: 200, status: "PENDING", reportedDate: "2025-06-01" },
  { id: "mnt-003", asset: "MacBook Pro 16\"", issueReported: "Fan noise", assignedVendor: "Apple Service", cost: 0, status: "COMPLETED", reportedDate: "2025-03-10" },
  { id: "mnt-004", asset: "Dell UltraSharp 27\"", issueReported: "Display flickering", assignedVendor: "Dell ProSupport", cost: 350, status: "COMPLETED", reportedDate: "2025-04-20" },
  { id: "mnt-005", asset: "Lenovo ThinkPad X1", issueReported: "Battery replacement", assignedVendor: "Lenovo Depot", cost: 180, status: "PENDING", reportedDate: "2025-06-10" },
];

// ── Asset Management APIs ──

export async function fetchAssetDashboard(): Promise<{ data: AssetDashboardStats }> {
  const totalAssets = mockAssets.length;
  const allocatedAssets = mockAllocations.filter((a) => a.status === "ALLOCATED").length;
  const availableAssets = mockAssets.filter((a) => a.status === "ACTIVE" && !a.assignedTo).length;
  const assetsUnderMaintenance = mockAssets.filter((a) => a.status === "UNDER_REPAIR").length;
  const returnedAssets = mockAllocations.filter((a) => a.status === "RETURNED").length;
  const assetUtilizationPercent = totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 100) : 0;
  return {
    data: { totalAssets, allocatedAssets, availableAssets, assetsUnderMaintenance, returnedAssets, assetUtilizationPercent },
  };
}

export async function fetchAssets(filters?: { search?: string; category?: string; status?: string; skip?: number; take?: number }): Promise<{ data: AssetItem[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAssets];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetId.toLowerCase().includes(s) || a.brand.toLowerCase().includes(s) || a.model.toLowerCase().includes(s));
  }
  if (filters?.category) filtered = filtered.filter((a) => a.category === filters.category);
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateAssetItemStatus(id: string, status: AssetItemStatus): Promise<{ data: AssetItem }> {
  const idx = mockAssets.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Asset not found");
  mockAssets[idx].status = status;
  return { data: mockAssets[idx] };
}

export async function fetchAllocationRecords(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: AssetAllocationRecord[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAllocations];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.employee.toLowerCase().includes(s) || a.asset.toLowerCase().includes(s) || a.department.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchReturnRecords(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: AssetReturnRecord[]; total: number; skip: number; take: number }> {
  let filtered = [...mockReturns];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((r) => r.asset.toLowerCase().includes(s) || r.employee.toLowerCase().includes(s) || r.condition.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchMaintenanceRecords(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: AssetMaintenanceRecord[]; total: number; skip: number; take: number }> {
  let filtered = [...mockMaintenance];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((m) => m.asset.toLowerCase().includes(s) || m.issueReported.toLowerCase().includes(s) || m.assignedVendor.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((m) => m.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function updateMaintenanceStatus(id: string, status: AssetMaintenanceStatus): Promise<{ data: AssetMaintenanceRecord }> {
  const idx = mockMaintenance.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Maintenance record not found");
  mockMaintenance[idx].status = status;
  return { data: mockMaintenance[idx] };
}

export async function fetchAssetUtilization(): Promise<{ data: AssetUtilizationData[] }> {
  return {
    data: [
      { month: "Jan", utilized: 12, idle: 8 }, { month: "Feb", utilized: 14, idle: 6 },
      { month: "Mar", utilized: 15, idle: 5 }, { month: "Apr", utilized: 13, idle: 7 },
      { month: "May", utilized: 16, idle: 4 }, { month: "Jun", utilized: 15, idle: 5 },
    ],
  };
}

export async function fetchDeptAllocation(): Promise<{ data: DeptAllocationData[] }> {
  const deptMap = new Map<string, number>();
  mockAllocations.filter((a) => a.status === "ALLOCATED").forEach((a) => {
    deptMap.set(a.department, (deptMap.get(a.department) ?? 0) + 1);
  });
  return { data: Array.from(deptMap.entries()).map(([department, count]) => ({ department, count })) };
}

export async function fetchMaintenanceCost(): Promise<{ data: MaintenanceCostData[] }> {
  return {
    data: [
      { month: "Jan", cost: 0 }, { month: "Feb", cost: 350 }, { month: "Mar", cost: 0 },
      { month: "Apr", cost: 350 }, { month: "May", cost: 150 }, { month: "Jun", cost: 380 },
    ],
  };
}

export async function fetchAssetLifecycle(): Promise<{ data: AssetLifecycleData[] }> {
  const statuses: AssetItemStatus[] = ["ACTIVE", "UNDER_REPAIR", "RETIRED"];
  return { data: statuses.map((s) => ({ status: s, count: mockAssets.filter((a) => a.status === s).length })) };
}

// ── Learning & Development (LMS) Types ──

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
export type CompletionStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
export type CertStatus = "ACTIVE" | "EXPIRED";
export type PathStatus = "ACTIVE" | "ARCHIVED";

export interface Course {
  id: string;
  courseName: string;
  category: string;
  instructor: string;
  duration: string;
  level: CourseLevel;
  status: CourseStatus;
  enrolledCount: number;
}

export interface LearningPath {
  id: string;
  pathName: string;
  numberOfCourses: number;
  completionPercent: number;
  assignedEmployees: number;
  status: PathStatus;
}

export interface Certification {
  id: string;
  employee: string;
  certification: string;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
}

export interface Assessment {
  id: string;
  assessmentName: string;
  course: string;
  totalMarks: number;
  passingMarks: number;
  attempts: number;
}

export interface Enrollment {
  id: string;
  employee: string;
  course: string;
  enrollmentDate: string;
  progress: number;
  completionStatus: CompletionStatus;
}

export interface LMSDashboardStats {
  totalCourses: number;
  activeLearners: number;
  completedCourses: number;
  certificationsEarned: number;
  pendingAssessments: number;
  learningCompletionRate: number;
}

export interface LearningProgressData {
  employee: string;
  course: string;
  progress: number;
  status: string;
}

export interface CertificationReportData {
  certification: string;
  issued: number;
  expired: number;
  active: number;
}

export interface CourseCompletionData {
  courseName: string;
  enrolled: number;
  completed: number;
  completionRate: number;
}

export interface DeptLearningData {
  department: string;
  enrolled: number;
  completed: number;
}

export interface SkillTrendData {
  month: string;
  beginners: number;
  intermediate: number;
  advanced: number;
}

// ── LMS Mock Data ──

const mockCourses: Course[] = [
  { id: "crs-001", courseName: "Leadership Essentials", category: "Management", instructor: "Dr. Sarah Chen", duration: "6 Weeks", level: "ADVANCED", status: "ACTIVE", enrolledCount: 45 },
  { id: "crs-002", courseName: "Advanced JavaScript", category: "Engineering", instructor: "James Wilson", duration: "8 Weeks", level: "ADVANCED", status: "ACTIVE", enrolledCount: 32 },
  { id: "crs-003", courseName: "Data Analytics Fundamentals", category: "Data", instructor: "Maria Garcia", duration: "4 Weeks", level: "BEGINNER", status: "ACTIVE", enrolledCount: 58 },
  { id: "crs-004", courseName: "UI/UX Design Principles", category: "Design", instructor: "Alex Turner", duration: "6 Weeks", level: "INTERMEDIATE", status: "ACTIVE", enrolledCount: 27 },
  { id: "crs-005", courseName: "Cloud Architecture", category: "Engineering", instructor: "Priya Patel", duration: "10 Weeks", level: "ADVANCED", status: "ACTIVE", enrolledCount: 21 },
  { id: "crs-006", courseName: "Effective Communication", category: "Soft Skills", instructor: "Emily Brooks", duration: "3 Weeks", level: "BEGINNER", status: "ACTIVE", enrolledCount: 63 },
  { id: "crs-007", courseName: "Project Management Professional", category: "Management", instructor: "Robert Kim", duration: "8 Weeks", level: "INTERMEDIATE", status: "ACTIVE", enrolledCount: 39 },
  { id: "crs-008", courseName: "Machine Learning Basics", category: "Data", instructor: "Dr. Sarah Chen", duration: "8 Weeks", level: "INTERMEDIATE", status: "DRAFT", enrolledCount: 0 },
  { id: "crs-009", courseName: "Cybersecurity Awareness", category: "Security", instructor: "Mark Thompson", duration: "2 Weeks", level: "BEGINNER", status: "ACTIVE", enrolledCount: 74 },
  { id: "crs-010", courseName: "Agile & Scrum Mastery", category: "Management", instructor: "Lisa Wang", duration: "4 Weeks", level: "INTERMEDIATE", status: "ACTIVE", enrolledCount: 41 },
  { id: "crs-011", courseName: "Python for Automation", category: "Engineering", instructor: "James Wilson", duration: "6 Weeks", level: "INTERMEDIATE", status: "ACTIVE", enrolledCount: 35 },
  { id: "crs-012", courseName: "Digital Marketing Strategy", category: "Marketing", instructor: "Sophie Martin", duration: "5 Weeks", level: "INTERMEDIATE", status: "ACTIVE", enrolledCount: 29 },
  { id: "crs-013", courseName: "Stress Management & Mindfulness", category: "Wellness", instructor: "Dr. Emily Brooks", duration: "4 Weeks", level: "BEGINNER", status: "ACTIVE", enrolledCount: 52 },
  { id: "crs-014", courseName: "Advanced SQL & Databases", category: "Data", instructor: "Maria Garcia", duration: "6 Weeks", level: "ADVANCED", status: "ARCHIVED", enrolledCount: 18 },
  { id: "crs-015", courseName: "Copywriting for Business", category: "Marketing", instructor: "Sophie Martin", duration: "3 Weeks", level: "BEGINNER", status: "DRAFT", enrolledCount: 0 },
];

const mockLearningPaths: LearningPath[] = [
  { id: "lp-001", pathName: "Engineering Excellence", numberOfCourses: 4, completionPercent: 65, assignedEmployees: 28, status: "ACTIVE" },
  { id: "lp-002", pathName: "Management Track", numberOfCourses: 3, completionPercent: 42, assignedEmployees: 18, status: "ACTIVE" },
  { id: "lp-003", pathName: "Data Science Journey", numberOfCourses: 5, completionPercent: 28, assignedEmployees: 15, status: "ACTIVE" },
  { id: "lp-004", pathName: "Design Thinking", numberOfCourses: 3, completionPercent: 71, assignedEmployees: 12, status: "ACTIVE" },
  { id: "lp-005", pathName: "Security Fundamentals", numberOfCourses: 2, completionPercent: 89, assignedEmployees: 35, status: "ACTIVE" },
  { id: "lp-006", pathName: "Marketing Mastery", numberOfCourses: 4, completionPercent: 33, assignedEmployees: 10, status: "ACTIVE" },
  { id: "lp-007", pathName: "Leadership Development", numberOfCourses: 5, completionPercent: 15, assignedEmployees: 22, status: "ACTIVE" },
  { id: "lp-008", pathName: "Legacy Track - Old Courses", numberOfCourses: 3, completionPercent: 100, assignedEmployees: 8, status: "ARCHIVED" },
];

const mockCertifications: Certification[] = [
  { id: "cert-001", employee: "Alice Johnson", certification: "AWS Solutions Architect", issueDate: "2025-03-15", expiryDate: "2027-03-15", status: "ACTIVE" },
  { id: "cert-002", employee: "Bob Smith", certification: "Google Cloud Professional", issueDate: "2025-01-20", expiryDate: "2027-01-20", status: "ACTIVE" },
  { id: "cert-003", employee: "Charlie Brown", certification: "PMP Certification", issueDate: "2024-06-10", expiryDate: "2026-06-10", status: "ACTIVE" },
  { id: "cert-004", employee: "Diana Prince", certification: "Scrum Master", issueDate: "2025-05-01", expiryDate: "2027-05-01", status: "ACTIVE" },
  { id: "cert-005", employee: "Edward Norton", certification: "Certified Data Analyst", issueDate: "2025-02-15", expiryDate: "2027-02-15", status: "ACTIVE" },
  { id: "cert-006", employee: "Fiona Apple", certification: "AWS Solutions Architect", issueDate: "2023-03-01", expiryDate: "2025-03-01", status: "EXPIRED" },
  { id: "cert-007", employee: "George Lucas", certification: "Microsoft Azure Fundamentals", issueDate: "2025-06-20", expiryDate: "2027-06-20", status: "ACTIVE" },
  { id: "cert-008", employee: "Hannah Montana", certification: "CISSP", issueDate: "2024-09-10", expiryDate: "2026-09-10", status: "ACTIVE" },
  { id: "cert-009", employee: "Ian Malcolm", certification: "Google Cloud Professional", issueDate: "2024-01-15", expiryDate: "2026-01-15", status: "EXPIRED" },
  { id: "cert-010", employee: "Jane Doe", certification: "Certified Kubernetes Admin", issueDate: "2025-04-05", expiryDate: "2027-04-05", status: "ACTIVE" },
  { id: "cert-011", employee: "Kevin Hart", certification: "TOGAF 9 Certified", issueDate: "2025-07-01", expiryDate: "2027-07-01", status: "ACTIVE" },
  { id: "cert-012", employee: "Laura Croft", certification: "PMP Certification", issueDate: "2023-08-20", expiryDate: "2025-08-20", status: "EXPIRED" },
];

const mockAssessments: Assessment[] = [
  { id: "asm-001", assessmentName: "Leadership Final Exam", course: "Leadership Essentials", totalMarks: 100, passingMarks: 60, attempts: 45 },
  { id: "asm-002", assessmentName: "JS Core Concepts Quiz", course: "Advanced JavaScript", totalMarks: 50, passingMarks: 35, attempts: 32 },
  { id: "asm-003", assessmentName: "Data Analytics Test", course: "Data Analytics Fundamentals", totalMarks: 80, passingMarks: 50, attempts: 58 },
  { id: "asm-004", assessmentName: "Design Principles Quiz", course: "UI/UX Design Principles", totalMarks: 40, passingMarks: 28, attempts: 27 },
  { id: "asm-005", assessmentName: "Cloud Architecture Final", course: "Cloud Architecture", totalMarks: 100, passingMarks: 65, attempts: 21 },
  { id: "asm-006", assessmentName: "Communication Skills Test", course: "Effective Communication", totalMarks: 60, passingMarks: 40, attempts: 63 },
  { id: "asm-007", assessmentName: "PMP Mock Exam", course: "Project Management Professional", totalMarks: 100, passingMarks: 70, attempts: 39 },
  { id: "asm-008", assessmentName: "Cybersecurity Quiz", course: "Cybersecurity Awareness", totalMarks: 30, passingMarks: 20, attempts: 74 },
  { id: "asm-009", assessmentName: "Agile Principles Test", course: "Agile & Scrum Mastery", totalMarks: 50, passingMarks: 35, attempts: 41 },
  { id: "asm-010", assessmentName: "Python Coding Challenge", course: "Python for Automation", totalMarks: 100, passingMarks: 60, attempts: 35 },
];

const mockEnrollments: Enrollment[] = [
  { id: "enr-001", employee: "Alice Johnson", course: "Leadership Essentials", enrollmentDate: "2026-01-15", progress: 85, completionStatus: "IN_PROGRESS" },
  { id: "enr-002", employee: "Bob Smith", course: "Advanced JavaScript", enrollmentDate: "2026-02-01", progress: 100, completionStatus: "COMPLETED" },
  { id: "enr-003", employee: "Charlie Brown", course: "Data Analytics Fundamentals", enrollmentDate: "2026-03-10", progress: 45, completionStatus: "IN_PROGRESS" },
  { id: "enr-004", employee: "Diana Prince", course: "UI/UX Design Principles", enrollmentDate: "2026-02-20", progress: 100, completionStatus: "COMPLETED" },
  { id: "enr-005", employee: "Edward Norton", course: "Cloud Architecture", enrollmentDate: "2026-04-01", progress: 20, completionStatus: "IN_PROGRESS" },
  { id: "enr-006", employee: "Fiona Apple", course: "Effective Communication", enrollmentDate: "2026-03-15", progress: 0, completionStatus: "NOT_STARTED" },
  { id: "enr-007", employee: "George Lucas", course: "Project Management Professional", enrollmentDate: "2026-05-01", progress: 60, completionStatus: "IN_PROGRESS" },
  { id: "enr-008", employee: "Hannah Montana", course: "Cybersecurity Awareness", enrollmentDate: "2026-04-10", progress: 100, completionStatus: "COMPLETED" },
  { id: "enr-009", employee: "Ian Malcolm", course: "Agile & Scrum Mastery", enrollmentDate: "2026-05-15", progress: 30, completionStatus: "IN_PROGRESS" },
  { id: "enr-010", employee: "Jane Doe", course: "Python for Automation", enrollmentDate: "2026-06-01", progress: 10, completionStatus: "IN_PROGRESS" },
  { id: "enr-011", employee: "Kevin Hart", course: "Digital Marketing Strategy", enrollmentDate: "2026-06-10", progress: 100, completionStatus: "COMPLETED" },
  { id: "enr-012", employee: "Laura Croft", course: "Leadership Essentials", enrollmentDate: "2026-04-20", progress: 0, completionStatus: "NOT_STARTED" },
  { id: "enr-013", employee: "Mike Ross", course: "Data Analytics Fundamentals", enrollmentDate: "2026-05-05", progress: 75, completionStatus: "IN_PROGRESS" },
  { id: "enr-014", employee: "Nina Williams", course: "Effective Communication", enrollmentDate: "2026-06-15", progress: 100, completionStatus: "COMPLETED" },
  { id: "enr-015", employee: "Oliver Queen", course: "Stress Management & Mindfulness", enrollmentDate: "2026-06-20", progress: 15, completionStatus: "IN_PROGRESS" },
];

// ── LMS API Functions ──

export async function fetchLMSDashboard(): Promise<{ data: LMSDashboardStats }> {
  const totalCourses = mockCourses.filter((c) => c.status === "ACTIVE" || c.status === "DRAFT").length;
  const activeLearners = mockEnrollments.filter((e) => e.completionStatus === "IN_PROGRESS").length;
  const completedCourses = mockEnrollments.filter((e) => e.completionStatus === "COMPLETED").length;
  const certificationsEarned = mockCertifications.filter((c) => c.status === "ACTIVE").length;
  const pendingAssessments = mockAssessments.reduce((sum, a) => sum + a.attempts, 0) - mockAssessments.length;
  const totalEnrollments = mockEnrollments.length;
  const learningCompletionRate = totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0;
  return {
    data: { totalCourses, activeLearners, completedCourses, certificationsEarned, pendingAssessments, learningCompletionRate },
  };
}

export async function fetchCourses(filters?: { search?: string; category?: string; level?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Course[]; total: number; skip: number; take: number }> {
  let filtered = [...mockCourses];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.courseName.toLowerCase().includes(s) || c.instructor.toLowerCase().includes(s) || c.category.toLowerCase().includes(s));
  }
  if (filters?.category) filtered = filtered.filter((c) => c.category === filters.category);
  if (filters?.level) filtered = filtered.filter((c) => c.level === filters.level);
  if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchLearningPaths(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: LearningPath[]; total: number; skip: number; take: number }> {
  let filtered = [...mockLearningPaths];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((p) => p.pathName.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchCertifications(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Certification[]; total: number; skip: number; take: number }> {
  let filtered = [...mockCertifications];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.employee.toLowerCase().includes(s) || c.certification.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchAssessments(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: Assessment[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAssessments];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.assessmentName.toLowerCase().includes(s) || a.course.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchEnrollments(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Enrollment[]; total: number; skip: number; take: number }> {
  let filtered = [...mockEnrollments];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((e) => e.employee.toLowerCase().includes(s) || e.course.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((e) => e.completionStatus === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchLearningProgress(): Promise<{ data: LearningProgressData[] }> {
  return {
    data: [
      { employee: "Alice Johnson", course: "Leadership Essentials", progress: 85, status: "IN_PROGRESS" },
      { employee: "Bob Smith", course: "Advanced JavaScript", progress: 100, status: "COMPLETED" },
      { employee: "Charlie Brown", course: "Data Analytics Fundamentals", progress: 45, status: "IN_PROGRESS" },
      { employee: "Diana Prince", course: "UI/UX Design Principles", progress: 100, status: "COMPLETED" },
      { employee: "Edward Norton", course: "Cloud Architecture", progress: 20, status: "IN_PROGRESS" },
      { employee: "Fiona Apple", course: "Effective Communication", progress: 0, status: "NOT_STARTED" },
      { employee: "George Lucas", course: "Project Management Professional", progress: 60, status: "IN_PROGRESS" },
      { employee: "Hannah Montana", course: "Cybersecurity Awareness", progress: 100, status: "COMPLETED" },
      { employee: "Ian Malcolm", course: "Agile & Scrum Mastery", progress: 30, status: "IN_PROGRESS" },
      { employee: "Jane Doe", course: "Python for Automation", progress: 10, status: "IN_PROGRESS" },
    ],
  };
}

export async function fetchCertificationReports(): Promise<{ data: CertificationReportData[] }> {
  return {
    data: [
      { certification: "AWS Solutions Architect", issued: 2, expired: 1, active: 1 },
      { certification: "Google Cloud Professional", issued: 2, expired: 1, active: 1 },
      { certification: "PMP Certification", issued: 2, expired: 1, active: 1 },
      { certification: "Scrum Master", issued: 1, expired: 0, active: 1 },
      { certification: "Microsoft Azure Fundamentals", issued: 1, expired: 0, active: 1 },
      { certification: "CISSP", issued: 1, expired: 0, active: 1 },
      { certification: "Certified Kubernetes Admin", issued: 1, expired: 0, active: 1 },
      { certification: "TOGAF 9 Certified", issued: 1, expired: 0, active: 1 },
    ],
  };
}

export async function fetchCourseCompletionData(): Promise<{ data: CourseCompletionData[] }> {
  return {
    data: mockCourses.filter((c) => c.status === "ACTIVE").map((c) => {
      const enrolled = c.enrolledCount;
      const completed = mockEnrollments.filter((e) => e.course === c.courseName && e.completionStatus === "COMPLETED").length;
      return { courseName: c.courseName, enrolled, completed, completionRate: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0 };
    }),
  };
}

export async function fetchDeptLearningStats(): Promise<{ data: DeptLearningData[] }> {
  return {
    data: [
      { department: "Engineering", enrolled: 45, completed: 18 },
      { department: "Marketing", enrolled: 22, completed: 10 },
      { department: "Data", enrolled: 15, completed: 7 },
      { department: "Design", enrolled: 12, completed: 5 },
      { department: "Management", enrolled: 28, completed: 14 },
      { department: "Security", enrolled: 8, completed: 3 },
    ],
  };
}

export async function fetchSkillTrends(): Promise<{ data: SkillTrendData[] }> {
  return {
    data: [
      { month: "Jan", beginners: 45, intermediate: 30, advanced: 15 },
      { month: "Feb", beginners: 52, intermediate: 35, advanced: 18 },
      { month: "Mar", beginners: 48, intermediate: 40, advanced: 22 },
      { month: "Apr", beginners: 60, intermediate: 38, advanced: 20 },
      { month: "May", beginners: 55, intermediate: 45, advanced: 25 },
      { month: "Jun", beginners: 58, intermediate: 42, advanced: 28 },
    ],
  };
}

// ── Compensation & Benefits Types ──

export interface SalaryStructure {
  id: string;
  name: string;
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

export interface PayGrade {
  id: string;
  grade: string;
  minSalary: number;
  maxSalary: number;
  midPoint: number;
  stepIncrement: number;
  employeeCount: number;
}

export interface Allowance {
  id: string;
  name: string;
  type: "FIXED" | "PERCENTAGE";
  amount: number;
  percentageValue?: number;
  applicableTo: string;
  taxExempt: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface Deduction {
  id: string;
  name: string;
  type: "FIXED" | "PERCENTAGE";
  amount: number;
  percentageValue?: number;
  mandatory: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface BenefitPlan {
  id: string;
  name: string;
  category: string;
  employeeCost: number;
  employerCost: number;
  enrolledCount: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Bonus {
  id: string;
  name: string;
  type: "PERFORMANCE" | "SIGNING" | "REFERRAL" | "ANNUAL" | "PROJECT";
  amount: number;
  employee: string;
  dateAwarded: string;
  status: "PAID" | "PENDING" | "APPROVED";
}

export interface CompensationReview {
  id: string;
  employee: string;
  reviewDate: string;
  currentSalary: number;
  proposedSalary: number;
  increasePercent: number;
  reviewer: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface SalaryRevision {
  id: string;
  employee: string;
  previousSalary: number;
  revisedSalary: number;
  changePercent: number;
  reason: string;
  effectiveDate: string;
  approvedBy: string;
}

export interface CompensationDashboardStats {
  totalCompensationCost: number;
  activeSalaryStructures: number;
  benefitsEnrolled: number;
  pendingReviews: number;
  upcomingIncrements: number;
}

export interface SalaryDistributionData {
  grade: string;
  count: number;
  avgSalary: number;
}

export interface BenefitEnrollmentData {
  benefit: string;
  enrolled: number;
  total: number;
}

export interface DeptCompCostData {
  department: string;
  cost: number;
  headcount: number;
}

export interface ReviewOutcomeData {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

// ── Compensation Mock Data ──

const mockSalaryStructures: SalaryStructure[] = [
  { id: "ss-001", name: "Executive Level", employeeCount: 8, minSalary: 250000, maxSalary: 500000, currency: "USD", status: "ACTIVE" },
  { id: "ss-002", name: "Senior Management", employeeCount: 25, minSalary: 150000, maxSalary: 280000, currency: "USD", status: "ACTIVE" },
  { id: "ss-003", name: "Mid Management", employeeCount: 52, minSalary: 90000, maxSalary: 160000, currency: "USD", status: "ACTIVE" },
  { id: "ss-004", name: "Professional Staff", employeeCount: 120, minSalary: 60000, maxSalary: 100000, currency: "USD", status: "ACTIVE" },
  { id: "ss-005", name: "Technical Staff", employeeCount: 85, minSalary: 55000, maxSalary: 95000, currency: "USD", status: "ACTIVE" },
  { id: "ss-006", name: "Support Staff", employeeCount: 45, minSalary: 35000, maxSalary: 55000, currency: "USD", status: "ACTIVE" },
  { id: "ss-007", name: "Internship Program", employeeCount: 15, minSalary: 20000, maxSalary: 35000, currency: "USD", status: "ACTIVE" },
  { id: "ss-008", name: "Legacy Structure", employeeCount: 0, minSalary: 40000, maxSalary: 70000, currency: "USD", status: "INACTIVE" },
];

const mockPayGrades: PayGrade[] = [
  { id: "pg-001", grade: "G1", minSalary: 20000, maxSalary: 35000, midPoint: 27500, stepIncrement: 1500, employeeCount: 15 },
  { id: "pg-002", grade: "G2", minSalary: 35000, maxSalary: 55000, midPoint: 45000, stepIncrement: 2000, employeeCount: 30 },
  { id: "pg-003", grade: "G3", minSalary: 55000, maxSalary: 75000, midPoint: 65000, stepIncrement: 2500, employeeCount: 48 },
  { id: "pg-004", grade: "G4", minSalary: 75000, maxSalary: 95000, midPoint: 85000, stepIncrement: 3000, employeeCount: 62 },
  { id: "pg-005", grade: "G5", minSalary: 95000, maxSalary: 120000, midPoint: 107500, stepIncrement: 3500, employeeCount: 55 },
  { id: "pg-006", grade: "G6", minSalary: 120000, maxSalary: 160000, midPoint: 140000, stepIncrement: 4000, employeeCount: 40 },
  { id: "pg-007", grade: "G7", minSalary: 160000, maxSalary: 220000, midPoint: 190000, stepIncrement: 5000, employeeCount: 22 },
  { id: "pg-008", grade: "G8", minSalary: 220000, maxSalary: 500000, midPoint: 350000, stepIncrement: 8000, employeeCount: 8 },
];

const mockAllowances: Allowance[] = [
  { id: "alw-001", name: "Housing Allowance", type: "FIXED", amount: 2500, applicableTo: "All Employees", taxExempt: false, status: "ACTIVE" },
  { id: "alw-002", name: "Transport Allowance", type: "FIXED", amount: 500, applicableTo: "All Employees", taxExempt: true, status: "ACTIVE" },
  { id: "alw-003", name: "Meal Allowance", type: "FIXED", amount: 300, applicableTo: "All Employees", taxExempt: true, status: "ACTIVE" },
  { id: "alw-004", name: "Communication Allowance", type: "FIXED", amount: 200, applicableTo: "Management & Above", taxExempt: true, status: "ACTIVE" },
  { id: "alw-005", name: "Medical Allowance", type: "FIXED", amount: 800, applicableTo: "All Employees", taxExempt: true, status: "ACTIVE" },
  { id: "alw-006", name: "Education Allowance", type: "FIXED", amount: 1000, applicableTo: "Employees with Children", taxExempt: false, status: "ACTIVE" },
  { id: "alw-007", name: "Special Duty Allowance", type: "PERCENTAGE", amount: 0, percentageValue: 15, applicableTo: "Field Staff", taxExempt: false, status: "ACTIVE" },
  { id: "alw-008", name: "Relocation Allowance", type: "FIXED", amount: 5000, applicableTo: "New Hires", taxExempt: false, status: "ACTIVE" },
  { id: "alw-009", name: "Shift Allowance", type: "PERCENTAGE", amount: 0, percentageValue: 10, applicableTo: "Shift Workers", taxExempt: false, status: "ACTIVE" },
  { id: "alw-010", name: "Overtime Allowance", type: "FIXED", amount: 0, applicableTo: "Non-Exempt Staff", taxExempt: false, status: "INACTIVE" },
];

const mockDeductions: Deduction[] = [
  { id: "ded-001", name: "Income Tax (PAYE)", type: "PERCENTAGE", amount: 0, percentageValue: 20, mandatory: true, status: "ACTIVE" },
  { id: "ded-002", name: "Social Security", type: "PERCENTAGE", amount: 0, percentageValue: 6.2, mandatory: true, status: "ACTIVE" },
  { id: "ded-003", name: "Medicare", type: "PERCENTAGE", amount: 0, percentageValue: 1.45, mandatory: true, status: "ACTIVE" },
  { id: "ded-004", name: "Pension Contribution", type: "PERCENTAGE", amount: 0, percentageValue: 5, mandatory: true, status: "ACTIVE" },
  { id: "ded-005", name: "Health Insurance Premium", type: "FIXED", amount: 450, mandatory: false, status: "ACTIVE" },
  { id: "ded-006", name: "Dental Insurance", type: "FIXED", amount: 80, mandatory: false, status: "ACTIVE" },
  { id: "ded-007", name: "Life Insurance", type: "FIXED", amount: 25, mandatory: false, status: "ACTIVE" },
  { id: "ded-008", name: "Union Dues", type: "FIXED", amount: 50, mandatory: false, status: "ACTIVE" },
  { id: "ded-009", name: "Garnishment", type: "FIXED", amount: 0, mandatory: true, status: "INACTIVE" },
  { id: "ded-010", name: "Charity Contribution", type: "FIXED", amount: 0, mandatory: false, status: "INACTIVE" },
];

const mockBenefits: BenefitPlan[] = [
  { id: "bnf-001", name: "Medical Insurance", category: "Health", employeeCost: 150, employerCost: 450, enrolledCount: 320, status: "ACTIVE" },
  { id: "bnf-002", name: "Dental Insurance", category: "Health", employeeCost: 40, employerCost: 80, enrolledCount: 280, status: "ACTIVE" },
  { id: "bnf-003", name: "Vision Insurance", category: "Health", employeeCost: 15, employerCost: 30, enrolledCount: 260, status: "ACTIVE" },
  { id: "bnf-004", name: "Life Insurance", category: "Insurance", employeeCost: 10, employerCost: 25, enrolledCount: 340, status: "ACTIVE" },
  { id: "bnf-005", name: "401(k) Retirement Plan", category: "Retirement", employeeCost: 0, employerCost: 600, enrolledCount: 290, status: "ACTIVE" },
  { id: "bnf-006", name: "Stock Options", category: "Equity", employeeCost: 0, employerCost: 2000, enrolledCount: 45, status: "ACTIVE" },
  { id: "bnf-007", name: "Gym Membership", category: "Wellness", employeeCost: 30, employerCost: 70, enrolledCount: 180, status: "ACTIVE" },
  { id: "bnf-008", name: "Tuition Reimbursement", category: "Education", employeeCost: 0, employerCost: 500, enrolledCount: 55, status: "ACTIVE" },
  { id: "bnf-009", name: "Remote Work Stipend", category: "Lifestyle", employeeCost: 0, employerCost: 100, enrolledCount: 200, status: "ACTIVE" },
  { id: "bnf-010", name: "Legal Assistance", category: "Insurance", employeeCost: 20, employerCost: 40, enrolledCount: 120, status: "ACTIVE" },
  { id: "bnf-011", name: "Childcare Assistance", category: "Family", employeeCost: 0, employerCost: 300, enrolledCount: 65, status: "ACTIVE" },
  { id: "bnf-012", name: "Pet Insurance", category: "Lifestyle", employeeCost: 25, employerCost: 25, enrolledCount: 40, status: "INACTIVE" },
];

const mockBonuses: Bonus[] = [
  { id: "bns-001", name: "Q1 Performance Bonus", type: "PERFORMANCE", amount: 15000, employee: "Alice Johnson", dateAwarded: "2026-04-15", status: "PAID" },
  { id: "bns-002", name: "Q1 Performance Bonus", type: "PERFORMANCE", amount: 12000, employee: "Bob Smith", dateAwarded: "2026-04-15", status: "PAID" },
  { id: "bns-003", name: "Signing Bonus", type: "SIGNING", amount: 25000, employee: "Charlie Brown", dateAwarded: "2026-03-01", status: "PAID" },
  { id: "bns-004", name: "Annual Performance Bonus", type: "ANNUAL", amount: 35000, employee: "Diana Prince", dateAwarded: "2026-01-20", status: "PAID" },
  { id: "bns-005", name: "Employee Referral Bonus", type: "REFERRAL", amount: 3000, employee: "Edward Norton", dateAwarded: "2026-05-10", status: "PAID" },
  { id: "bns-006", name: "Project Completion Bonus", type: "PROJECT", amount: 8000, employee: "Fiona Apple", dateAwarded: "2026-06-01", status: "APPROVED" },
  { id: "bns-007", name: "Q2 Performance Bonus", type: "PERFORMANCE", amount: 10000, employee: "George Lucas", dateAwarded: "2026-07-15", status: "PENDING" },
  { id: "bns-008", name: "Annual Performance Bonus", type: "ANNUAL", amount: 20000, employee: "Hannah Montana", dateAwarded: "2026-01-20", status: "PAID" },
  { id: "bns-009", name: "Signing Bonus", type: "SIGNING", amount: 15000, employee: "Ian Malcolm", dateAwarded: "2026-06-15", status: "PENDING" },
  { id: "bns-010", name: "Employee Referral Bonus", type: "REFERRAL", amount: 2000, employee: "Jane Doe", dateAwarded: "2026-07-01", status: "APPROVED" },
  { id: "bns-011", name: "Q1 Performance Bonus", type: "PERFORMANCE", amount: 18000, employee: "Kevin Hart", dateAwarded: "2026-04-15", status: "PAID" },
  { id: "bns-012", name: "Project Completion Bonus", type: "PROJECT", amount: 5000, employee: "Laura Croft", dateAwarded: "2026-05-20", status: "PAID" },
];

const mockCompReviews: CompensationReview[] = [
  { id: "cr-001", employee: "Alice Johnson", reviewDate: "2026-03-15", currentSalary: 180000, proposedSalary: 200000, increasePercent: 11, reviewer: "Sarah Chen", status: "APPROVED" },
  { id: "cr-002", employee: "Bob Smith", reviewDate: "2026-03-20", currentSalary: 135000, proposedSalary: 150000, increasePercent: 11, reviewer: "Sarah Chen", status: "APPROVED" },
  { id: "cr-003", employee: "Charlie Brown", reviewDate: "2026-04-01", currentSalary: 85000, proposedSalary: 95000, increasePercent: 12, reviewer: "Arjun Nair", status: "PENDING" },
  { id: "cr-004", employee: "Diana Prince", reviewDate: "2026-04-10", currentSalary: 110000, proposedSalary: 125000, increasePercent: 14, reviewer: "Priya Patel", status: "PENDING" },
  { id: "cr-005", employee: "Edward Norton", reviewDate: "2026-02-15", currentSalary: 95000, proposedSalary: 100000, increasePercent: 5, reviewer: "Rohan Joshi", status: "APPROVED" },
  { id: "cr-006", employee: "Fiona Apple", reviewDate: "2026-05-01", currentSalary: 75000, proposedSalary: 82000, increasePercent: 9, reviewer: "Ananya Gupta", status: "REJECTED" },
  { id: "cr-007", employee: "George Lucas", reviewDate: "2026-05-15", currentSalary: 160000, proposedSalary: 180000, increasePercent: 13, reviewer: "Sarah Chen", status: "PENDING" },
  { id: "cr-008", employee: "Hannah Montana", reviewDate: "2026-06-01", currentSalary: 88000, proposedSalary: 95000, increasePercent: 8, reviewer: "Priya Patel", status: "APPROVED" },
  { id: "cr-009", employee: "Ian Malcolm", reviewDate: "2026-06-10", currentSalary: 92000, proposedSalary: 102000, increasePercent: 11, reviewer: "Arjun Nair", status: "PENDING" },
  { id: "cr-010", employee: "Jane Doe", reviewDate: "2026-03-05", currentSalary: 78000, proposedSalary: 85000, increasePercent: 9, reviewer: "Rohan Joshi", status: "APPROVED" },
  { id: "cr-011", employee: "Kevin Hart", reviewDate: "2026-06-20", currentSalary: 65000, proposedSalary: 72000, increasePercent: 11, reviewer: "Ananya Gupta", status: "PENDING" },
  { id: "cr-012", employee: "Laura Croft", reviewDate: "2026-02-28", currentSalary: 145000, proposedSalary: 155000, increasePercent: 7, reviewer: "Sarah Chen", status: "APPROVED" },
];

const mockSalaryRevisions: SalaryRevision[] = [
  { id: "sr-001", employee: "Alice Johnson", previousSalary: 165000, revisedSalary: 180000, changePercent: 9, reason: "Annual merit increase", effectiveDate: "2026-01-01", approvedBy: "Sarah Chen" },
  { id: "sr-002", employee: "Bob Smith", previousSalary: 125000, revisedSalary: 135000, changePercent: 8, reason: "Promotion to Senior Engineer", effectiveDate: "2026-02-01", approvedBy: "Sarah Chen" },
  { id: "sr-003", employee: "Charlie Brown", previousSalary: 78000, revisedSalary: 85000, changePercent: 9, reason: "Annual merit increase", effectiveDate: "2026-01-15", approvedBy: "Arjun Nair" },
  { id: "sr-004", employee: "Diana Prince", previousSalary: 100000, revisedSalary: 110000, changePercent: 10, reason: "Market adjustment", effectiveDate: "2026-03-01", approvedBy: "Priya Patel" },
  { id: "sr-005", employee: "Edward Norton", previousSalary: 90000, revisedSalary: 95000, changePercent: 6, reason: "Annual merit increase", effectiveDate: "2026-01-01", approvedBy: "Rohan Joshi" },
  { id: "sr-006", employee: "George Lucas", previousSalary: 145000, revisedSalary: 160000, changePercent: 10, reason: "Promotion to Director", effectiveDate: "2026-04-01", approvedBy: "Sarah Chen" },
  { id: "sr-007", employee: "Hannah Montana", previousSalary: 80000, revisedSalary: 88000, changePercent: 10, reason: "Annual merit increase", effectiveDate: "2026-01-01", approvedBy: "Priya Patel" },
  { id: "sr-008", employee: "Ian Malcolm", previousSalary: 85000, revisedSalary: 92000, changePercent: 8, reason: "Market adjustment", effectiveDate: "2026-02-15", approvedBy: "Arjun Nair" },
  { id: "sr-009", employee: "Jane Doe", previousSalary: 72000, revisedSalary: 78000, changePercent: 8, reason: "Annual merit increase", effectiveDate: "2026-01-01", approvedBy: "Rohan Joshi" },
  { id: "sr-010", employee: "Kevin Hart", previousSalary: 60000, revisedSalary: 65000, changePercent: 8, reason: "Promotion to Senior Associate", effectiveDate: "2026-05-01", approvedBy: "Ananya Gupta" },
  { id: "sr-011", employee: "Laura Croft", previousSalary: 135000, revisedSalary: 145000, changePercent: 7, reason: "Annual merit increase", effectiveDate: "2026-01-01", approvedBy: "Sarah Chen" },
  { id: "sr-012", employee: "Mike Ross", previousSalary: 52000, revisedSalary: 58000, changePercent: 12, reason: "Counter offer retention", effectiveDate: "2026-06-01", approvedBy: "Priya Patel" },
];

// ── Compensation API Functions ──

export async function fetchCompensationDashboard(): Promise<{ data: CompensationDashboardStats }> {
  const totalCompCost = mockSalaryStructures
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + (s.minSalary + s.maxSalary) / 2 * s.employeeCount, 0);
  const activeSalaryStructures = mockSalaryStructures.filter((s) => s.status === "ACTIVE").length;
  const benefitsEnrolled = mockBenefits.filter((b) => b.status === "ACTIVE").reduce((sum, b) => sum + b.enrolledCount, 0);
  const pendingReviews = mockCompReviews.filter((r) => r.status === "PENDING").length;
  const upcomingIncrements = mockCompReviews.filter((r) => r.status === "APPROVED").length;
  return {
    data: { totalCompensationCost: Math.round(totalCompCost), activeSalaryStructures, benefitsEnrolled, pendingReviews, upcomingIncrements },
  };
}

export async function fetchSalaryStructures(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: SalaryStructure[]; total: number; skip: number; take: number }> {
  let filtered = [...mockSalaryStructures];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((ss) => ss.name.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((ss) => ss.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchPayGrades(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: PayGrade[]; total: number; skip: number; take: number }> {
  let filtered = [...mockPayGrades];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((pg) => pg.grade.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchAllowances(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Allowance[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAllowances];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.name.toLowerCase().includes(s) || a.applicableTo.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchDeductions(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Deduction[]; total: number; skip: number; take: number }> {
  let filtered = [...mockDeductions];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((d) => d.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchBenefits(filters?: { search?: string; category?: string; status?: string; skip?: number; take?: number }): Promise<{ data: BenefitPlan[]; total: number; skip: number; take: number }> {
  let filtered = [...mockBenefits];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((b) => b.name.toLowerCase().includes(s) || b.category.toLowerCase().includes(s));
  }
  if (filters?.category) filtered = filtered.filter((b) => b.category === filters.category);
  if (filters?.status) filtered = filtered.filter((b) => b.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchBonuses(filters?: { search?: string; type?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Bonus[]; total: number; skip: number; take: number }> {
  let filtered = [...mockBonuses];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((b) => b.name.toLowerCase().includes(s) || b.employee.toLowerCase().includes(s));
  }
  if (filters?.type) filtered = filtered.filter((b) => b.type === filters.type);
  if (filters?.status) filtered = filtered.filter((b) => b.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchCompReviews(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: CompensationReview[]; total: number; skip: number; take: number }> {
  let filtered = [...mockCompReviews];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((r) => r.employee.toLowerCase().includes(s) || r.reviewer.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((r) => r.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchSalaryRevisions(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: SalaryRevision[]; total: number; skip: number; take: number }> {
  let filtered = [...mockSalaryRevisions];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((r) => r.employee.toLowerCase().includes(s) || r.reason.toLowerCase().includes(s) || r.approvedBy.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchSalaryDistribution(): Promise<{ data: SalaryDistributionData[] }> {
  return {
    data: mockPayGrades.map((pg) => ({
      grade: pg.grade,
      count: pg.employeeCount,
      avgSalary: Math.round((pg.minSalary + pg.maxSalary) / 2),
    })),
  };
}

export async function fetchBenefitEnrollment(): Promise<{ data: BenefitEnrollmentData[] }> {
  return {
    data: mockBenefits.filter((b) => b.status === "ACTIVE").slice(0, 8).map((b) => ({
      benefit: b.name,
      enrolled: b.enrolledCount,
      total: 350,
    })),
  };
}

export async function fetchDeptCompCost(): Promise<{ data: DeptCompCostData[] }> {
  return {
    data: [
      { department: "Engineering", cost: 4500000, headcount: 85 },
      { department: "Marketing", cost: 1800000, headcount: 35 },
      { department: "Data", cost: 1200000, headcount: 20 },
      { department: "Design", cost: 900000, headcount: 18 },
      { department: "Human Resources", cost: 750000, headcount: 15 },
      { department: "Management", cost: 3800000, headcount: 28 },
      { department: "Security", cost: 650000, headcount: 12 },
      { department: "Operations", cost: 950000, headcount: 22 },
    ],
  };
}

export async function fetchReviewOutcomes(): Promise<{ data: ReviewOutcomeData[] }> {
  return {
    data: [
      { month: "Jan", approved: 8, rejected: 1, pending: 2 },
      { month: "Feb", approved: 6, rejected: 2, pending: 3 },
      { month: "Mar", approved: 10, rejected: 0, pending: 4 },
      { month: "Apr", approved: 7, rejected: 1, pending: 5 },
      { month: "May", approved: 5, rejected: 3, pending: 6 },
      { month: "Jun", approved: 9, rejected: 1, pending: 4 },
    ],
  };
}

// ── Employee Self Service (ESS) Types ──

export interface ESSDashboardStats {
  pendingTasks: number;
  upcomingLeave: number;
  attendanceThisMonth: number;
  payslipsAvailable: number;
  learningProgress: number;
  unreadNotifications: number;
}

export interface ESSProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  manager: string;
  joinDate: string;
  employmentType: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface EmployeeAttendance {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "ON_LEAVE";
  remarks?: string;
}

export interface EmployeeLeaveReq {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason?: string;
}

export interface ESSLeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export interface ESSDocument {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  size?: string;
}

export interface EmployeeAsset {
  id: string;
  assetName: string;
  category: string;
  allocatedDate: string;
  status: "ALLOCATED" | "RETURNED";
}

export interface EmployeeCourse {
  id: string;
  courseName: string;
  instructor: string;
  progress: number;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
}

export interface EmployeeReview {
  id: string;
  reviewPeriod: string;
  reviewer: string;
  rating: number;
  status: "COMPLETED" | "PENDING" | "DRAFT";
}

export interface Payslip {
  id: string;
  period: string;
  grossPay: number;
  netPay: number;
  deductions: number;
  status: "PAID" | "PENDING";
  issuedDate: string;
}

export interface EmployeeRequest {
  id: string;
  type: string;
  subject: string;
  submittedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface Notification {
  id: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  date: string;
  read: boolean;
}

// ── ESS Mock Data ──

const currentEmployee: ESSProfile = {
  id: "emp-001",
  employeeId: "EMP-001",
  name: "John Smith",
  email: "john.smith@zoiko.com",
  phone: "+1-555-0100",
  department: "Engineering",
  designation: "Senior Software Engineer",
  manager: "Sarah Chen",
  joinDate: "2024-03-15",
  employmentType: "FULL_TIME",
  location: "New York, USA",
  dateOfBirth: "1991-07-22",
  gender: "Male",
  maritalStatus: "Married",
  nationality: "American",
  address: "123 Tech Avenue, Suite 400, New York, NY 10001",
  emergencyContact: "Jane Smith (Spouse)",
  emergencyPhone: "+1-555-0101",
};

const essAttendance: EmployeeAttendance[] = [
  { id: "ea-001", date: "2026-06-01", checkIn: "08:55", checkOut: "17:30", workingHours: "8h 35m", status: "PRESENT" },
  { id: "ea-002", date: "2026-06-02", checkIn: "09:05", checkOut: "17:45", workingHours: "8h 40m", status: "PRESENT" },
  { id: "ea-003", date: "2026-06-03", checkIn: "08:50", checkOut: "18:00", workingHours: "9h 10m", status: "PRESENT" },
  { id: "ea-004", date: "2026-06-04", checkIn: "09:30", checkOut: "17:15", workingHours: "7h 45m", status: "LATE" },
  { id: "ea-005", date: "2026-06-05", checkIn: "08:45", checkOut: "17:00", workingHours: "8h 15m", status: "PRESENT" },
  { id: "ea-006", date: "2026-06-08", checkIn: "09:00", checkOut: "17:30", workingHours: "8h 30m", status: "PRESENT" },
  { id: "ea-007", date: "2026-06-09", checkIn: "08:55", checkOut: "13:00", workingHours: "4h 05m", status: "HALF_DAY", remarks: "Medical appointment" },
  { id: "ea-008", date: "2026-06-10", checkIn: "09:10", checkOut: "17:35", workingHours: "8h 25m", status: "PRESENT" },
  { id: "ea-009", date: "2026-06-11", checkIn: "00:00", checkOut: "00:00", workingHours: "0h 00m", status: "ON_LEAVE", remarks: "Annual leave" },
  { id: "ea-010", date: "2026-06-12", checkIn: "00:00", checkOut: "00:00", workingHours: "0h 00m", status: "ON_LEAVE", remarks: "Annual leave" },
  { id: "ea-011", date: "2026-06-15", checkIn: "08:50", checkOut: "17:20", workingHours: "8h 30m", status: "PRESENT" },
  { id: "ea-012", date: "2026-06-16", checkIn: "08:45", checkOut: "17:25", workingHours: "8h 40m", status: "PRESENT" },
];

const essLeaveRequests: EmployeeLeaveReq[] = [
  { id: "el-001", leaveType: "Annual Leave", fromDate: "2026-06-11", toDate: "2026-06-12", days: 2, status: "APPROVED", reason: "Family vacation" },
  { id: "el-002", leaveType: "Sick Leave", fromDate: "2026-05-20", toDate: "2026-05-20", days: 1, status: "APPROVED", reason: "Doctor's appointment" },
  { id: "el-003", leaveType: "Personal Leave", fromDate: "2026-07-04", toDate: "2026-07-05", days: 2, status: "PENDING", reason: "Personal matters" },
  { id: "el-004", leaveType: "Annual Leave", fromDate: "2026-04-10", toDate: "2026-04-14", days: 5, status: "APPROVED", reason: "Spring break trip" },
  { id: "el-005", leaveType: "Sick Leave", fromDate: "2026-03-15", toDate: "2026-03-16", days: 2, status: "APPROVED", reason: "Flu recovery" },
  { id: "el-006", leaveType: "Annual Leave", fromDate: "2026-08-01", toDate: "2026-08-05", days: 5, status: "PENDING", reason: "Summer vacation" },
];

const essLeaveBalances: ESSLeaveBalance[] = [
  { type: "Annual Leave", total: 20, used: 12, remaining: 8 },
  { type: "Sick Leave", total: 12, used: 3, remaining: 9 },
  { type: "Personal Leave", total: 5, used: 1, remaining: 4 },
  { type: "Parental Leave", total: 30, used: 0, remaining: 30 },
];

const essDocuments: ESSDocument[] = [
  { id: "ed-001", name: "Employment Contract", type: "Contract", uploadedDate: "2024-03-10", status: "VERIFIED", size: "2.4 MB" },
  { id: "ed-002", name: "Passport Copy", type: "Identification", uploadedDate: "2024-03-10", status: "VERIFIED", size: "1.8 MB" },
  { id: "ed-003", name: "Degree Certificate", type: "Education", uploadedDate: "2024-03-12", status: "VERIFIED", size: "3.2 MB" },
  { id: "ed-004", name: "Health Insurance Form", type: "Benefits", uploadedDate: "2024-03-15", status: "VERIFIED", size: "1.1 MB" },
  { id: "ed-005", name: "Tax Declaration (W-4)", type: "Tax", uploadedDate: "2025-01-05", status: "VERIFIED", size: "0.5 MB" },
  { id: "ed-006", name: "Performance Certificates", type: "Achievement", uploadedDate: "2026-04-01", status: "PENDING", size: "4.0 MB" },
];

const essAssets: EmployeeAsset[] = [
  { id: "eas-001", assetName: "MacBook Pro 16\"", category: "Laptops", allocatedDate: "2024-03-15", status: "ALLOCATED" },
  { id: "eas-002", assetName: "Dell UltraSharp 27\" Monitor", category: "Monitors", allocatedDate: "2024-03-15", status: "ALLOCATED" },
  { id: "eas-003", assetName: "Herman Miller Aeron Chair", category: "Other Equipment", allocatedDate: "2024-04-01", status: "ALLOCATED" },
  { id: "eas-004", assetName: "MS 365 Business Premium", category: "Software Licenses", allocatedDate: "2024-03-15", status: "ALLOCATED" },
  { id: "eas-005", assetName: "Access Card - Floor 3", category: "Access Cards", allocatedDate: "2024-03-15", status: "ALLOCATED" },
];

const essCourses: EmployeeCourse[] = [
  { id: "ec-001", courseName: "Advanced JavaScript", instructor: "James Wilson", progress: 100, status: "COMPLETED" },
  { id: "ec-002", courseName: "Cloud Architecture", instructor: "Priya Patel", progress: 65, status: "IN_PROGRESS" },
  { id: "ec-003", courseName: "Leadership Essentials", instructor: "Dr. Sarah Chen", progress: 20, status: "IN_PROGRESS" },
  { id: "ec-004", courseName: "Agile & Scrum Mastery", instructor: "Lisa Wang", progress: 0, status: "NOT_STARTED" },
  { id: "ec-005", courseName: "Cybersecurity Awareness", instructor: "Mark Thompson", progress: 100, status: "COMPLETED" },
];

const essReviews: EmployeeReview[] = [
  { id: "er-001", reviewPeriod: "Q1 2026", reviewer: "Sarah Chen", rating: 4.5, status: "COMPLETED" },
  { id: "er-002", reviewPeriod: "Q4 2025", reviewer: "Sarah Chen", rating: 4.2, status: "COMPLETED" },
  { id: "er-003", reviewPeriod: "Q2 2026", reviewer: "Sarah Chen", rating: 0, status: "PENDING" },
  { id: "er-004", reviewPeriod: "Mid-Year 2025", reviewer: "Sarah Chen", rating: 4.0, status: "COMPLETED" },
];

const essPayslips: Payslip[] = [
  { id: "ps-001", period: "June 2026", grossPay: 12500, netPay: 9250, deductions: 3250, status: "PENDING", issuedDate: "2026-06-30" },
  { id: "ps-002", period: "May 2026", grossPay: 12500, netPay: 9250, deductions: 3250, status: "PAID", issuedDate: "2026-05-31" },
  { id: "ps-003", period: "April 2026", grossPay: 12500, netPay: 9250, deductions: 3250, status: "PAID", issuedDate: "2026-04-30" },
  { id: "ps-004", period: "March 2026", grossPay: 13500, netPay: 10000, deductions: 3500, status: "PAID", issuedDate: "2026-03-31" },
  { id: "ps-005", period: "February 2026", grossPay: 12500, netPay: 9250, deductions: 3250, status: "PAID", issuedDate: "2026-02-28" },
  { id: "ps-006", period: "January 2026", grossPay: 12500, netPay: 9250, deductions: 3250, status: "PAID", issuedDate: "2026-01-31" },
];

const essRequests: EmployeeRequest[] = [
  { id: "erq-001", type: "Leave", subject: "Annual Leave Request - Summer Vacation", submittedDate: "2026-06-10", status: "PENDING" },
  { id: "erq-002", type: "Leave", subject: "Personal Leave - Family Event", submittedDate: "2026-06-01", status: "PENDING" },
  { id: "erq-003", type: "Asset", subject: "Request for External Monitor", submittedDate: "2026-05-20", status: "APPROVED" },
  { id: "erq-004", type: "Document", subject: "Tax Declaration Update", submittedDate: "2026-05-10", status: "APPROVED" },
  { id: "erq-005", type: "Training", subject: "AWS Certification Sponsorship", submittedDate: "2026-04-25", status: "REJECTED" },
  { id: "erq-006", type: "Leave", subject: "Sick Leave - Doctor Appointment", submittedDate: "2026-03-14", status: "APPROVED" },
];

const essNotifications: Notification[] = [
  { id: "ntf-001", message: "Your leave request for Jul 4-5 has been submitted for approval.", type: "INFO", date: "2026-06-09 10:30", read: false },
  { id: "ntf-002", message: "New payslip for June 2026 is now available.", type: "SUCCESS", date: "2026-06-30 08:00", read: false },
  { id: "ntf-003", message: "Q2 2026 performance review is due. Please complete self-assessment.", type: "WARNING", date: "2026-06-28 09:15", read: false },
  { id: "ntf-004", message: "You have been enrolled in 'Leadership Essentials' course.", type: "INFO", date: "2026-06-25 14:00", read: true },
  { id: "ntf-005", message: "Your AWS Certification Sponsorship request has been rejected.", type: "ERROR", date: "2026-04-28 11:45", read: true },
  { id: "ntf-006", message: "Annual leave balance updated: 8 days remaining.", type: "SUCCESS", date: "2026-04-15 09:00", read: true },
  { id: "ntf-007", message: "Asset allocation confirmed for MacBook Pro 16\".", type: "SUCCESS", date: "2024-03-15 16:30", read: true },
  { id: "ntf-008", message: "Document 'Performance Certificates' pending verification.", type: "WARNING", date: "2026-04-01 10:00", read: false },
];

// ── ESS API Functions ──

export async function fetchESSDashboard(): Promise<{ data: ESSDashboardStats }> {
  return {
    data: {
      pendingTasks: essRequests.filter((r) => r.status === "PENDING").length,
      upcomingLeave: essLeaveRequests.filter((r) => r.status === "APPROVED" || r.status === "PENDING").length,
      attendanceThisMonth: essAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length,
      payslipsAvailable: essPayslips.length,
      learningProgress: Math.round(essCourses.reduce((sum, c) => sum + c.progress, 0) / essCourses.length),
      unreadNotifications: essNotifications.filter((n) => !n.read).length,
    },
  };
}

export async function fetchESSProfile(): Promise<{ data: ESSProfile }> {
  return { data: currentEmployee };
}

export async function fetchESSAttendance(): Promise<{ data: EmployeeAttendance[] }> {
  return { data: essAttendance };
}

export async function fetchESSLeaveRequests(): Promise<{ data: EmployeeLeaveReq[] }> {
  return { data: essLeaveRequests };
}

export async function fetchESSLeaveBalances(): Promise<{ data: ESSLeaveBalance[] }> {
  return { data: essLeaveBalances };
}

export async function fetchESSDocuments(): Promise<{ data: ESSDocument[] }> {
  return { data: essDocuments };
}

export async function fetchESSAssets(): Promise<{ data: EmployeeAsset[] }> {
  return { data: essAssets };
}

export async function fetchESSCourses(): Promise<{ data: EmployeeCourse[] }> {
  return { data: essCourses };
}

export async function fetchESSReviews(): Promise<{ data: EmployeeReview[] }> {
  return { data: essReviews };
}

export async function fetchESSPayslips(): Promise<{ data: Payslip[] }> {
  return { data: essPayslips };
}

export async function fetchESSRequests(): Promise<{ data: EmployeeRequest[] }> {
  return { data: essRequests };
}

export async function fetchESSNotifications(): Promise<{ data: Notification[] }> {
  return { data: essNotifications };
}

export async function markNotificationRead(id: string): Promise<void> {
  const idx = essNotifications.findIndex((n) => n.id === id);
  if (idx !== -1) essNotifications[idx].read = true;
}

// ── Travel & Expense Management Types ──

export type TravelMode = "FLIGHT" | "TRAIN" | "BUS" | "CAR" | "OTHER";
export type TravelStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
export type TravelPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ExpenseStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "REIMBURSED";
export type ReimbursementStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type TravelPolicyStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TravelRequest {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  destination: string;
  purpose: string;
  fromDate: string;
  toDate: string;
  travelMode: TravelMode;
  estimatedCost: number;
  currency: string;
  status: TravelStatus;
  priority: TravelPriority;
  submittedDate: string;
}

export interface ExpenseClaim {
  id: string;
  employee: string;
  employeeId: string;
  category: string;
  amount: number;
  currency: string;
  submittedDate: string;
  status: ExpenseStatus;
  description: string;
  receiptUrl?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TravelApproval {
  id: string;
  requestType: "TRAVEL" | "EXPENSE";
  requestId: string;
  employee: string;
  amount: number;
  currency: string;
  submittedDate: string;
  status: ApprovalStatus;
  approver: string;
  comments?: string;
  actionDate?: string;
}

export interface Reimbursement {
  id: string;
  employee: string;
  employeeId: string;
  claimId: string;
  category: string;
  amount: number;
  currency: string;
  processedDate: string;
  status: ReimbursementStatus;
  paymentMethod: string;
}

export interface CorporateTrip {
  id: string;
  tripName: string;
  destination: string;
  airline?: string;
  hotel?: string;
  totalCost: number;
  currency: string;
  travelers: number;
  fromDate: string;
  toDate: string;
  status: "PLANNED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface TravelPolicy {
  id: string;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  version: string;
  status: TravelPolicyStatus;
}

export interface TravelDashboardStats {
  totalClaims: number;
  pendingApprovals: number;
  approvedClaims: number;
  rejectedClaims: number;
  reimbursementAmount: number;
  travelRequests: number;
}

export interface TravelExpenseReportData {
  month: string;
  travel: number;
  expense: number;
  reimbursed: number;
}

export interface TravelDeptData {
  department: string;
  travelCount: number;
  expenseCount: number;
  totalAmount: number;
}

// ── Travel & Expense Mock Data ──

const mockTravelRequests: TravelRequest[] = [
  { id: "tr-001", employee: "Alice Johnson", employeeId: "EMP-002", department: "Sales", destination: "New York, USA", purpose: "Client meeting - Q3 review", fromDate: "2026-07-15", toDate: "2026-07-18", travelMode: "FLIGHT", estimatedCost: 3200, currency: "USD", status: "APPROVED", priority: "HIGH", submittedDate: "2026-06-20" },
  { id: "tr-002", employee: "Bob Chen", employeeId: "EMP-003", department: "Engineering", destination: "San Francisco, USA", purpose: "Tech conference", fromDate: "2026-08-05", toDate: "2026-08-08", travelMode: "FLIGHT", estimatedCost: 2800, currency: "USD", status: "PENDING", priority: "MEDIUM", submittedDate: "2026-06-25" },
  { id: "tr-003", employee: "Carol Davis", employeeId: "EMP-004", department: "Marketing", destination: "Chicago, USA", purpose: "Marketing summit", fromDate: "2026-07-22", toDate: "2026-07-24", travelMode: "TRAIN", estimatedCost: 850, currency: "USD", status: "APPROVED", priority: "MEDIUM", submittedDate: "2026-06-18" },
  { id: "tr-004", employee: "David Wilson", employeeId: "EMP-005", department: "Data", destination: "London, UK", purpose: "Data science workshop", fromDate: "2026-09-10", toDate: "2026-09-15", travelMode: "FLIGHT", estimatedCost: 4500, currency: "USD", status: "PENDING", priority: "HIGH", submittedDate: "2026-07-01" },
  { id: "tr-005", employee: "Eve Martinez", employeeId: "EMP-006", department: "Human Resources", destination: "Austin, USA", purpose: "HR conference", fromDate: "2026-08-12", toDate: "2026-08-14", travelMode: "FLIGHT", estimatedCost: 1800, currency: "USD", status: "PENDING", priority: "LOW", submittedDate: "2026-07-05" },
  { id: "tr-006", employee: "Frank Lee", employeeId: "EMP-007", department: "Sales", destination: "Seattle, USA", purpose: "Product demo", fromDate: "2026-07-28", toDate: "2026-07-29", travelMode: "CAR", estimatedCost: 350, currency: "USD", status: "REJECTED", priority: "MEDIUM", submittedDate: "2026-06-15" },
  { id: "tr-007", employee: "Grace Kim", employeeId: "EMP-008", department: "Design", destination: "Miami, USA", purpose: "Design workshop", fromDate: "2026-09-05", toDate: "2026-09-07", travelMode: "FLIGHT", estimatedCost: 1500, currency: "USD", status: "APPROVED", priority: "MEDIUM", submittedDate: "2026-07-10" },
  { id: "tr-008", employee: "Henry Zhang", employeeId: "EMP-009", department: "Engineering", destination: "Berlin, Germany", purpose: "Engineering meetup", fromDate: "2026-10-01", toDate: "2026-10-05", travelMode: "FLIGHT", estimatedCost: 5200, currency: "USD", status: "PENDING", priority: "HIGH", submittedDate: "2026-07-15" },
  { id: "tr-009", employee: "Iris Patel", employeeId: "EMP-010", department: "Marketing", destination: "Denver, USA", purpose: "Brand strategy meeting", fromDate: "2026-08-20", toDate: "2026-08-21", travelMode: "FLIGHT", estimatedCost: 1100, currency: "USD", status: "APPROVED", priority: "HIGH", submittedDate: "2026-07-08" },
  { id: "tr-010", employee: "Jack Thompson", employeeId: "EMP-011", department: "Sales", destination: "Boston, USA", purpose: "Quarterly review", fromDate: "2026-09-15", toDate: "2026-09-17", travelMode: "TRAIN", estimatedCost: 650, currency: "USD", status: "CANCELLED", priority: "LOW", submittedDate: "2026-06-30" },
  { id: "tr-011", employee: "John Smith", employeeId: "EMP-001", department: "Engineering", destination: "Tokyo, Japan", purpose: "Partner meeting", fromDate: "2026-11-01", toDate: "2026-11-06", travelMode: "FLIGHT", estimatedCost: 6800, currency: "USD", status: "PENDING", priority: "URGENT", submittedDate: "2026-07-18" },
  { id: "tr-012", employee: "Karen White", employeeId: "EMP-012", department: "Operations", destination: "Atlanta, USA", purpose: "Vendor negotiation", fromDate: "2026-08-25", toDate: "2026-08-26", travelMode: "CAR", estimatedCost: 280, currency: "USD", status: "APPROVED", priority: "MEDIUM", submittedDate: "2026-07-12" },
  { id: "tr-013", employee: "Leo Brown", employeeId: "EMP-013", department: "Engineering", destination: "Toronto, Canada", purpose: "DevOps conference", fromDate: "2026-09-20", toDate: "2026-09-23", travelMode: "FLIGHT", estimatedCost: 2100, currency: "USD", status: "PENDING", priority: "MEDIUM", submittedDate: "2026-07-20" },
  { id: "tr-014", employee: "Mia Garcia", employeeId: "EMP-014", department: "Data", destination: "Las Vegas, USA", purpose: "Data analytics expo", fromDate: "2026-10-10", toDate: "2026-10-13", travelMode: "FLIGHT", estimatedCost: 2400, currency: "USD", status: "REJECTED", priority: "LOW", submittedDate: "2026-07-05" },
  { id: "tr-015", employee: "Noah Williams", employeeId: "EMP-015", department: "Management", destination: "Dubai, UAE", purpose: "Executive board meeting", fromDate: "2026-12-01", toDate: "2026-12-04", travelMode: "FLIGHT", estimatedCost: 7500, currency: "USD", status: "PENDING", priority: "URGENT", submittedDate: "2026-07-22" },
];

const mockExpenseClaims: ExpenseClaim[] = [
  { id: "ec-001", employee: "Alice Johnson", employeeId: "EMP-002", category: "Travel - Flights", amount: 1200, currency: "USD", submittedDate: "2026-06-22", status: "REIMBURSED", description: "Round trip NY flight", receiptUrl: "#" },
  { id: "ec-002", employee: "Bob Chen", employeeId: "EMP-003", category: "Meals & Entertainment", amount: 340, currency: "USD", submittedDate: "2026-06-25", status: "APPROVED", description: "Client dinner", receiptUrl: "#" },
  { id: "ec-003", employee: "Carol Davis", employeeId: "EMP-004", category: "Travel - Accommodation", amount: 720, currency: "USD", submittedDate: "2026-06-28", status: "SUBMITTED", description: "Hotel stay - 3 nights", receiptUrl: "#" },
  { id: "ec-004", employee: "David Wilson", employeeId: "EMP-005", category: "Office Supplies", amount: 85, currency: "USD", submittedDate: "2026-07-01", status: "REIMBURSED", description: "Stationery purchase", receiptUrl: "#" },
  { id: "ec-005", employee: "Eve Martinez", employeeId: "EMP-006", category: "Travel - Transport", amount: 150, currency: "USD", submittedDate: "2026-07-03", status: "REJECTED", description: "Taxi fares - no receipt", receiptUrl: "#" },
  { id: "ec-006", employee: "Frank Lee", employeeId: "EMP-007", category: "Meals & Entertainment", amount: 520, currency: "USD", submittedDate: "2026-07-05", status: "SUBMITTED", description: "Team lunch - project launch", receiptUrl: "#" },
  { id: "ec-007", employee: "Grace Kim", employeeId: "EMP-008", category: "Travel - Flights", amount: 950, currency: "USD", submittedDate: "2026-07-08", status: "APPROVED", description: "Flight to Miami", receiptUrl: "#" },
  { id: "ec-008", employee: "Henry Zhang", employeeId: "EMP-009", category: "Software & Subscriptions", amount: 299, currency: "USD", submittedDate: "2026-07-10", status: "REIMBURSED", description: "JetBrains license renewal", receiptUrl: "#" },
  { id: "ec-009", employee: "Iris Patel", employeeId: "EMP-010", category: "Travel - Accommodation", amount: 450, currency: "USD", submittedDate: "2026-07-12", status: "SUBMITTED", description: "Hotel Denver", receiptUrl: "#" },
  { id: "ec-010", employee: "Jack Thompson", employeeId: "EMP-011", category: "Travel - Transport", amount: 65, currency: "USD", submittedDate: "2026-07-14", status: "DRAFT", description: "Train tickets", receiptUrl: "#" },
  { id: "ec-011", employee: "John Smith", employeeId: "EMP-001", category: "Travel - Flights", amount: 2400, currency: "USD", submittedDate: "2026-07-16", status: "SUBMITTED", description: "Business class - Tokyo trip", receiptUrl: "#" },
  { id: "ec-012", employee: "Karen White", employeeId: "EMP-012", category: "Office Supplies", amount: 120, currency: "USD", submittedDate: "2026-07-18", status: "APPROVED", description: "Printer toner", receiptUrl: "#" },
  { id: "ec-013", employee: "Leo Brown", employeeId: "EMP-013", category: "Meals & Entertainment", amount: 210, currency: "USD", submittedDate: "2026-07-20", status: "DRAFT", description: "Coffee meeting with client", receiptUrl: "#" },
  { id: "ec-014", employee: "Mia Garcia", employeeId: "EMP-014", category: "Travel - Accommodation", amount: 680, currency: "USD", submittedDate: "2026-07-22", status: "REJECTED", description: "Hotel upgrade not approved", receiptUrl: "#" },
  { id: "ec-015", employee: "Noah Williams", employeeId: "EMP-015", category: "Travel - Flights", amount: 3200, currency: "USD", submittedDate: "2026-07-24", status: "SUBMITTED", description: "First class - Dubai trip", receiptUrl: "#" },
];

const mockExpenseCategories: ExpenseCategory[] = [
  { id: "expcat-001", name: "Travel - Flights", description: "Airline tickets and booking fees", budget: 50000, spent: 38500, status: "ACTIVE" },
  { id: "expcat-002", name: "Travel - Accommodation", description: "Hotel and lodging expenses", budget: 35000, spent: 27800, status: "ACTIVE" },
  { id: "expcat-003", name: "Travel - Transport", description: "Taxis, trains, and local transport", budget: 15000, spent: 9200, status: "ACTIVE" },
  { id: "expcat-004", name: "Meals & Entertainment", description: "Client meals and team entertainment", budget: 20000, spent: 18500, status: "ACTIVE" },
  { id: "expcat-005", name: "Office Supplies", description: "Stationery and office consumables", budget: 10000, spent: 4800, status: "ACTIVE" },
  { id: "expcat-006", name: "Software & Subscriptions", description: "Software licenses and subscriptions", budget: 25000, spent: 22100, status: "ACTIVE" },
  { id: "expcat-007", name: "Equipment", description: "Hardware and peripheral purchases", budget: 30000, spent: 12000, status: "INACTIVE" },
  { id: "expcat-008", name: "Training & Development", description: "Conference fees and training costs", budget: 18000, spent: 7500, status: "ACTIVE" },
  { id: "expcat-009", name: "Telecommunications", description: "Phone and internet expenses", budget: 12000, spent: 11000, status: "ACTIVE" },
  { id: "expcat-010", name: "Miscellaneous", description: "Other business expenses", budget: 8000, spent: 3200, status: "INACTIVE" },
];

const mockApprovals: TravelApproval[] = [
  { id: "ap-001", requestType: "TRAVEL", requestId: "tr-001", employee: "Alice Johnson", amount: 3200, currency: "USD", submittedDate: "2026-06-20", status: "APPROVED", approver: "Sarah Chen", comments: "Approved. Client visit is strategic.", actionDate: "2026-06-21" },
  { id: "ap-002", requestType: "TRAVEL", requestId: "tr-002", employee: "Bob Chen", amount: 2800, currency: "USD", submittedDate: "2026-06-25", status: "PENDING", approver: "Sarah Chen", comments: "" },
  { id: "ap-003", requestType: "TRAVEL", requestId: "tr-003", employee: "Carol Davis", amount: 850, currency: "USD", submittedDate: "2026-06-18", status: "APPROVED", approver: "Sarah Chen", comments: "Approved.", actionDate: "2026-06-19" },
  { id: "ap-004", requestType: "TRAVEL", requestId: "tr-004", employee: "David Wilson", amount: 4500, currency: "USD", submittedDate: "2026-07-01", status: "PENDING", approver: "Michael Brown", comments: "" },
  { id: "ap-005", requestType: "TRAVEL", requestId: "tr-005", employee: "Eve Martinez", amount: 1800, currency: "USD", submittedDate: "2026-07-05", status: "PENDING", approver: "Michael Brown", comments: "" },
  { id: "ap-006", requestType: "TRAVEL", requestId: "tr-006", employee: "Frank Lee", amount: 350, currency: "USD", submittedDate: "2026-06-15", status: "REJECTED", approver: "Sarah Chen", comments: "Budget constraints for this quarter.", actionDate: "2026-06-16" },
  { id: "ap-007", requestType: "EXPENSE", requestId: "ec-002", employee: "Bob Chen", amount: 340, currency: "USD", submittedDate: "2026-06-25", status: "APPROVED", approver: "Sarah Chen", comments: "Approved.", actionDate: "2026-06-26" },
  { id: "ap-008", requestType: "EXPENSE", requestId: "ec-003", employee: "Carol Davis", amount: 720, currency: "USD", submittedDate: "2026-06-28", status: "PENDING", approver: "Sarah Chen", comments: "" },
  { id: "ap-009", requestType: "EXPENSE", requestId: "ec-005", employee: "Eve Martinez", amount: 150, currency: "USD", submittedDate: "2026-07-03", status: "REJECTED", approver: "Sarah Chen", comments: "Missing receipts required for reimbursement.", actionDate: "2026-07-04" },
  { id: "ap-010", requestType: "EXPENSE", requestId: "ec-006", employee: "Frank Lee", amount: 520, currency: "USD", submittedDate: "2026-07-05", status: "PENDING", approver: "Michael Brown", comments: "" },
  { id: "ap-011", requestType: "EXPENSE", requestId: "ec-007", employee: "Grace Kim", amount: 950, currency: "USD", submittedDate: "2026-07-08", status: "APPROVED", approver: "Sarah Chen", comments: "Approved.", actionDate: "2026-07-09" },
  { id: "ap-012", requestType: "TRAVEL", requestId: "tr-007", employee: "Grace Kim", amount: 1500, currency: "USD", submittedDate: "2026-07-10", status: "APPROVED", approver: "Sarah Chen", comments: "Approved.", actionDate: "2026-07-11" },
  { id: "ap-013", requestType: "TRAVEL", requestId: "tr-008", employee: "Henry Zhang", amount: 5200, currency: "USD", submittedDate: "2026-07-15", status: "PENDING", approver: "Michael Brown", comments: "" },
  { id: "ap-014", requestType: "EXPENSE", requestId: "ec-014", employee: "Mia Garcia", amount: 680, currency: "USD", submittedDate: "2026-07-22", status: "REJECTED", approver: "Sarah Chen", comments: "Upgrade not in policy.", actionDate: "2026-07-23" },
  { id: "ap-015", requestType: "TRAVEL", requestId: "tr-011", employee: "John Smith", amount: 6800, currency: "USD", submittedDate: "2026-07-18", status: "PENDING", approver: "Sarah Chen", comments: "" },
];

const mockReimbursements: Reimbursement[] = [
  { id: "rem-001", employee: "Alice Johnson", employeeId: "EMP-002", claimId: "ec-001", category: "Travel - Flights", amount: 1200, currency: "USD", processedDate: "2026-07-01", status: "COMPLETED", paymentMethod: "Bank Transfer" },
  { id: "rem-002", employee: "David Wilson", employeeId: "EMP-005", claimId: "ec-004", category: "Office Supplies", amount: 85, currency: "USD", processedDate: "2026-07-10", status: "COMPLETED", paymentMethod: "Bank Transfer" },
  { id: "rem-003", employee: "Henry Zhang", employeeId: "EMP-009", claimId: "ec-008", category: "Software & Subscriptions", amount: 299, currency: "USD", processedDate: "2026-07-20", status: "COMPLETED", paymentMethod: "Bank Transfer" },
  { id: "rem-004", employee: "Carol Davis", employeeId: "EMP-004", claimId: "ec-003", category: "Travel - Accommodation", amount: 720, currency: "USD", processedDate: "2026-07-25", status: "PROCESSING", paymentMethod: "Bank Transfer" },
  { id: "rem-005", employee: "Bob Chen", employeeId: "EMP-003", claimId: "ec-002", category: "Meals & Entertainment", amount: 340, currency: "USD", processedDate: "2026-07-26", status: "PROCESSING", paymentMethod: "Bank Transfer" },
  { id: "rem-006", employee: "Grace Kim", employeeId: "EMP-008", claimId: "ec-007", category: "Travel - Flights", amount: 950, currency: "USD", processedDate: "2026-07-28", status: "PENDING", paymentMethod: "Bank Transfer" },
  { id: "rem-007", employee: "John Smith", employeeId: "EMP-001", claimId: "ec-011", category: "Travel - Flights", amount: 2400, currency: "USD", processedDate: "2026-08-01", status: "PENDING", paymentMethod: "Bank Transfer" },
  { id: "rem-008", employee: "Iris Patel", employeeId: "EMP-010", claimId: "ec-009", category: "Travel - Accommodation", amount: 450, currency: "USD", processedDate: "2026-08-05", status: "PENDING", paymentMethod: "Wire Transfer" },
];

const mockCorporateTrips: CorporateTrip[] = [
  { id: "ct-001", tripName: "NYC Quarterly Review", destination: "New York, USA", airline: "Delta Air Lines", hotel: "Marriott Times Square", totalCost: 4500, currency: "USD", travelers: 3, fromDate: "2026-07-15", toDate: "2026-07-18", status: "CONFIRMED" },
  { id: "ct-002", tripName: "Tech Summit 2026", destination: "San Francisco, USA", airline: "United Airlines", hotel: "Hilton Union Square", totalCost: 5200, currency: "USD", travelers: 4, fromDate: "2026-08-05", toDate: "2026-08-08", status: "PLANNED" },
  { id: "ct-003", tripName: "Marketing Summit Chicago", destination: "Chicago, USA", airline: "American Airlines", hotel: "Sheraton Chicago", totalCost: 2800, currency: "USD", travelers: 2, fromDate: "2026-07-22", toDate: "2026-07-24", status: "CONFIRMED" },
  { id: "ct-004", tripName: "London Data Workshop", destination: "London, UK", airline: "British Airways", hotel: "The Kensington", totalCost: 9800, currency: "USD", travelers: 2, fromDate: "2026-09-10", toDate: "2026-09-15", status: "PLANNED" },
  { id: "ct-005", tripName: "HR Conference Austin", destination: "Austin, USA", airline: "Southwest Airlines", hotel: "JW Marriott Austin", totalCost: 3600, currency: "USD", travelers: 3, fromDate: "2026-08-12", toDate: "2026-08-14", status: "PLANNED" },
  { id: "ct-006", tripName: "Design Workshop Miami", destination: "Miami, USA", airline: "American Airlines", hotel: "The Ritz-Carlton", totalCost: 4200, currency: "USD", travelers: 2, fromDate: "2026-09-05", toDate: "2026-09-07", status: "CONFIRMED" },
  { id: "ct-007", tripName: "Engineering Meetup Berlin", destination: "Berlin, Germany", airline: "Lufthansa", hotel: "Hotel Adlon Kempinski", totalCost: 12500, currency: "USD", travelers: 3, fromDate: "2026-10-01", toDate: "2026-10-05", status: "PLANNED" },
  { id: "ct-008", tripName: "Tokyo Partner Summit", destination: "Tokyo, Japan", airline: "Japan Airlines", hotel: "Park Hyatt Tokyo", totalCost: 18500, currency: "USD", travelers: 2, fromDate: "2026-11-01", toDate: "2026-11-06", status: "PLANNED" },
  { id: "ct-009", tripName: "Dubai Executive Meeting", destination: "Dubai, UAE", airline: "Emirates", hotel: "Burj Al Arab", totalCost: 22000, currency: "USD", travelers: 4, fromDate: "2026-12-01", toDate: "2026-12-04", status: "PLANNED" },
  { id: "ct-010", tripName: "Client Visit Boston", destination: "Boston, USA", airline: "", hotel: "", totalCost: 1200, currency: "USD", travelers: 2, fromDate: "2026-09-15", toDate: "2026-09-16", status: "CANCELLED" },
];

const mockTravelPolicies: TravelPolicy[] = [
  { id: "pol-001", title: "Domestic Travel Policy", category: "Travel", description: "Guidelines for domestic business travel including flight class, accommodation limits, and per diem rates.", effectiveDate: "2026-01-01", version: "3.2", status: "ACTIVE" },
  { id: "pol-002", title: "International Travel Policy", category: "Travel", description: "Rules for international travel including visa requirements, travel insurance, and advance booking.", effectiveDate: "2026-01-01", version: "2.1", status: "ACTIVE" },
  { id: "pol-003", title: "Expense Reimbursement Policy", category: "Expense", description: "Process for submitting expense claims, required documentation, and reimbursement timelines.", effectiveDate: "2026-02-01", version: "4.0", status: "ACTIVE" },
  { id: "pol-004", title: "Meals & Entertainment Policy", category: "Expense", description: "Allowable limits for client meals, team outings, and entertainment expenses.", effectiveDate: "2026-01-15", version: "1.3", status: "ACTIVE" },
  { id: "pol-005", title: "Travel Advance Policy", category: "Travel", description: "Procedure for requesting cash advances before travel and settlement requirements.", effectiveDate: "2026-03-01", version: "1.0", status: "ACTIVE" },
  { id: "pol-006", title: "Corporate Card Usage Policy", category: "Expense", description: "Guidelines for using company credit cards including spending limits and reconciliation.", effectiveDate: "2026-04-01", version: "2.0", status: "DRAFT" },
  { id: "pol-007", title: "Vehicle Mileage Reimbursement", category: "Travel", description: "Mileage rates and reimbursement process for personal vehicle use for business.", effectiveDate: "2025-06-01", version: "1.5", status: "ACTIVE" },
  { id: "pol-008", title: "Travel Booking Policy", category: "Travel", description: "Mandatory use of corporate travel portal, approved vendors, and booking timelines.", effectiveDate: "2026-05-01", version: "1.0", status: "ACTIVE" },
  { id: "pol-009", title: "Conference & Event Attendance", category: "Expense", description: "Approval process and budget allocation for attending external conferences and events.", effectiveDate: "2026-02-15", version: "2.1", status: "ACTIVE" },
  { id: "pol-010", title: "Remote Work Equipment Policy", category: "Expense", description: "Eligibility and reimbursement limits for home office equipment purchases.", effectiveDate: "2025-09-01", version: "1.0", status: "ARCHIVED" },
];

// ── Travel & Expense API Functions ──

export async function fetchTravelDashboard(): Promise<{ data: TravelDashboardStats }> {
  return {
    data: {
      totalClaims: mockExpenseClaims.length,
      pendingApprovals: mockApprovals.filter((a) => a.status === "PENDING").length,
      approvedClaims: mockExpenseClaims.filter((c) => c.status === "APPROVED" || c.status === "REIMBURSED").length,
      rejectedClaims: mockExpenseClaims.filter((c) => c.status === "REJECTED").length,
      reimbursementAmount: mockReimbursements.filter((r) => r.status === "COMPLETED" || r.status === "PROCESSING").reduce((s, r) => s + r.amount, 0),
      travelRequests: mockTravelRequests.length,
    },
  };
}

export async function fetchTravelRequests(filters?: { search?: string; status?: string; priority?: string; skip?: number; take?: number }): Promise<{ data: TravelRequest[]; total: number; skip: number; take: number }> {
  let filtered = [...mockTravelRequests];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((t) => t.employee.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s) || t.purpose.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((t) => t.status === filters.status);
  if (filters?.priority) filtered = filtered.filter((t) => t.priority === filters.priority);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchExpenseClaims(filters?: { search?: string; status?: string; category?: string; skip?: number; take?: number }): Promise<{ data: ExpenseClaim[]; total: number; skip: number; take: number }> {
  let filtered = [...mockExpenseClaims];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.employee.toLowerCase().includes(s) || c.description.toLowerCase().includes(s) || c.category.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
  if (filters?.category) filtered = filtered.filter((c) => c.category === filters.category);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchExpenseCategories(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: ExpenseCategory[]; total: number; skip: number; take: number }> {
  let filtered = [...mockExpenseCategories];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchTravelApprovals(filters?: { search?: string; status?: string; requestType?: string; skip?: number; take?: number }): Promise<{ data: TravelApproval[]; total: number; skip: number; take: number }> {
  let filtered = [...mockApprovals];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.employee.toLowerCase().includes(s) || a.approver.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  if (filters?.requestType) filtered = filtered.filter((a) => a.requestType === filters.requestType);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchReimbursements(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Reimbursement[]; total: number; skip: number; take: number }> {
  let filtered = [...mockReimbursements];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((r) => r.employee.toLowerCase().includes(s) || r.category.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((r) => r.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchCorporateTrips(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: CorporateTrip[]; total: number; skip: number; take: number }> {
  let filtered = [...mockCorporateTrips];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((t) => t.tripName.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((t) => t.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchTravelPolicies(filters?: { search?: string; status?: string; category?: string; skip?: number; take?: number }): Promise<{ data: TravelPolicy[]; total: number; skip: number; take: number }> {
  let filtered = [...mockTravelPolicies];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  if (filters?.category) filtered = filtered.filter((p) => p.category === filters.category);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchTravelExpenseReports(): Promise<{ data: TravelExpenseReportData[] }> {
  return {
    data: [
      { month: "Jan", travel: 18500, expense: 12400, reimbursed: 9800 },
      { month: "Feb", travel: 22000, expense: 9800, reimbursed: 11200 },
      { month: "Mar", travel: 16800, expense: 14500, reimbursed: 13500 },
      { month: "Apr", travel: 19500, expense: 11200, reimbursed: 14200 },
      { month: "May", travel: 24000, expense: 13600, reimbursed: 15800 },
      { month: "Jun", travel: 21000, expense: 15200, reimbursed: 16500 },
    ],
  };
}

export async function fetchTravelDeptData(): Promise<{ data: TravelDeptData[] }> {
  return {
    data: [
      { department: "Sales", travelCount: 12, expenseCount: 45, totalAmount: 38000 },
      { department: "Engineering", travelCount: 18, expenseCount: 32, totalAmount: 52000 },
      { department: "Marketing", travelCount: 8, expenseCount: 28, totalAmount: 24000 },
      { department: "Data", travelCount: 6, expenseCount: 15, totalAmount: 18000 },
      { department: "Human Resources", travelCount: 4, expenseCount: 12, totalAmount: 8500 },
      { department: "Design", travelCount: 5, expenseCount: 18, totalAmount: 14000 },
      { department: "Operations", travelCount: 7, expenseCount: 20, totalAmount: 16000 },
      { department: "Management", travelCount: 9, expenseCount: 22, totalAmount: 45000 },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════
// Compliance & Policy Management
// ═══════════════════════════════════════════════════════════════════

export type PolicyStatus = "ACTIVE" | "DRAFT" | "ARCHIVED" | "REVIEW_REQUIRED";
export type RequirementPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type RequirementStatus = "ACTIVE" | "OVERDUE" | "COMPLETED" | "WAIVED";
export type AuditStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "REMEDIATION";
export type ViolationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ViolationStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";
export type CorrectiveActionPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type CorrectiveActionStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "CLOSED";
export type AcknowledgementStatus = "ACKNOWLEDGED" | "PENDING" | "OVERDUE";
export type TrainingComplianceStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "OVERDUE";

export interface Policy {
  id: string;
  policyName: string;
  category: string;
  description: string | null;
  version: string;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyCategory {
  id: string;
  name: string;
  description: string | null;
  policyCount: number;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string | null;
  priority: RequirementPriority;
  dueDate: string | null;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Audit {
  id: string;
  auditName: string;
  auditType: string;
  auditor: string;
  scheduledDate: string;
  completedDate: string | null;
  status: AuditStatus;
  createdAt: string;
}

export interface Violation {
  id: string;
  employeeName: string;
  policyName: string;
  severity: ViolationSeverity;
  description: string;
  status: ViolationStatus;
  createdAt: string;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string | null;
  assignedTo: string;
  priority: CorrectiveActionPriority;
  dueDate: string | null;
  status: CorrectiveActionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Acknowledgement {
  id: string;
  employeeName: string;
  policyName: string;
  acknowledgedDate: string | null;
  status: AcknowledgementStatus;
}

export interface TrainingCompliance {
  id: string;
  employeeName: string;
  trainingModule: string;
  assignedDate: string;
  completionDate: string | null;
  score: number | null;
  status: TrainingComplianceStatus;
}

export interface ComplianceDashboardStats {
  activePolicies: number;
  pendingAcknowledgements: number;
  openViolations: number;
  upcomingAudits: number;
  overdueRequirements: number;
  trainingComplianceRate: number;
}

export interface ComplianceTrendData {
  month: string;
  complianceScore: number;
  violationCount: number;
}

export interface ViolationByCategoryData {
  category: string;
  count: number;
}

export interface AuditCompletionData {
  quarter: string;
  total: number;
  completed: number;
  failed: number;
}

export interface DeptComplianceData {
  department: string;
  complianceRate: number;
}

export interface PolicyAdherenceTrendData {
  month: string;
  adherenceRate: number;
  acknowledgementRate: number;
}

// ── Mock Data ───────────────────────────────────────────

const mockPolicies: Policy[] = [
  { id: "pol-001", policyName: "Data Protection Policy", category: "Data Privacy", description: "Company-wide data handling and protection guidelines", version: "2.1", status: "ACTIVE", createdAt: "2025-01-15T00:00:00Z", updatedAt: "2026-03-10T00:00:00Z" },
  { id: "pol-002", policyName: "Information Security Policy", category: "Security", description: "Security standards for information systems", version: "3.0", status: "ACTIVE", createdAt: "2025-02-01T00:00:00Z", updatedAt: "2026-02-20T00:00:00Z" },
  { id: "pol-003", policyName: "Code of Conduct", category: "Ethics", description: "Ethical guidelines and professional behavior", version: "1.5", status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z", updatedAt: "2026-01-05T00:00:00Z" },
  { id: "pol-004", policyName: "Remote Work Policy", category: "HR", description: "Guidelines for remote and hybrid work arrangements", version: "2.0", status: "ACTIVE", createdAt: "2025-03-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "pol-005", policyName: "Acceptable Use Policy", category: "IT", description: "Acceptable use of company technology resources", version: "1.8", status: "REVIEW_REQUIRED", createdAt: "2024-11-01T00:00:00Z", updatedAt: "2025-12-15T00:00:00Z" },
  { id: "pol-006", policyName: "Anti-Bribery Policy", category: "Compliance", description: "Anti-bribery and anti-corruption compliance", version: "1.2", status: "ACTIVE", createdAt: "2025-04-10T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z" },
  { id: "pol-007", policyName: "GDPR Compliance Policy", category: "Data Privacy", description: "GDPR data protection compliance framework", version: "2.3", status: "ACTIVE", createdAt: "2025-01-20T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "pol-008", policyName: "Social Media Policy", category: "HR", description: "Guidelines for social media usage", version: "1.0", status: "DRAFT", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "pol-009", policyName: "Whistleblower Policy", category: "Ethics", description: "Procedure for reporting misconduct", version: "1.1", status: "ACTIVE", createdAt: "2025-06-01T00:00:00Z", updatedAt: "2026-02-10T00:00:00Z" },
  { id: "pol-010", policyName: "Business Continuity Policy", category: "Operations", description: "Business continuity and disaster recovery", version: "2.0", status: "REVIEW_REQUIRED", createdAt: "2024-09-01T00:00:00Z", updatedAt: "2025-11-20T00:00:00Z" },
  { id: "pol-011", policyName: "Travel & Expense Policy", category: "Finance", description: "Travel booking and expense reimbursement rules", version: "3.1", status: "ACTIVE", createdAt: "2025-03-15T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
  { id: "pol-012", policyName: "Password Policy", category: "Security", description: "Password complexity and rotation requirements", version: "1.6", status: "ACTIVE", createdAt: "2025-02-15T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
];

const mockPolicyCategories: PolicyCategory[] = [
  { id: "pc-001", name: "Data Privacy", description: "Policies related to data protection and privacy", policyCount: 2 },
  { id: "pc-002", name: "Security", description: "Information and cyber security policies", policyCount: 2 },
  { id: "pc-003", name: "Ethics", description: "Ethical conduct and integrity policies", policyCount: 2 },
  { id: "pc-004", name: "HR", description: "Human resources and workplace policies", policyCount: 2 },
  { id: "pc-005", name: "IT", description: "Information technology usage policies", policyCount: 1 },
  { id: "pc-006", name: "Compliance", description: "Regulatory compliance policies", policyCount: 1 },
  { id: "pc-007", name: "Finance", description: "Financial and expense policies", policyCount: 1 },
  { id: "pc-008", name: "Operations", description: "Operational and continuity policies", policyCount: 1 },
];

const mockRequirements: ComplianceRequirement[] = [
  { id: "req-001", title: "Annual SOC 2 Type II Audit", description: "Complete annual SOC 2 audit for data centers", priority: "CRITICAL", dueDate: "2026-09-30T00:00:00Z", status: "ACTIVE", createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-01-15T00:00:00Z" },
  { id: "req-002", title: "GDPR Data Audit", description: "Annual GDPR compliance audit for EU user data", priority: "CRITICAL", dueDate: "2026-08-15T00:00:00Z", status: "ACTIVE", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-02-01T00:00:00Z" },
  { id: "req-003", title: "Employee Data Retention Cleanup", description: "Purge outdated employee records per retention policy", priority: "HIGH", dueDate: "2026-06-30T00:00:00Z", status: "OVERDUE", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
  { id: "req-004", title: "ISO 27001 Recertification", description: "Renew ISO 27001 certification for security management", priority: "CRITICAL", dueDate: "2026-11-30T00:00:00Z", status: "ACTIVE", createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-10T00:00:00Z" },
  { id: "req-005", title: "Quarterly Access Review", description: "Review and revoke inappropriate system access", priority: "HIGH", dueDate: "2026-07-15T00:00:00Z", status: "ACTIVE", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "req-006", title: "Vendor Risk Assessment", description: "Complete risk assessment for all third-party vendors", priority: "MEDIUM", dueDate: "2026-08-30T00:00:00Z", status: "ACTIVE", createdAt: "2026-02-15T00:00:00Z", updatedAt: "2026-02-15T00:00:00Z" },
  { id: "req-007", title: "HIPAA Compliance Check", description: "Verify HIPAA compliance for health data handling", priority: "HIGH", dueDate: "2026-05-30T00:00:00Z", status: "COMPLETED", createdAt: "2026-01-20T00:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
  { id: "req-008", title: "Anti-Money Laundering Training", description: "Annual AML training for finance team", priority: "MEDIUM", dueDate: "2026-06-01T00:00:00Z", status: "COMPLETED", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-05-28T00:00:00Z" },
  { id: "req-009", title: "PCI DSS Compliance Validation", description: "Validate PCI DSS compliance for payment processing", priority: "CRITICAL", dueDate: "2026-10-31T00:00:00Z", status: "ACTIVE", createdAt: "2026-01-05T00:00:00Z", updatedAt: "2026-01-05T00:00:00Z" },
  { id: "req-010", title: "Data Breach Response Drill", description: "Conduct simulated data breach response exercise", priority: "LOW", dueDate: "2026-12-15T00:00:00Z", status: "ACTIVE", createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
];

const mockAudits: Audit[] = [
  { id: "aud-001", auditName: "SOC 2 Type II Audit", auditType: "SOC 2", auditor: "Deloitte", scheduledDate: "2026-07-15T00:00:00Z", completedDate: null, status: "SCHEDULED", createdAt: "2026-01-10T00:00:00Z" },
  { id: "aud-002", auditName: "Q1 Internal Security Audit", auditType: "Internal", auditor: "Internal Security Team", scheduledDate: "2026-02-01T00:00:00Z", completedDate: "2026-02-28T00:00:00Z", status: "COMPLETED", createdAt: "2025-12-15T00:00:00Z" },
  { id: "aud-003", auditName: "GDPR Compliance Audit", auditType: "Regulatory", auditor: "EU Data Protection Authority", scheduledDate: "2026-08-01T00:00:00Z", completedDate: null, status: "SCHEDULED", createdAt: "2026-03-01T00:00:00Z" },
  { id: "aud-004", auditName: "ISO 27001 Surveillance Audit", auditType: "ISO 27001", auditor: "BSI Group", scheduledDate: "2026-09-15T00:00:00Z", completedDate: null, status: "SCHEDULED", createdAt: "2026-04-01T00:00:00Z" },
  { id: "aud-005", auditName: "Q2 Internal Audit", auditType: "Internal", auditor: "Internal Audit Team", scheduledDate: "2026-05-01T00:00:00Z", completedDate: "2026-05-20T00:00:00Z", status: "COMPLETED", createdAt: "2026-03-15T00:00:00Z" },
  { id: "aud-006", auditName: "HIPAA Compliance Review", auditType: "Regulatory", auditor: "External HIPAA Consultant", scheduledDate: "2026-04-10T00:00:00Z", completedDate: "2026-04-25T00:00:00Z", status: "REMEDIATION", createdAt: "2026-02-01T00:00:00Z" },
  { id: "aud-007", auditName: "PCI DSS Annual Assessment", auditType: "External", auditor: "SecureTrust", scheduledDate: "2026-10-01T00:00:00Z", completedDate: null, status: "SCHEDULED", createdAt: "2026-05-01T00:00:00Z" },
  { id: "aud-008", auditName: "Vendor Security Audit - Cloud Providers", auditType: "External", auditor: "Third Party Auditor", scheduledDate: "2026-06-01T00:00:00Z", completedDate: "2026-06-15T00:00:00Z", status: "FAILED", createdAt: "2026-04-15T00:00:00Z" },
];

const mockViolations: Violation[] = [
  { id: "vio-001", employeeName: "Alice Johnson", policyName: "Data Protection Policy", severity: "CRITICAL", description: "Unauthorized data export to personal device", status: "INVESTIGATING", createdAt: "2026-05-20T00:00:00Z" },
  { id: "vio-002", employeeName: "Bob Smith", policyName: "Acceptable Use Policy", severity: "HIGH", description: "Accessing inappropriate websites during work hours", status: "OPEN", createdAt: "2026-05-18T00:00:00Z" },
  { id: "vio-003", employeeName: "Carol Davis", policyName: "Password Policy", severity: "MEDIUM", description: "Sharing passwords with team members", status: "RESOLVED", createdAt: "2026-05-10T00:00:00Z" },
  { id: "vio-004", employeeName: "Dan Wilson", policyName: "Code of Conduct", severity: "HIGH", description: "Harassment complaint from team member", status: "INVESTIGATING", createdAt: "2026-05-22T00:00:00Z" },
  { id: "vio-005", employeeName: "Eve Martinez", policyName: "Remote Work Policy", severity: "LOW", description: "Working from unapproved location", status: "DISMISSED", createdAt: "2026-05-05T00:00:00Z" },
  { id: "vio-006", employeeName: "Frank Lee", policyName: "Information Security Policy", severity: "CRITICAL", description: "Installing unauthorized software on company laptop", status: "OPEN", createdAt: "2026-05-25T00:00:00Z" },
  { id: "vio-007", employeeName: "Grace Kim", policyName: "Travel & Expense Policy", severity: "MEDIUM", description: "Submitting duplicate expense claims", status: "RESOLVED", createdAt: "2026-04-28T00:00:00Z" },
  { id: "vio-008", employeeName: "Henry Brown", policyName: "Data Protection Policy", severity: "HIGH", description: "Emailing sensitive data to external recipient", status: "INVESTIGATING", createdAt: "2026-05-21T00:00:00Z" },
  { id: "vio-009", employeeName: "Irene Chen", policyName: "Anti-Bribery Policy", severity: "CRITICAL", description: "Accepting gifts from vendor above threshold", status: "OPEN", createdAt: "2026-05-23T00:00:00Z" },
  { id: "vio-010", employeeName: "Jack Taylor", policyName: "Social Media Policy", severity: "LOW", description: "Posting confidential company info on LinkedIn", status: "DISMISSED", createdAt: "2026-04-15T00:00:00Z" },
];

const mockCorrectiveActions: CorrectiveAction[] = [
  { id: "ca-001", title: "Revoke unauthorized data access", description: "Remove Alice Johnson's export permissions and conduct training", assignedTo: "IT Security Team", priority: "CRITICAL", dueDate: "2026-06-01T00:00:00Z", status: "IN_PROGRESS", createdAt: "2026-05-20T00:00:00Z", updatedAt: "2026-05-22T00:00:00Z" },
  { id: "ca-002", title: "Update website filtering rules", description: "Add new categories to web content filter", assignedTo: "IT Operations", priority: "HIGH", dueDate: "2026-06-05T00:00:00Z", status: "OPEN", createdAt: "2026-05-18T00:00:00Z", updatedAt: "2026-05-18T00:00:00Z" },
  { id: "ca-003", title: "Password policy refresher training", description: "Conduct mandatory password security training for all staff", assignedTo: "Security Team", priority: "MEDIUM", dueDate: "2026-06-15T00:00:00Z", status: "COMPLETED", createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-30T00:00:00Z" },
  { id: "ca-004", title: "Conduct harassment investigation", description: "Formal investigation into Dan Wilson's case", assignedTo: "HR Department", priority: "HIGH", dueDate: "2026-06-10T00:00:00Z", status: "IN_PROGRESS", createdAt: "2026-05-22T00:00:00Z", updatedAt: "2026-05-24T00:00:00Z" },
  { id: "ca-005", title: "Software whitelist review", description: "Review and update approved software list", assignedTo: "IT Security", priority: "CRITICAL", dueDate: "2026-06-08T00:00:00Z", status: "OPEN", createdAt: "2026-05-25T00:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
  { id: "ca-006", title: "Implement DLP solution", description: "Deploy data loss prevention for email and endpoints", assignedTo: "Security Engineering", priority: "CRITICAL", dueDate: "2026-07-01T00:00:00Z", status: "OPEN", createdAt: "2026-05-21T00:00:00Z", updatedAt: "2026-05-21T00:00:00Z" },
  { id: "ca-007", title: "Gift policy awareness session", description: "Conduct anti-bribery policy awareness session for procurement", assignedTo: "Compliance Officer", priority: "HIGH", dueDate: "2026-06-12T00:00:00Z", status: "OPEN", createdAt: "2026-05-23T00:00:00Z", updatedAt: "2026-05-23T00:00:00Z" },
  { id: "ca-008", title: "Expense audit trail improvement", description: "Implement automated expense claim audit system", assignedTo: "Finance Team", priority: "MEDIUM", dueDate: "2026-07-15T00:00:00Z", status: "VERIFIED", createdAt: "2026-04-28T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
];

const mockAcknowledgements: Acknowledgement[] = [
  { id: "ack-001", employeeName: "Alice Johnson", policyName: "Data Protection Policy", acknowledgedDate: "2026-01-15T00:00:00Z", status: "ACKNOWLEDGED" },
  { id: "ack-002", employeeName: "Bob Smith", policyName: "Code of Conduct", acknowledgedDate: "2026-01-10T00:00:00Z", status: "ACKNOWLEDGED" },
  { id: "ack-003", employeeName: "Carol Davis", policyName: "Information Security Policy", acknowledgedDate: null, status: "PENDING" },
  { id: "ack-004", employeeName: "Dan Wilson", policyName: "Remote Work Policy", acknowledgedDate: "2026-03-01T00:00:00Z", status: "ACKNOWLEDGED" },
  { id: "ack-005", employeeName: "Eve Martinez", policyName: "GDPR Compliance Policy", acknowledgedDate: null, status: "OVERDUE" },
  { id: "ack-006", employeeName: "Frank Lee", policyName: "Acceptable Use Policy", acknowledgedDate: "2026-02-20T00:00:00Z", status: "ACKNOWLEDGED" },
  { id: "ack-007", employeeName: "Grace Kim", policyName: "Anti-Bribery Policy", acknowledgedDate: null, status: "PENDING" },
  { id: "ack-008", employeeName: "Henry Brown", policyName: "Data Protection Policy", acknowledgedDate: null, status: "OVERDUE" },
  { id: "ack-009", employeeName: "Irene Chen", policyName: "Whistleblower Policy", acknowledgedDate: "2026-04-05T00:00:00Z", status: "ACKNOWLEDGED" },
  { id: "ack-010", employeeName: "Jack Taylor", policyName: "Social Media Policy", acknowledgedDate: null, status: "PENDING" },
];

const mockTrainingCompliance: TrainingCompliance[] = [
  { id: "tc-001", employeeName: "Alice Johnson", trainingModule: "Data Privacy Training", assignedDate: "2026-01-01T00:00:00Z", completionDate: "2026-01-20T00:00:00Z", score: 92, status: "COMPLETED" },
  { id: "tc-002", employeeName: "Bob Smith", trainingModule: "Security Awareness", assignedDate: "2026-01-01T00:00:00Z", completionDate: "2026-02-10T00:00:00Z", score: 78, status: "COMPLETED" },
  { id: "tc-003", employeeName: "Carol Davis", trainingModule: "GDPR Compliance Training", assignedDate: "2026-02-01T00:00:00Z", completionDate: null, score: null, status: "IN_PROGRESS" },
  { id: "tc-004", employeeName: "Dan Wilson", trainingModule: "Anti-Bribery Training", assignedDate: "2026-03-01T00:00:00Z", completionDate: null, score: null, status: "NOT_STARTED" },
  { id: "tc-005", employeeName: "Eve Martinez", trainingModule: "Data Privacy Training", assignedDate: "2026-01-01T00:00:00Z", completionDate: null, score: null, status: "OVERDUE" },
  { id: "tc-006", employeeName: "Frank Lee", trainingModule: "Security Awareness", assignedDate: "2026-01-01T00:00:00Z", completionDate: "2026-03-15T00:00:00Z", score: 85, status: "COMPLETED" },
  { id: "tc-007", employeeName: "Grace Kim", trainingModule: "Code of Conduct Training", assignedDate: "2026-02-01T00:00:00Z", completionDate: "2026-02-28T00:00:00Z", score: 95, status: "COMPLETED" },
  { id: "tc-008", employeeName: "Henry Brown", trainingModule: "GDPR Compliance Training", assignedDate: "2026-02-01T00:00:00Z", completionDate: null, score: null, status: "IN_PROGRESS" },
  { id: "tc-009", employeeName: "Irene Chen", trainingModule: "Anti-Bribery Training", assignedDate: "2026-03-01T00:00:00Z", completionDate: "2026-03-25T00:00:00Z", score: 88, status: "COMPLETED" },
  { id: "tc-010", employeeName: "Jack Taylor", trainingModule: "Data Privacy Training", assignedDate: "2026-01-01T00:00:00Z", completionDate: null, score: null, status: "NOT_STARTED" },
  { id: "tc-011", employeeName: "Alice Johnson", trainingModule: "Security Awareness Refresher", assignedDate: "2026-04-01T00:00:00Z", completionDate: null, score: null, status: "IN_PROGRESS" },
  { id: "tc-012", employeeName: "Bob Smith", trainingModule: "GDPR Compliance Training", assignedDate: "2026-02-01T00:00:00Z", completionDate: null, score: null, status: "NOT_STARTED" },
];

// ── Policies ────────────────────────────────────────────

export async function fetchPolicies(filters?: { search?: string; category?: string; status?: string; skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<{ data: Policy[]; total: number; skip: number; take: number }> {
  let filtered = [...mockPolicies];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((p) => p.policyName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (filters?.category) filtered = filtered.filter((p) => p.category === filters.category);
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  if (filters?.orderBy === "createdAt" && filters?.orderDir === "desc") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function createPolicy(body: { policyName: string; category: string; description?: string; version?: string }): Promise<{ data: Policy }> {
  const policy: Policy = {
    id: `pol-${String(mockPolicies.length + 1).padStart(3, "0")}`,
    policyName: body.policyName,
    category: body.category,
    description: body.description ?? null,
    version: body.version ?? "1.0",
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockPolicies.push(policy);
  return { data: policy };
}

export async function updatePolicy(id: string, body: Partial<Pick<Policy, "policyName" | "category" | "description" | "version" | "status">>): Promise<{ data: Policy }> {
  const idx = mockPolicies.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Policy not found.");
  Object.assign(mockPolicies[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockPolicies[idx] };
}

// ── Policy Categories ──────────────────────────────────

export async function fetchPolicyCategories(filters?: { search?: string; skip?: number; take?: number }): Promise<{ data: PolicyCategory[]; total: number; skip: number; take: number }> {
  let filtered = [...mockPolicyCategories];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
  }
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function createPolicyCategory(body: { name: string; description?: string }): Promise<{ data: PolicyCategory }> {
  const cat: PolicyCategory = { id: `pc-${String(mockPolicyCategories.length + 1).padStart(3, "0")}`, name: body.name, description: body.description ?? null, policyCount: 0 };
  mockPolicyCategories.push(cat);
  return { data: cat };
}

export async function updatePolicyCategory(id: string, body: Partial<Pick<PolicyCategory, "name" | "description">>): Promise<{ data: PolicyCategory }> {
  const idx = mockPolicyCategories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Category not found.");
  Object.assign(mockPolicyCategories[idx], body);
  return { data: mockPolicyCategories[idx] };
}

// ── Compliance Requirements ────────────────────────────

export async function fetchComplianceRequirements(filters?: { search?: string; status?: string; priority?: string; skip?: number; take?: number }): Promise<{ data: ComplianceRequirement[]; total: number; skip: number; take: number }> {
  let filtered = [...mockRequirements];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((r) => r.title.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)));
  }
  if (filters?.status) filtered = filtered.filter((r) => r.status === filters.status);
  if (filters?.priority) filtered = filtered.filter((r) => r.priority === filters.priority);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function createComplianceRequirement(body: { title: string; description?: string; priority?: string; dueDate?: string }): Promise<{ data: ComplianceRequirement }> {
  const req: ComplianceRequirement = {
    id: `req-${String(mockRequirements.length + 1).padStart(3, "0")}`,
    title: body.title,
    description: body.description ?? null,
    priority: (body.priority ?? "MEDIUM") as RequirementPriority,
    dueDate: body.dueDate ?? null,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockRequirements.push(req);
  return { data: req };
}

export async function updateComplianceRequirement(id: string, body: Partial<Pick<ComplianceRequirement, "title" | "description" | "priority" | "dueDate" | "status">>): Promise<{ data: ComplianceRequirement }> {
  const idx = mockRequirements.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Requirement not found.");
  Object.assign(mockRequirements[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockRequirements[idx] };
}

// ── Audits ─────────────────────────────────────────────

export async function fetchAudits(filters?: { search?: string; auditType?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Audit[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAudits];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.auditName.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q));
  }
  if (filters?.auditType) filtered = filtered.filter((a) => a.auditType === filters.auditType);
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function createAudit(body: { auditName: string; auditType: string; auditor: string; scheduledDate?: string }): Promise<{ data: Audit }> {
  const audit: Audit = {
    id: `aud-${String(mockAudits.length + 1).padStart(3, "0")}`,
    auditName: body.auditName,
    auditType: body.auditType,
    auditor: body.auditor,
    scheduledDate: body.scheduledDate ?? new Date().toISOString(),
    completedDate: null,
    status: "SCHEDULED",
    createdAt: new Date().toISOString(),
  };
  mockAudits.push(audit);
  return { data: audit };
}

export async function updateAuditStatus(id: string, status: AuditStatus): Promise<{ data: Audit }> {
  const idx = mockAudits.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Audit not found.");
  mockAudits[idx].status = status;
  if (status === "COMPLETED" || status === "FAILED") mockAudits[idx].completedDate = new Date().toISOString();
  return { data: mockAudits[idx] };
}

// ── Violations ─────────────────────────────────────────

export async function fetchViolations(filters?: { search?: string; severity?: string; status?: string; skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<{ data: Violation[]; total: number; skip: number; take: number }> {
  let filtered = [...mockViolations];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((v) => v.employeeName.toLowerCase().includes(q) || v.policyName.toLowerCase().includes(q));
  }
  if (filters?.severity) filtered = filtered.filter((v) => v.severity === filters.severity);
  if (filters?.status) filtered = filtered.filter((v) => v.status === filters.status);
  if (filters?.orderBy === "createdAt" && filters?.orderDir === "desc") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function updateViolationStatus(id: string, status: ViolationStatus): Promise<{ data: Violation }> {
  const idx = mockViolations.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Violation not found.");
  mockViolations[idx].status = status;
  return { data: mockViolations[idx] };
}

// ── Corrective Actions ─────────────────────────────────

export async function fetchCorrectiveActions(filters?: { search?: string; status?: string; priority?: string; skip?: number; take?: number }): Promise<{ data: CorrectiveAction[]; total: number; skip: number; take: number }> {
  let filtered = [...mockCorrectiveActions];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.title.toLowerCase().includes(q) || a.assignedTo.toLowerCase().includes(q));
  }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  if (filters?.priority) filtered = filtered.filter((a) => a.priority === filters.priority);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

export async function createCorrectiveAction(body: { title: string; description?: string; assignedTo: string; priority?: string; dueDate?: string }): Promise<{ data: CorrectiveAction }> {
  const action: CorrectiveAction = {
    id: `ca-${String(mockCorrectiveActions.length + 1).padStart(3, "0")}`,
    title: body.title,
    description: body.description ?? null,
    assignedTo: body.assignedTo,
    priority: (body.priority ?? "MEDIUM") as CorrectiveActionPriority,
    dueDate: body.dueDate ?? null,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCorrectiveActions.push(action);
  return { data: action };
}

export async function updateCorrectiveAction(id: string, body: Partial<Pick<CorrectiveAction, "title" | "description" | "assignedTo" | "priority" | "dueDate" | "status">>): Promise<{ data: CorrectiveAction }> {
  const idx = mockCorrectiveActions.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Corrective action not found.");
  Object.assign(mockCorrectiveActions[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockCorrectiveActions[idx] };
}

// ── Acknowledgements ───────────────────────────────────

export async function fetchAcknowledgements(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: Acknowledgement[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAcknowledgements];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.employeeName.toLowerCase().includes(q) || a.policyName.toLowerCase().includes(q));
  }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

// ── Training Compliance ────────────────────────────────

export async function fetchTrainingCompliance(filters?: { search?: string; status?: string; skip?: number; take?: number }): Promise<{ data: TrainingCompliance[]; total: number; skip: number; take: number }> {
  let filtered = [...mockTrainingCompliance];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((t) => t.employeeName.toLowerCase().includes(q) || t.trainingModule.toLowerCase().includes(q));
  }
  if (filters?.status) filtered = filtered.filter((t) => t.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  const data = filtered.slice(skip, skip + take);
  return { data, total, skip, take };
}

// ── Dashboard ──────────────────────────────────────────

export async function fetchComplianceDashboard(): Promise<{ data: ComplianceDashboardStats }> {
  const activePolicies = mockPolicies.filter((p) => p.status === "ACTIVE").length;
  const pendingAcknowledgements = mockAcknowledgements.filter((a) => a.status === "PENDING" || a.status === "OVERDUE").length;
  const openViolations = mockViolations.filter((v) => v.status === "OPEN" || v.status === "INVESTIGATING").length;
  const upcomingAudits = mockAudits.filter((a) => a.status === "SCHEDULED").length;
  const overdueRequirements = mockRequirements.filter((r) => r.status === "OVERDUE").length;
  const completed = mockTrainingCompliance.filter((t) => t.status === "COMPLETED").length;
  const trainingComplianceRate = mockTrainingCompliance.length > 0 ? Math.round((completed / mockTrainingCompliance.length) * 100) : 0;

  return {
    data: { activePolicies, pendingAcknowledgements, openViolations, upcomingAudits, overdueRequirements, trainingComplianceRate },
  };
}

// ── Reports ────────────────────────────────────────────

export async function fetchComplianceTrends(): Promise<{ data: ComplianceTrendData[] }> {
  return {
    data: [
      { month: "Jan", complianceScore: 82, violationCount: 5 },
      { month: "Feb", complianceScore: 85, violationCount: 4 },
      { month: "Mar", complianceScore: 80, violationCount: 7 },
      { month: "Apr", complianceScore: 78, violationCount: 8 },
      { month: "May", complianceScore: 83, violationCount: 6 },
      { month: "Jun", complianceScore: 88, violationCount: 3 },
    ],
  };
}

export async function fetchViolationByCategory(): Promise<{ data: ViolationByCategoryData[] }> {
  const map = new Map<string, number>();
  mockViolations.forEach((v) => map.set(v.policyName, (map.get(v.policyName) ?? 0) + 1));
  return { data: Array.from(map.entries()).map(([category, count]) => ({ category, count })) };
}

export async function fetchAuditCompletionData(): Promise<{ data: AuditCompletionData[] }> {
  return {
    data: [
      { quarter: "Q1 2026", total: 3, completed: 2, failed: 0 },
      { quarter: "Q2 2026", total: 3, completed: 1, failed: 1 },
      { quarter: "Q3 2026", total: 4, completed: 0, failed: 0 },
      { quarter: "Q4 2026", total: 2, completed: 0, failed: 0 },
    ],
  };
}

export async function fetchDeptComplianceStats(): Promise<{ data: DeptComplianceData[] }> {
  return {
    data: [
      { department: "Engineering", complianceRate: 85 },
      { department: "Sales", complianceRate: 72 },
      { department: "Marketing", complianceRate: 78 },
      { department: "Finance", complianceRate: 92 },
      { department: "HR", complianceRate: 88 },
      { department: "Operations", complianceRate: 76 },
      { department: "Legal", complianceRate: 95 },
      { department: "Data", complianceRate: 82 },
    ],
  };
}

export async function fetchPolicyAdherenceTrends(): Promise<{ data: PolicyAdherenceTrendData[] }> {
  return {
    data: [
      { month: "Jan", adherenceRate: 74, acknowledgementRate: 68 },
      { month: "Feb", adherenceRate: 76, acknowledgementRate: 70 },
      { month: "Mar", adherenceRate: 72, acknowledgementRate: 65 },
      { month: "Apr", adherenceRate: 78, acknowledgementRate: 72 },
      { month: "May", adherenceRate: 82, acknowledgementRate: 76 },
      { month: "Jun", adherenceRate: 85, acknowledgementRate: 80 },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════
// Employee Engagement & Surveys
// ═══════════════════════════════════════════════════════════════════

export type SurveyStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "ARCHIVED";
export type SurveyType = "EMPLOYEE_SATISFACTION" | "WORKPLACE_CULTURE" | "MANAGER_FEEDBACK" | "EXIT_FEEDBACK" | "TRAINING_FEEDBACK";
export type PulseType = "WEEKLY_CHECKIN" | "MONTHLY_PULSE" | "QUICK_SENTIMENT";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type CampaignScope = "ORGANIZATION" | "DEPARTMENT" | "ANONYMOUS";
export type RecognitionAwardType = "EMPLOYEE_OF_MONTH" | "TEAM_AWARD" | "SPOT_AWARD" | "MILESTONE";
export type SentimentType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type ActionPlanStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  surveyType: SurveyType;
  status: SurveyStatus;
  totalResponses: number;
  targetResponses: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  closedAt: string | null;
}

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string | null;
  surveyType: SurveyType;
  questionCount: number;
  usageCount: number;
}

export interface PulseSurvey {
  id: string;
  title: string;
  pulseType: PulseType;
  status: SurveyStatus;
  totalResponses: number;
  targetResponses: number;
  createdAt: string;
  dueDate: string | null;
}

export interface FeedbackCampaign {
  id: string;
  name: string;
  campaignScope: CampaignScope;
  department: string | null;
  status: CampaignStatus;
  totalFeedbacks: number;
  targetFeedbacks: number;
  createdAt: string;
  updatedAt: string;
}

// ── Rewards & Recognition ───────────────────────────

export interface EmployeeAward {
  id: string;
  employeeId: string;
  awardName: string;
  category: string;
  description: string | null;
  dateAwarded: string;
  awardedBy: string | null;
  status: string;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  createdAt: string;
  updatedAt: string;
}

export interface EngagementRecognitionProgram {
  id: string;
  name: string;
  awardType: RecognitionAwardType;
  description: string | null;
  totalAwards: number;
  isActive: boolean;
}

export interface EmployeeRecognition {
  id: string;
  employeeName: string;
  department: string;
  awardType: RecognitionAwardType;
  awardDate: string;
  recognitionNotes: string | null;
}

export interface EngagementScore {
  department: string;
  score: number;
  previousScore: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface SentimentAnalysis {
  type: SentimentType;
  count: number;
  percentage: number;
  insights: string[];
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string | null;
  owner: string;
  dueDate: string;
  status: ActionPlanStatus;
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  updatedAt: string;
}

export interface RecognitionProgram {
  id: string;
  name: string;
  description: string | null;
  type: string;
  frequency: string;
  eligibilityCriteria: string | null;
  rewardAmount: number | null;
  status: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RewardPointBalance {
  id: string;
  employeeId: string;
  totalPoints: number;
  usedPoints: number;
  availablePoints: number;
  tier: string;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  lastUpdated: string;
}

export interface RewardPointTransaction {
  id: string;
  employeeId: string;
  points: number;
  type: "EARNED" | "REDEEMED" | "EXPIRED" | "ADJUSTED";
  reason: string;
  referenceType: string | null;
  referenceId: string | null;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  createdAt: string;
}

export interface AchievementRecord {
  id: string;
  employeeId: string;
  title: string;
  description: string | null;
  category: string;
  badgeIcon: string | null;
  criteria: string | null;
  unlockDate: string;
  status: string;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  createdAt: string;
  updatedAt: string;
}

export interface EngagementDashboardStats {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  engagementScore: number;
  participationRate: number;
  recognitionCount: number;
}

export interface SurveyReport {
  surveyName: string;
  responses: number;
  completionRate: number;
  avgScore: number;
}

export interface EngagementReport {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

export interface RecognitionReport {
  awardType: string;
  count: number;
}

export interface ParticipationReport {
  department: string;
  eligible: number;
  participated: number;
  rate: number;
}

// ── Mock Data ───────────────────────────────────────────

const mockSurveys: Survey[] = [
  { id: "srv-001", title: "Q2 Employee Satisfaction Survey", description: "Quarterly survey measuring overall employee satisfaction", surveyType: "EMPLOYEE_SATISFACTION", status: "ACTIVE", totalResponses: 142, targetResponses: 250, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z", publishedAt: "2026-04-05T00:00:00Z", closedAt: null },
  { id: "srv-002", title: "Workplace Culture Assessment", description: "Annual assessment of workplace culture and environment", surveyType: "WORKPLACE_CULTURE", status: "ACTIVE", totalResponses: 89, targetResponses: 250, createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z", publishedAt: "2026-03-20T00:00:00Z", closedAt: null },
  { id: "srv-003", title: "Manager Feedback Survey", description: "Feedback on management effectiveness and support", surveyType: "MANAGER_FEEDBACK", status: "DRAFT", totalResponses: 0, targetResponses: 200, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z", publishedAt: null, closedAt: null },
  { id: "srv-004", title: "Exit Interview Questionnaire", description: "Standard exit interview for departing employees", surveyType: "EXIT_FEEDBACK", status: "ACTIVE", totalResponses: 12, targetResponses: 50, createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-10T00:00:00Z", publishedAt: "2026-01-15T00:00:00Z", closedAt: null },
  { id: "srv-005", title: "Training Effectiveness Survey", description: "Post-training feedback to measure effectiveness", surveyType: "TRAINING_FEEDBACK", status: "CLOSED", totalResponses: 198, targetResponses: 200, createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-02-01T00:00:00Z", publishedAt: "2026-02-05T00:00:00Z", closedAt: "2026-03-01T00:00:00Z" },
  { id: "srv-006", title: "Q1 Employee Satisfaction Survey", description: "Quarterly survey for Q1 2026", surveyType: "EMPLOYEE_SATISFACTION", status: "CLOSED", totalResponses: 215, targetResponses: 250, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", publishedAt: "2026-01-05T00:00:00Z", closedAt: "2026-03-31T00:00:00Z" },
  { id: "srv-007", title: "Remote Work Experience Survey", description: "Understanding remote work challenges and preferences", surveyType: "WORKPLACE_CULTURE", status: "CLOSED", totalResponses: 178, targetResponses: 200, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-01T00:00:00Z", publishedAt: "2025-11-05T00:00:00Z", closedAt: "2025-12-15T00:00:00Z" },
  { id: "srv-008", title: "Diversity & Inclusion Survey", description: "Measuring D&I perception across the organization", surveyType: "WORKPLACE_CULTURE", status: "DRAFT", totalResponses: 0, targetResponses: 300, createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z", publishedAt: null, closedAt: null },
];

const mockSurveyTemplates: SurveyTemplate[] = [
  { id: "st-001", name: "Employee Satisfaction Survey", description: "Standard template for measuring employee satisfaction", surveyType: "EMPLOYEE_SATISFACTION", questionCount: 25, usageCount: 12 },
  { id: "st-002", name: "Workplace Culture Assessment", description: "Template for evaluating workplace culture", surveyType: "WORKPLACE_CULTURE", questionCount: 30, usageCount: 8 },
  { id: "st-003", name: "Manager Feedback Form", description: "Template for collecting feedback on managers", surveyType: "MANAGER_FEEDBACK", questionCount: 20, usageCount: 15 },
  { id: "st-004", name: "Exit Interview Template", description: "Standard exit interview questionnaire", surveyType: "EXIT_FEEDBACK", questionCount: 35, usageCount: 45 },
  { id: "st-005", name: "Training Feedback Form", description: "Post-training evaluation template", surveyType: "TRAINING_FEEDBACK", questionCount: 15, usageCount: 28 },
];

const mockPulseSurveys: PulseSurvey[] = [
  { id: "ps-001", title: "Weekly Check-in: Week 22", pulseType: "WEEKLY_CHECKIN", status: "ACTIVE", totalResponses: 98, targetResponses: 250, createdAt: "2026-05-26T00:00:00Z", dueDate: "2026-06-01T00:00:00Z" },
  { id: "ps-002", title: "Monthly Pulse: May 2026", pulseType: "MONTHLY_PULSE", status: "ACTIVE", totalResponses: 156, targetResponses: 250, createdAt: "2026-05-01T00:00:00Z", dueDate: "2026-05-31T00:00:00Z" },
  { id: "ps-003", title: "Office Return Sentiment", pulseType: "QUICK_SENTIMENT", status: "ACTIVE", totalResponses: 45, targetResponses: 250, createdAt: "2026-05-20T00:00:00Z", dueDate: "2026-06-05T00:00:00Z" },
  { id: "ps-004", title: "Weekly Check-in: Week 21", pulseType: "WEEKLY_CHECKIN", status: "CLOSED", totalResponses: 201, targetResponses: 250, createdAt: "2026-05-19T00:00:00Z", dueDate: "2026-05-25T00:00:00Z" },
  { id: "ps-005", title: "Monthly Pulse: April 2026", pulseType: "MONTHLY_PULSE", status: "CLOSED", totalResponses: 218, targetResponses: 250, createdAt: "2026-04-01T00:00:00Z", dueDate: "2026-04-30T00:00:00Z" },
  { id: "ps-006", title: "Weekly Check-in: Week 20", pulseType: "WEEKLY_CHECKIN", status: "CLOSED", totalResponses: 187, targetResponses: 250, createdAt: "2026-05-12T00:00:00Z", dueDate: "2026-05-18T00:00:00Z" },
];

const mockFeedbackCampaigns: FeedbackCampaign[] = [
  { id: "fc-001", name: "Annual Organization Feedback", campaignScope: "ORGANIZATION", department: null, status: "ACTIVE", totalFeedbacks: 345, targetFeedbacks: 500, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "fc-002", name: "Engineering Department Review", campaignScope: "DEPARTMENT", department: "Engineering", status: "ACTIVE", totalFeedbacks: 56, targetFeedbacks: 80, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "fc-003", name: "Anonymous Leadership Feedback", campaignScope: "ANONYMOUS", department: null, status: "DRAFT", totalFeedbacks: 0, targetFeedbacks: 200, createdAt: "2026-05-15T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "fc-004", name: "Q1 Organization Feedback", campaignScope: "ORGANIZATION", department: null, status: "COMPLETED", totalFeedbacks: 423, targetFeedbacks: 500, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "fc-005", name: "Sales Team Performance Feedback", campaignScope: "DEPARTMENT", department: "Sales", status: "COMPLETED", totalFeedbacks: 34, targetFeedbacks: 40, createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
];

const mockRecognitionPrograms: EngagementRecognitionProgram[] = [
  { id: "rp-001", name: "Employee of the Month", awardType: "EMPLOYEE_OF_MONTH", description: "Monthly award recognizing outstanding employee contributions", totalAwards: 18, isActive: true },
  { id: "rp-002", name: "Team Excellence Award", awardType: "TEAM_AWARD", description: "Quarterly award for exceptional team performance", totalAwards: 8, isActive: true },
  { id: "rp-003", name: "Spot Award Program", awardType: "SPOT_AWARD", description: "On-the-spot recognition for going above and beyond", totalAwards: 45, isActive: true },
  { id: "rp-004", name: "Service Milestone Recognition", awardType: "MILESTONE", description: "Recognizing work anniversaries and service milestones", totalAwards: 62, isActive: true },
];

const mockEmployeeRecognitions: EmployeeRecognition[] = [
  { id: "er-001", employeeName: "Alice Johnson", department: "Engineering", awardType: "EMPLOYEE_OF_MONTH", awardDate: "2026-05-01T00:00:00Z", recognitionNotes: "Outstanding contribution to platform architecture redesign" },
  { id: "er-002", employeeName: "Bob Smith", department: "Sales", awardType: "SPOT_AWARD", awardDate: "2026-05-15T00:00:00Z", recognitionNotes: "Closed the largest deal of Q2" },
  { id: "er-003", employeeName: "Carol Davis", department: "Marketing", awardType: "TEAM_AWARD", awardDate: "2026-04-20T00:00:00Z", recognitionNotes: "Led successful product launch campaign" },
  { id: "er-004", employeeName: "Dan Wilson", department: "Engineering", awardType: "MILESTONE", awardDate: "2026-05-10T00:00:00Z", recognitionNotes: "5-year work anniversary celebrated" },
  { id: "er-005", employeeName: "Eve Martinez", department: "HR", awardType: "EMPLOYEE_OF_MONTH", awardDate: "2026-04-01T00:00:00Z", recognitionNotes: "Excellence in employee relations management" },
  { id: "er-006", employeeName: "Frank Lee", department: "Finance", awardType: "SPOT_AWARD", awardDate: "2026-05-05T00:00:00Z", recognitionNotes: "Identified cost-saving opportunity of $50K annually" },
  { id: "er-007", employeeName: "Grace Kim", department: "Engineering", awardType: "TEAM_AWARD", awardDate: "2026-03-15T00:00:00Z", recognitionNotes: "Shipped critical security update ahead of schedule" },
  { id: "er-008", employeeName: "Henry Brown", department: "Operations", awardType: "MILESTONE", awardDate: "2026-05-20T00:00:00Z", recognitionNotes: "10-year service milestone" },
];

const mockEngagementScores: EngagementScore[] = [
  { department: "Engineering", score: 78, previousScore: 75, trend: "UP" },
  { department: "Sales", score: 72, previousScore: 74, trend: "DOWN" },
  { department: "Marketing", score: 81, previousScore: 79, trend: "UP" },
  { department: "Finance", score: 85, previousScore: 83, trend: "UP" },
  { department: "HR", score: 79, previousScore: 80, trend: "DOWN" },
  { department: "Operations", score: 74, previousScore: 72, trend: "UP" },
  { department: "Legal", score: 88, previousScore: 88, trend: "STABLE" },
  { department: "Data", score: 76, previousScore: 77, trend: "DOWN" },
];

const mockSentiments: SentimentAnalysis[] = [
  { type: "POSITIVE", count: 312, percentage: 52, insights: ["Strong team collaboration", "Good work-life balance", "Career growth opportunities valued"] },
  { type: "NEUTRAL", count: 168, percentage: 28, insights: ["Compensation expectations vary", "Hybrid work preferences differ", "Process improvements requested"] },
  { type: "NEGATIVE", count: 120, percentage: 20, insights: ["Communication gaps in cross-team projects", "Tooling and infrastructure concerns", "Workload distribution needs attention"] },
];

const mockActionPlans: ActionPlan[] = [
  { id: "ap-001", title: "Improve Cross-Team Communication", description: "Implement weekly cross-team sync meetings and shared documentation", owner: "Sarah Chen", dueDate: "2026-07-15T00:00:00Z", status: "IN_PROGRESS", priority: "HIGH", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "ap-002", title: "Enhance Recognition Program", description: "Expand spot award program and increase visibility of recognitions", owner: "Mike Johnson", dueDate: "2026-06-30T00:00:00Z", status: "OPEN", priority: "MEDIUM", createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
  { id: "ap-003", title: "Address Workload Distribution", description: "Review team capacity and redistribute tasks across departments", owner: "Lisa Wang", dueDate: "2026-06-15T00:00:00Z", status: "IN_PROGRESS", priority: "HIGH", createdAt: "2026-05-05T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
  { id: "ap-004", title: "Update Compensation Framework", description: "Review and adjust compensation bands based on feedback", owner: "Tom Martinez", dueDate: "2026-08-01T00:00:00Z", status: "OPEN", priority: "HIGH", createdAt: "2026-05-12T00:00:00Z", updatedAt: "2026-05-12T00:00:00Z" },
  { id: "ap-005", title: "Improve Onboarding Experience", description: "Revamp new hire onboarding based on survey feedback", owner: "HR Team", dueDate: "2026-07-01T00:00:00Z", status: "COMPLETED", priority: "MEDIUM", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
  { id: "ap-006", title: "Tooling Infrastructure Upgrade", description: "Address tooling concerns raised in sentiment analysis", owner: "IT Operations", dueDate: "2026-09-01T00:00:00Z", status: "OPEN", priority: "LOW", createdAt: "2026-05-15T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
];

// ── Dashboard ──────────────────────────────────────────

export async function fetchEngagementDashboard(): Promise<{ data: EngagementDashboardStats }> {
  const totalSurveys = mockSurveys.length;
  const activeSurveys = mockSurveys.filter((s) => s.status === "ACTIVE").length;
  const totalResponses = mockSurveys.reduce((sum, s) => sum + s.totalResponses, 0);
  const avgScore = mockEngagementScores.reduce((sum, d) => sum + d.score, 0) / mockEngagementScores.length;
  const participationRate = mockSurveys.length > 0 ? Math.round((mockSurveys.reduce((sum, s) => sum + s.totalResponses, 0) / mockSurveys.reduce((sum, s) => sum + s.targetResponses, 0)) * 100) : 0;
  const recognitionCount = mockEmployeeRecognitions.length;

  return {
    data: { totalSurveys, activeSurveys, totalResponses, engagementScore: Math.round(avgScore), participationRate, recognitionCount },
  };
}

// ── Surveys ────────────────────────────────────────────

export async function fetchSurveys(filters?: { search?: string; status?: string; surveyType?: string; skip?: number; take?: number }): Promise<{ data: Survey[]; total: number; skip: number; take: number }> {
  let filtered = [...mockSurveys];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((s) => s.title.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))); }
  if (filters?.status) filtered = filtered.filter((s) => s.status === filters.status);
  if (filters?.surveyType) filtered = filtered.filter((s) => s.surveyType === filters.surveyType);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createSurvey(body: { title: string; description?: string; surveyType: string; targetResponses?: number }): Promise<{ data: Survey }> {
  const survey: Survey = {
    id: `srv-${String(mockSurveys.length + 1).padStart(3, "0")}`,
    title: body.title,
    description: body.description ?? null,
    surveyType: body.surveyType as SurveyType,
    status: "DRAFT",
    totalResponses: 0,
    targetResponses: body.targetResponses ?? 250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: null,
    closedAt: null,
  };
  mockSurveys.push(survey);
  return { data: survey };
}

export async function updateSurvey(id: string, body: Partial<Pick<Survey, "title" | "description" | "surveyType" | "status" | "targetResponses">>): Promise<{ data: Survey }> {
  const idx = mockSurveys.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Survey not found.");
  const now = new Date().toISOString();
  if (body.status === "ACTIVE") mockSurveys[idx].publishedAt = now;
  if (body.status === "CLOSED") mockSurveys[idx].closedAt = now;
  Object.assign(mockSurveys[idx], body, { updatedAt: now });
  return { data: mockSurveys[idx] };
}

// ── Survey Templates ───────────────────────────────────

export async function fetchSurveyTemplates(filters?: { search?: string; surveyType?: string; skip?: number; take?: number }): Promise<{ data: SurveyTemplate[]; total: number; skip: number; take: number }> {
  let filtered = [...mockSurveyTemplates];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))); }
  if (filters?.surveyType) filtered = filtered.filter((t) => t.surveyType === filters.surveyType);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

// ── Pulse Surveys ──────────────────────────────────────

export async function fetchPulseSurveys(filters?: { search?: string; status?: string; pulseType?: string; skip?: number; take?: number }): Promise<{ data: PulseSurvey[]; total: number; skip: number; take: number }> {
  let filtered = [...mockPulseSurveys];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((p) => p.title.toLowerCase().includes(q)); }
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  if (filters?.pulseType) filtered = filtered.filter((p) => p.pulseType === filters.pulseType);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createPulseSurvey(body: { title: string; pulseType: string; targetResponses?: number; dueDate?: string }): Promise<{ data: PulseSurvey }> {
  const ps: PulseSurvey = {
    id: `ps-${String(mockPulseSurveys.length + 1).padStart(3, "0")}`,
    title: body.title,
    pulseType: body.pulseType as PulseType,
    status: "ACTIVE",
    totalResponses: 0,
    targetResponses: body.targetResponses ?? 250,
    createdAt: new Date().toISOString(),
    dueDate: body.dueDate ?? null,
  };
  mockPulseSurveys.push(ps);
  return { data: ps };
}

export async function updatePulseSurveyStatus(id: string, status: SurveyStatus): Promise<{ data: PulseSurvey }> {
  const idx = mockPulseSurveys.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Pulse survey not found.");
  mockPulseSurveys[idx].status = status;
  return { data: mockPulseSurveys[idx] };
}

// ── Feedback Campaigns ─────────────────────────────────

export async function fetchFeedbackCampaigns(filters?: { search?: string; status?: string; campaignScope?: string; skip?: number; take?: number }): Promise<{ data: FeedbackCampaign[]; total: number; skip: number; take: number }> {
  let filtered = [...mockFeedbackCampaigns];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(q)); }
  if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
  if (filters?.campaignScope) filtered = filtered.filter((c) => c.campaignScope === filters.campaignScope);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createFeedbackCampaign(body: { name: string; campaignScope: string; department?: string; targetFeedbacks?: number }): Promise<{ data: FeedbackCampaign }> {
  const fc: FeedbackCampaign = {
    id: `fc-${String(mockFeedbackCampaigns.length + 1).padStart(3, "0")}`,
    name: body.name,
    campaignScope: body.campaignScope as CampaignScope,
    department: body.department ?? null,
    status: "DRAFT",
    totalFeedbacks: 0,
    targetFeedbacks: body.targetFeedbacks ?? 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockFeedbackCampaigns.push(fc);
  return { data: fc };
}

export async function updateFeedbackCampaignStatus(id: string, status: CampaignStatus): Promise<{ data: FeedbackCampaign }> {
  const idx = mockFeedbackCampaigns.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Campaign not found.");
  mockFeedbackCampaigns[idx].status = status;
  mockFeedbackCampaigns[idx].updatedAt = new Date().toISOString();
  return { data: mockFeedbackCampaigns[idx] };
}

// ── Recognition Programs ───────────────────────────────

export async function fetchEngagementRecognitionPrograms(): Promise<{ data: EngagementRecognitionProgram[] }> {
  return { data: [...mockRecognitionPrograms] };
}

// ── Employee Recognition ───────────────────────────────

export async function fetchEmployeeRecognitions(filters?: { search?: string; awardType?: string; department?: string; skip?: number; take?: number }): Promise<{ data: EmployeeRecognition[]; total: number; skip: number; take: number }> {
  let filtered = [...mockEmployeeRecognitions];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((r) => r.employeeName.toLowerCase().includes(q)); }
  if (filters?.awardType) filtered = filtered.filter((r) => r.awardType === filters.awardType);
  if (filters?.department) filtered = filtered.filter((r) => r.department === filters.department);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createEmployeeRecognition(body: { employeeName: string; department: string; awardType: string; recognitionNotes?: string }): Promise<{ data: EmployeeRecognition }> {
  const rec: EmployeeRecognition = {
    id: `er-${String(mockEmployeeRecognitions.length + 1).padStart(3, "0")}`,
    employeeName: body.employeeName,
    department: body.department,
    awardType: body.awardType as RecognitionAwardType,
    awardDate: new Date().toISOString(),
    recognitionNotes: body.recognitionNotes ?? null,
  };
  mockEmployeeRecognitions.push(rec);
  return { data: rec };
}

// ── Engagement Scores ──────────────────────────────────

export async function fetchEngagementScores(): Promise<{ data: EngagementScore[] }> {
  return { data: [...mockEngagementScores] };
}

// ── Sentiment Analysis ─────────────────────────────────

export async function fetchSentimentAnalysis(): Promise<{ data: SentimentAnalysis[] }> {
  return { data: [...mockSentiments] };
}

// ── Action Plans ───────────────────────────────────────

export async function fetchActionPlans(filters?: { search?: string; status?: string; priority?: string; skip?: number; take?: number }): Promise<{ data: ActionPlan[]; total: number; skip: number; take: number }> {
  let filtered = [...mockActionPlans];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((a) => a.title.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q)); }
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  if (filters?.priority) filtered = filtered.filter((a) => a.priority === filters.priority);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createActionPlan(body: { title: string; description?: string; owner: string; dueDate: string; priority?: string }): Promise<{ data: ActionPlan }> {
  const ap: ActionPlan = {
    id: `ap-${String(mockActionPlans.length + 1).padStart(3, "0")}`,
    title: body.title,
    description: body.description ?? null,
    owner: body.owner,
    dueDate: body.dueDate,
    status: "OPEN",
    priority: (body.priority ?? "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockActionPlans.push(ap);
  return { data: ap };
}

export async function updateActionPlan(id: string, body: Partial<Pick<ActionPlan, "title" | "description" | "owner" | "dueDate" | "status" | "priority">>): Promise<{ data: ActionPlan }> {
  const idx = mockActionPlans.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Action plan not found.");
  Object.assign(mockActionPlans[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockActionPlans[idx] };
}

// ── Reports ────────────────────────────────────────────

export async function fetchSurveyReports(): Promise<{ data: SurveyReport[] }> {
  return {
    data: [
      { surveyName: "Q2 Employee Satisfaction", responses: 142, completionRate: 57, avgScore: 78 },
      { surveyName: "Workplace Culture Assessment", responses: 89, completionRate: 36, avgScore: 72 },
      { surveyName: "Manager Feedback Survey", responses: 0, completionRate: 0, avgScore: 0 },
      { surveyName: "Exit Interview Questionnaire", responses: 12, completionRate: 24, avgScore: 65 },
      { surveyName: "Training Effectiveness Survey", responses: 198, completionRate: 99, avgScore: 84 },
    ],
  };
}

export async function fetchEngagementReports(): Promise<{ data: EngagementReport[] }> {
  return {
    data: [
      { metric: "Overall Engagement Score", current: 79, previous: 78, change: 1.3 },
      { metric: "Participation Rate", current: 68, previous: 72, change: -4 },
      { metric: "Average Sentiment Score", current: 76, previous: 74, change: 2 },
      { metric: "Recognition Rate", current: 85, previous: 80, change: 5 },
    ],
  };
}

export async function fetchRecognitionReports(): Promise<{ data: RecognitionReport[] }> {
  return {
    data: [
      { awardType: "Employee of the Month", count: 18 },
      { awardType: "Team Award", count: 8 },
      { awardType: "Spot Award", count: 45 },
      { awardType: "Milestone", count: 62 },
    ],
  };
}

export async function fetchParticipationReports(): Promise<{ data: ParticipationReport[] }> {
  return {
    data: [
      { department: "Engineering", eligible: 85, participated: 62, rate: 73 },
      { department: "Sales", eligible: 42, participated: 28, rate: 67 },
      { department: "Marketing", eligible: 28, participated: 22, rate: 79 },
      { department: "Finance", eligible: 18, participated: 15, rate: 83 },
      { department: "HR", eligible: 15, participated: 12, rate: 80 },
      { department: "Operations", eligible: 35, participated: 24, rate: 69 },
      { department: "Legal", eligible: 10, participated: 9, rate: 90 },
      { department: "Data", eligible: 22, participated: 16, rate: 73 },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════
// Workforce Planning
// ═══════════════════════════════════════════════════════════════════

export type WfPlanStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type WfPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type WfReadinessLevel = "READY_NOW" | "READY_1_2_YEARS" | "READY_3_5_YEARS" | "DEVELOPMENT_NEEDED";
export type WfRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type WfScenarioType = "GROWTH" | "STABLE" | "COST_REDUCTION" | "EXPANSION";
export type WfForecastPeriod = "QUARTERLY" | "BI_ANNUAL" | "ANNUAL";

export interface WFDashboardStats {
  currentHeadcount: number;
  plannedHeadcount: number;
  openPositions: number;
  criticalSkillGaps: number;
  successorCoverage: number;
  workforceBudget: number;
  forecastAccuracy: number;
  capacityUtilization: number;
}

export interface WFHeadcountPlan {
  id: string;
  department: string;
  currentHeadcount: number;
  plannedHeadcount: number;
  variance: number;
  targetDate: string;
  status: WfPlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WFWorkforceForecast {
  id: string;
  department: string;
  currentEmployees: number;
  predictedAttrition: number;
  predictedHiring: number;
  forecastedWorkforce: number;
  forecastPeriod: string;
  createdAt: string;
}

export interface WFHiringPlan {
  id: string;
  position: string;
  department: string;
  requiredHeadcount: number;
  priority: WfPriority;
  budget: number;
  hiringWindow: string;
  status: WfPlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WFCapacityPlan {
  id: string;
  department: string;
  availableCapacity: number;
  requiredCapacity: number;
  utilization: number;
  gap: number;
  createdAt: string;
}

export interface WFSkillGap {
  id: string;
  department: string;
  currentSkills: string[];
  requiredSkills: string[];
  skillGap: string[];
  priority: WfPriority;
  recommendedTraining: string;
  createdAt: string;
}

export interface WFSuccessionPlan {
  id: string;
  criticalRole: string;
  currentEmployee: string;
  potentialSuccessor: string;
  readinessLevel: WfReadinessLevel;
  developmentPlan: string;
  riskLevel: WfRiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface WFBudgetPlan {
  id: string;
  department: string;
  currentBudget: number;
  forecastBudget: number;
  hiringCost: number;
  trainingCost: number;
  variance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WFScenarioPlan {
  id: string;
  name: string;
  scenarioType: WfScenarioType;
  description: string;
  projectedHeadcount: number;
  projectedBudget: number;
  assumptions: string[];
  createdAt: string;
}

export interface WFHeadcountReport {
  department: string;
  current: number;
  planned: number;
  filled: number;
  variance: number;
}

export interface WFForecastReport {
  period: string;
  currentWorkforce: number;
  forecastedWorkforce: number;
  attrition: number;
  hiring: number;
}

export interface WFHiringReport {
  department: string;
  positions: number;
  filled: number;
  inProgress: number;
  cost: number;
}

export interface WFSkillGapReport {
  department: string;
  totalGaps: number;
  criticalGaps: number;
  highPriorityGaps: number;
}

export interface WFSuccessionReport {
  role: string;
  currentEmployee: string;
  successor: string;
  readiness: string;
  risk: string;
}

export interface WFBudgetReport {
  department: string;
  currentBudget: number;
  forecastBudget: number;
  hiringCost: number;
  trainingCost: number;
}

// ── Mock Data ───────────────────────────────────────────

const mockHeadcountPlans: WFHeadcountPlan[] = [
  { id: "hcp-001", department: "Engineering", currentHeadcount: 85, plannedHeadcount: 110, variance: 25, targetDate: "2026-12-31", status: "ACTIVE", createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "hcp-002", department: "Sales", currentHeadcount: 42, plannedHeadcount: 55, variance: 13, targetDate: "2026-09-30", status: "ACTIVE", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "hcp-003", department: "Marketing", currentHeadcount: 28, plannedHeadcount: 35, variance: 7, targetDate: "2026-12-31", status: "DRAFT", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
  { id: "hcp-004", department: "Finance", currentHeadcount: 18, plannedHeadcount: 20, variance: 2, targetDate: "2026-06-30", status: "COMPLETED", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-06-15T00:00:00Z" },
  { id: "hcp-005", department: "HR", currentHeadcount: 15, plannedHeadcount: 18, variance: 3, targetDate: "2026-09-30", status: "ACTIVE", createdAt: "2026-02-15T00:00:00Z", updatedAt: "2026-04-20T00:00:00Z" },
  { id: "hcp-006", department: "Operations", currentHeadcount: 35, plannedHeadcount: 40, variance: 5, targetDate: "2026-12-31", status: "ACTIVE", createdAt: "2026-03-10T00:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
  { id: "hcp-007", department: "Legal", currentHeadcount: 10, plannedHeadcount: 12, variance: 2, targetDate: "2026-06-30", status: "COMPLETED", createdAt: "2026-01-05T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "hcp-008", department: "Data", currentHeadcount: 22, plannedHeadcount: 30, variance: 8, targetDate: "2027-03-31", status: "DRAFT", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
];

const mockWorkforceForecasts: WFWorkforceForecast[] = [
  { id: "wff-001", department: "Engineering", currentEmployees: 85, predictedAttrition: 8, predictedHiring: 25, forecastedWorkforce: 102, forecastPeriod: "ANNUAL", createdAt: "2026-01-01T00:00:00Z" },
  { id: "wff-002", department: "Sales", currentEmployees: 42, predictedAttrition: 6, predictedHiring: 15, forecastedWorkforce: 51, forecastPeriod: "ANNUAL", createdAt: "2026-01-01T00:00:00Z" },
  { id: "wff-003", department: "Marketing", currentEmployees: 28, predictedAttrition: 3, predictedHiring: 8, forecastedWorkforce: 33, forecastPeriod: "QUARTERLY", createdAt: "2026-04-01T00:00:00Z" },
  { id: "wff-004", department: "Finance", currentEmployees: 18, predictedAttrition: 2, predictedHiring: 4, forecastedWorkforce: 20, forecastPeriod: "BI_ANNUAL", createdAt: "2026-01-01T00:00:00Z" },
  { id: "wff-005", department: "HR", currentEmployees: 15, predictedAttrition: 2, predictedHiring: 5, forecastedWorkforce: 18, forecastPeriod: "ANNUAL", createdAt: "2026-01-01T00:00:00Z" },
  { id: "wff-006", department: "Operations", currentEmployees: 35, predictedAttrition: 4, predictedHiring: 8, forecastedWorkforce: 39, forecastPeriod: "QUARTERLY", createdAt: "2026-04-01T00:00:00Z" },
];

const mockHiringPlans: WFHiringPlan[] = [
  { id: "hp-001", position: "Senior Software Engineer", department: "Engineering", requiredHeadcount: 5, priority: "CRITICAL", budget: 750000, hiringWindow: "Q3 2026", status: "ACTIVE", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "hp-002", position: "Data Scientist", department: "Data", requiredHeadcount: 3, priority: "HIGH", budget: 450000, hiringWindow: "Q3 2026", status: "ACTIVE", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
  { id: "hp-003", position: "Sales Representative", department: "Sales", requiredHeadcount: 8, priority: "HIGH", budget: 560000, hiringWindow: "Q4 2026", status: "DRAFT", createdAt: "2026-06-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "hp-004", position: "Marketing Manager", department: "Marketing", requiredHeadcount: 2, priority: "MEDIUM", budget: 220000, hiringWindow: "Q1 2027", status: "DRAFT", createdAt: "2026-05-15T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "hp-005", position: "HR Business Partner", department: "HR", requiredHeadcount: 2, priority: "MEDIUM", budget: 180000, hiringWindow: "Q4 2026", status: "ACTIVE", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
  { id: "hp-006", position: "Operations Analyst", department: "Operations", requiredHeadcount: 3, priority: "LOW", budget: 195000, hiringWindow: "Q1 2027", status: "ACTIVE", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "hp-007", position: "Financial Analyst", department: "Finance", requiredHeadcount: 2, priority: "MEDIUM", budget: 160000, hiringWindow: "Q3 2026", status: "COMPLETED", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "hp-008", position: "DevOps Engineer", department: "Engineering", requiredHeadcount: 4, priority: "CRITICAL", budget: 520000, hiringWindow: "Q3 2026", status: "ACTIVE", createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z" },
];

const mockCapacityPlans: WFCapacityPlan[] = [
  { id: "cp-001", department: "Engineering", availableCapacity: 85, requiredCapacity: 110, utilization: 77, gap: 25, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-002", department: "Sales", availableCapacity: 42, requiredCapacity: 55, utilization: 76, gap: 13, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-003", department: "Marketing", availableCapacity: 28, requiredCapacity: 35, utilization: 80, gap: 7, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-004", department: "Finance", availableCapacity: 18, requiredCapacity: 20, utilization: 90, gap: 2, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-005", department: "HR", availableCapacity: 15, requiredCapacity: 18, utilization: 83, gap: 3, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-006", department: "Operations", availableCapacity: 35, requiredCapacity: 42, utilization: 83, gap: 7, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-007", department: "Legal", availableCapacity: 10, requiredCapacity: 12, utilization: 83, gap: 2, createdAt: "2026-06-01T00:00:00Z" },
  { id: "cp-008", department: "Data", availableCapacity: 22, requiredCapacity: 30, utilization: 73, gap: 8, createdAt: "2026-06-01T00:00:00Z" },
];

const mockSkillGaps: WFSkillGap[] = [
  { id: "sg-001", department: "Engineering", currentSkills: ["JavaScript", "Python", "Java"], requiredSkills: ["Kubernetes", "Machine Learning", "Go", "Rust"], skillGap: ["Kubernetes", "Machine Learning", "Go", "Rust"], priority: "CRITICAL", recommendedTraining: "Cloud Native Certification; ML Engineering Bootcamp", createdAt: "2026-05-01T00:00:00Z" },
  { id: "sg-002", department: "Data", currentSkills: ["SQL", "Python", "Tableau"], requiredSkills: ["TensorFlow", "Spark", "Data Engineering", "MLOps"], skillGap: ["TensorFlow", "Spark", "MLOps"], priority: "HIGH", recommendedTraining: "Advanced ML Engineering; Data Engineering with Spark", createdAt: "2026-05-01T00:00:00Z" },
  { id: "sg-003", department: "Sales", currentSkills: ["CRM", "Negotiation", "Pipeline Management"], requiredSkills: ["Account Planning", "Solution Selling", "Data Analytics"], skillGap: ["Data Analytics", "Solution Selling"], priority: "MEDIUM", recommendedTraining: "Solution Selling Methodology; Sales Analytics", createdAt: "2026-05-01T00:00:00Z" },
  { id: "sg-004", department: "Marketing", currentSkills: ["Content Marketing", "Social Media", "SEO"], requiredSkills: ["Marketing Automation", "ABM", "Analytics", "CRM"], skillGap: ["Marketing Automation", "ABM"], priority: "MEDIUM", recommendedTraining: "Marketing Automation Platform Cert; ABM Strategy", createdAt: "2026-05-01T00:00:00Z" },
  { id: "sg-005", department: "Finance", currentSkills: ["Accounting", "Financial Reporting", "Excel"], requiredSkills: ["FP&A", "ERP Systems", "Data Analytics", "Risk Management"], skillGap: ["FP&A", "ERP Systems", "Data Analytics"], priority: "HIGH", recommendedTraining: "Financial Planning & Analysis; ERP Implementation Training", createdAt: "2026-05-01T00:00:00Z" },
  { id: "sg-006", department: "Operations", currentSkills: ["Project Management", "Process Improvement"], requiredSkills: ["Supply Chain Management", "Lean Six Sigma", "ERP Systems", "Data Analytics"], skillGap: ["Supply Chain Management", "ERP Systems", "Data Analytics"], priority: "HIGH", recommendedTraining: "Supply Chain Management Cert; Lean Six Sigma Green Belt", createdAt: "2026-05-01T00:00:00Z" },
];

const mockSuccessionPlans: WFSuccessionPlan[] = [
  { id: "sp-001", criticalRole: "CTO", currentEmployee: "Alice Chen", potentialSuccessor: "Bob Kumar", readinessLevel: "READY_1_2_YEARS", developmentPlan: "Executive Leadership Program; Board Presentation Training", riskLevel: "MEDIUM", createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
  { id: "sp-002", criticalRole: "VP of Engineering", currentEmployee: "Bob Kumar", potentialSuccessor: "Carol Davis", readinessLevel: "READY_3_5_YEARS", developmentPlan: "Engineering Leadership; Strategic Planning", riskLevel: "HIGH", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-04-15T00:00:00Z" },
  { id: "sp-003", criticalRole: "Head of Sales", currentEmployee: "David Park", potentialSuccessor: "Eva Martinez", readinessLevel: "READY_NOW", developmentPlan: "Senior Account Management; Executive Coaching", riskLevel: "LOW", createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
  { id: "sp-004", criticalRole: "CFO", currentEmployee: "Frank Williams", potentialSuccessor: "Grace Lee", readinessLevel: "READY_1_2_YEARS", developmentPlan: "Strategic Financial Management; Board Prep", riskLevel: "MEDIUM", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "sp-005", criticalRole: "Head of Marketing", currentEmployee: "Helen Taylor", potentialSuccessor: "Ian Brown", readinessLevel: "DEVELOPMENT_NEEDED", developmentPlan: "Marketing Leadership; Brand Strategy Certification", riskLevel: "HIGH", createdAt: "2026-02-15T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
  { id: "sp-006", criticalRole: "VP of HR", currentEmployee: "Jane Wilson", potentialSuccessor: "Kevin Zhang", readinessLevel: "READY_1_2_YEARS", developmentPlan: "HR Executive Program; Change Management Cert", riskLevel: "MEDIUM", createdAt: "2026-01-20T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
];

const mockBudgetPlans: WFBudgetPlan[] = [
  { id: "bp-001", department: "Engineering", currentBudget: 12500000, forecastBudget: 14500000, hiringCost: 3500000, trainingCost: 500000, variance: 2000000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "bp-002", department: "Sales", currentBudget: 5800000, forecastBudget: 6500000, hiringCost: 1800000, trainingCost: 300000, variance: 700000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "bp-003", department: "Marketing", currentBudget: 3200000, forecastBudget: 3800000, hiringCost: 800000, trainingCost: 200000, variance: 600000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-04-20T00:00:00Z" },
  { id: "bp-004", department: "Finance", currentBudget: 2100000, forecastBudget: 2300000, hiringCost: 400000, trainingCost: 150000, variance: 200000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-10T00:00:00Z" },
  { id: "bp-005", department: "HR", currentBudget: 1800000, forecastBudget: 2100000, hiringCost: 500000, trainingCost: 250000, variance: 300000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "bp-006", department: "Operations", currentBudget: 4200000, forecastBudget: 4800000, hiringCost: 1000000, trainingCost: 350000, variance: 600000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z" },
  { id: "bp-007", department: "Legal", currentBudget: 1500000, forecastBudget: 1600000, hiringCost: 200000, trainingCost: 80000, variance: 100000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-02-15T00:00:00Z" },
  { id: "bp-008", department: "Data", currentBudget: 3500000, forecastBudget: 4500000, hiringCost: 1500000, trainingCost: 400000, variance: 1000000, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
];

const mockScenarioPlans: WFScenarioPlan[] = [
  { id: "sc-001", name: "Aggressive Growth", scenarioType: "GROWTH", description: "Expand workforce by 30% to capture market share with new product lines.", projectedHeadcount: 420, projectedBudget: 52000000, assumptions: ["New funding secured", "Market expansion", "Hiring freeze lifted"], createdAt: "2026-01-15T00:00:00Z" },
  { id: "sc-002", name: "Steady State", scenarioType: "STABLE", description: "Maintain current workforce levels with strategic replacements only.", projectedHeadcount: 320, projectedBudget: 38000000, assumptions: ["Stable revenue growth", "Attrition replacement only", "No new initiatives"], createdAt: "2026-01-15T00:00:00Z" },
  { id: "sc-003", name: "Cost Optimization", scenarioType: "COST_REDUCTION", description: "Reduce workforce costs by 15% through attrition management and restructuring.", projectedHeadcount: 275, projectedBudget: 32000000, assumptions: ["Market downturn", "Budget cuts", "Attrition not replaced"], createdAt: "2026-01-15T00:00:00Z" },
  { id: "sc-004", name: "Global Expansion", scenarioType: "EXPANSION", description: "Enter new geographic markets with dedicated regional teams.", projectedHeadcount: 380, projectedBudget: 48000000, assumptions: ["New market entry", "Regional hiring", "Infrastructure investment"], createdAt: "2026-01-15T00:00:00Z" },
];

// ── Dashboard ───────────────────────────────────────────

export async function fetchWFDashboard(): Promise<{ data: WFDashboardStats }> {
  const totalCurrent = mockHeadcountPlans.reduce((s, h) => s + h.currentHeadcount, 0);
  const totalPlanned = mockHeadcountPlans.reduce((s, h) => s + h.plannedHeadcount, 0);
  const openPositions = mockHiringPlans.filter((h) => h.status === "ACTIVE").reduce((s, h) => s + h.requiredHeadcount, 0);
  const criticalGaps = mockSkillGaps.filter((g) => g.priority === "CRITICAL").length;
  const totalSuccessors = mockSuccessionPlans.length;
  const readyNow = mockSuccessionPlans.filter((s) => s.readinessLevel === "READY_NOW" || s.readinessLevel === "READY_1_2_YEARS").length;
  const totalBudget = mockBudgetPlans.reduce((s, b) => s + b.forecastBudget, 0);
  const totalCapacity = mockCapacityPlans.reduce((s, c) => s + c.availableCapacity, 0);
  const totalRequired = mockCapacityPlans.reduce((s, c) => s + c.requiredCapacity, 0);

  return {
    data: {
      currentHeadcount: totalCurrent,
      plannedHeadcount: totalPlanned,
      openPositions,
      criticalSkillGaps: criticalGaps,
      successorCoverage: totalSuccessors > 0 ? Math.round((readyNow / totalSuccessors) * 100) : 0,
      workforceBudget: totalBudget,
      forecastAccuracy: 84,
      capacityUtilization: totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0,
    },
  };
}

// ── Headcount Planning ──────────────────────────────────

export async function fetchWFHeadcountPlans(filters?: { search?: string; status?: string; department?: string; skip?: number; take?: number }): Promise<{ data: WFHeadcountPlan[]; total: number; skip: number; take: number }> {
  let filtered = [...mockHeadcountPlans];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((h) => h.department.toLowerCase().includes(q)); }
  if (filters?.status) filtered = filtered.filter((h) => h.status === filters.status);
  if (filters?.department) filtered = filtered.filter((h) => h.department === filters.department);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createWFHeadcountPlan(body: { department: string; currentHeadcount: number; plannedHeadcount: number; targetDate: string }): Promise<{ data: WFHeadcountPlan }> {
  const plan: WFHeadcountPlan = {
    id: `hcp-${String(mockHeadcountPlans.length + 1).padStart(3, "0")}`,
    department: body.department,
    currentHeadcount: body.currentHeadcount,
    plannedHeadcount: body.plannedHeadcount,
    variance: body.plannedHeadcount - body.currentHeadcount,
    targetDate: body.targetDate,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockHeadcountPlans.push(plan);
  return { data: plan };
}

export async function updateWFHeadcountPlan(id: string, body: Partial<Pick<WFHeadcountPlan, "department" | "currentHeadcount" | "plannedHeadcount" | "targetDate" | "status">>): Promise<{ data: WFHeadcountPlan }> {
  const idx = mockHeadcountPlans.findIndex((h) => h.id === id);
  if (idx === -1) throw new Error("Headcount plan not found.");
  Object.assign(mockHeadcountPlans[idx], body, { updatedAt: new Date().toISOString() });
  if (body.currentHeadcount !== undefined || body.plannedHeadcount !== undefined) {
    mockHeadcountPlans[idx].variance = mockHeadcountPlans[idx].plannedHeadcount - mockHeadcountPlans[idx].currentHeadcount;
  }
  return { data: mockHeadcountPlans[idx] };
}

// ── Workforce Forecasting ──────────────────────────────

export async function fetchWFWorkforceForecasts(filter?: { department?: string; period?: string }): Promise<{ data: WFWorkforceForecast[] }> {
  let filtered = [...mockWorkforceForecasts];
  if (filter?.department) filtered = filtered.filter((f) => f.department === filter.department);
  if (filter?.period) filtered = filtered.filter((f) => f.forecastPeriod === filter.period);
  return { data: filtered };
}

export async function createWFWorkforceForecast(body: { department: string; currentEmployees: number; predictedAttrition: number; predictedHiring: number; forecastPeriod: string }): Promise<{ data: WFWorkforceForecast }> {
  const forecast: WFWorkforceForecast = {
    id: `wff-${String(mockWorkforceForecasts.length + 1).padStart(3, "0")}`,
    department: body.department,
    currentEmployees: body.currentEmployees,
    predictedAttrition: body.predictedAttrition,
    predictedHiring: body.predictedHiring,
    forecastedWorkforce: body.currentEmployees - body.predictedAttrition + body.predictedHiring,
    forecastPeriod: body.forecastPeriod,
    createdAt: new Date().toISOString(),
  };
  mockWorkforceForecasts.push(forecast);
  return { data: forecast };
}

// ── Hiring Plans ────────────────────────────────────────

export async function fetchWFHiringPlans(filters?: { search?: string; status?: string; priority?: string; department?: string; skip?: number; take?: number }): Promise<{ data: WFHiringPlan[]; total: number; skip: number; take: number }> {
  let filtered = [...mockHiringPlans];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((h) => h.position.toLowerCase().includes(q) || h.department.toLowerCase().includes(q)); }
  if (filters?.status) filtered = filtered.filter((h) => h.status === filters.status);
  if (filters?.priority) filtered = filtered.filter((h) => h.priority === filters.priority);
  if (filters?.department) filtered = filtered.filter((h) => h.department === filters.department);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createWFHiringPlan(body: { position: string; department: string; requiredHeadcount: number; priority: string; budget: number; hiringWindow: string }): Promise<{ data: WFHiringPlan }> {
  const plan: WFHiringPlan = {
    id: `hp-${String(mockHiringPlans.length + 1).padStart(3, "0")}`,
    position: body.position,
    department: body.department,
    requiredHeadcount: body.requiredHeadcount,
    priority: body.priority as WfPriority,
    budget: body.budget,
    hiringWindow: body.hiringWindow,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockHiringPlans.push(plan);
  return { data: plan };
}

export async function updateWFHiringPlan(id: string, body: Partial<Pick<WFHiringPlan, "position" | "department" | "requiredHeadcount" | "priority" | "budget" | "hiringWindow" | "status">>): Promise<{ data: WFHiringPlan }> {
  const idx = mockHiringPlans.findIndex((h) => h.id === id);
  if (idx === -1) throw new Error("Hiring plan not found.");
  Object.assign(mockHiringPlans[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockHiringPlans[idx] };
}

// ── Capacity Planning ──────────────────────────────────

export async function fetchWFCapacityPlans(filter?: { department?: string }): Promise<{ data: WFCapacityPlan[] }> {
  let filtered = [...mockCapacityPlans];
  if (filter?.department) filtered = filtered.filter((c) => c.department === filter.department);
  return { data: filtered };
}

export async function createWFCapacityPlan(body: { department: string; availableCapacity: number; requiredCapacity: number }): Promise<{ data: WFCapacityPlan }> {
  const plan: WFCapacityPlan = {
    id: `cp-${String(mockCapacityPlans.length + 1).padStart(3, "0")}`,
    department: body.department,
    availableCapacity: body.availableCapacity,
    requiredCapacity: body.requiredCapacity,
    utilization: Math.round((body.availableCapacity / body.requiredCapacity) * 100),
    gap: body.requiredCapacity - body.availableCapacity,
    createdAt: new Date().toISOString(),
  };
  mockCapacityPlans.push(plan);
  return { data: plan };
}

// ── Skill Gap Analysis ─────────────────────────────────

export async function fetchWFSkillGaps(filters?: { search?: string; priority?: string; department?: string }): Promise<{ data: WFSkillGap[] }> {
  let filtered = [...mockSkillGaps];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((s) => s.department.toLowerCase().includes(q) || s.currentSkills.some((sk) => sk.toLowerCase().includes(q)) || s.requiredSkills.some((sk) => sk.toLowerCase().includes(q))); }
  if (filters?.priority) filtered = filtered.filter((s) => s.priority === filters.priority);
  if (filters?.department) filtered = filtered.filter((s) => s.department === filters.department);
  return { data: filtered };
}

export async function createWFSkillGap(body: { department: string; currentSkills: string[]; requiredSkills: string[]; priority: string; recommendedTraining: string }): Promise<{ data: WFSkillGap }> {
  const current = body.currentSkills;
  const required = body.requiredSkills;
  const gap = required.filter((s: string) => !current.includes(s));
  const skillGap: WFSkillGap = {
    id: `sg-${String(mockSkillGaps.length + 1).padStart(3, "0")}`,
    department: body.department,
    currentSkills: current,
    requiredSkills: required,
    skillGap: gap,
    priority: body.priority as WfPriority,
    recommendedTraining: body.recommendedTraining,
    createdAt: new Date().toISOString(),
  };
  mockSkillGaps.push(skillGap);
  return { data: skillGap };
}

// ── Succession Planning ────────────────────────────────

export async function fetchWFSuccessionPlans(filters?: { search?: string; riskLevel?: string; readinessLevel?: string }): Promise<{ data: WFSuccessionPlan[] }> {
  let filtered = [...mockSuccessionPlans];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((s) => s.criticalRole.toLowerCase().includes(q) || s.currentEmployee.toLowerCase().includes(q) || s.potentialSuccessor.toLowerCase().includes(q)); }
  if (filters?.riskLevel) filtered = filtered.filter((s) => s.riskLevel === filters.riskLevel);
  if (filters?.readinessLevel) filtered = filtered.filter((s) => s.readinessLevel === filters.readinessLevel);
  return { data: filtered };
}

export async function createWFSuccessionPlan(body: { criticalRole: string; currentEmployee: string; potentialSuccessor: string; readinessLevel: string; developmentPlan: string; riskLevel: string }): Promise<{ data: WFSuccessionPlan }> {
  const plan: WFSuccessionPlan = {
    id: `sp-${String(mockSuccessionPlans.length + 1).padStart(3, "0")}`,
    criticalRole: body.criticalRole,
    currentEmployee: body.currentEmployee,
    potentialSuccessor: body.potentialSuccessor,
    readinessLevel: body.readinessLevel as WfReadinessLevel,
    developmentPlan: body.developmentPlan,
    riskLevel: body.riskLevel as WfRiskLevel,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockSuccessionPlans.push(plan);
  return { data: plan };
}

export async function updateWFSuccessionPlan(id: string, body: Partial<Pick<WFSuccessionPlan, "criticalRole" | "currentEmployee" | "potentialSuccessor" | "readinessLevel" | "developmentPlan" | "riskLevel">>): Promise<{ data: WFSuccessionPlan }> {
  const idx = mockSuccessionPlans.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Succession plan not found.");
  Object.assign(mockSuccessionPlans[idx], body, { updatedAt: new Date().toISOString() });
  return { data: mockSuccessionPlans[idx] };
}

// ── Budget Planning ────────────────────────────────────

export async function fetchWFBudgetPlans(filters?: { search?: string; department?: string }): Promise<{ data: WFBudgetPlan[] }> {
  let filtered = [...mockBudgetPlans];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((b) => b.department.toLowerCase().includes(q)); }
  if (filters?.department) filtered = filtered.filter((b) => b.department === filters.department);
  return { data: filtered };
}

export async function createWFBudgetPlan(body: { department: string; currentBudget: number; forecastBudget: number; hiringCost: number; trainingCost: number }): Promise<{ data: WFBudgetPlan }> {
  const plan: WFBudgetPlan = {
    id: `bp-${String(mockBudgetPlans.length + 1).padStart(3, "0")}`,
    department: body.department,
    currentBudget: body.currentBudget,
    forecastBudget: body.forecastBudget,
    hiringCost: body.hiringCost,
    trainingCost: body.trainingCost,
    variance: body.forecastBudget - body.currentBudget,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockBudgetPlans.push(plan);
  return { data: plan };
}

export async function updateWFBudgetPlan(id: string, body: Partial<Pick<WFBudgetPlan, "department" | "currentBudget" | "forecastBudget" | "hiringCost" | "trainingCost">>): Promise<{ data: WFBudgetPlan }> {
  const idx = mockBudgetPlans.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Budget plan not found.");
  Object.assign(mockBudgetPlans[idx], body, { updatedAt: new Date().toISOString() });
  mockBudgetPlans[idx].variance = mockBudgetPlans[idx].forecastBudget - mockBudgetPlans[idx].currentBudget;
  return { data: mockBudgetPlans[idx] };
}

// ── Scenario Planning ──────────────────────────────────

export async function fetchWFScenarioPlans(filter?: { scenarioType?: string }): Promise<{ data: WFScenarioPlan[] }> {
  let filtered = [...mockScenarioPlans];
  if (filter?.scenarioType) filtered = filtered.filter((s) => s.scenarioType === filter.scenarioType);
  return { data: filtered };
}

export async function createWFScenarioPlan(body: { name: string; scenarioType: string; description: string; projectedHeadcount: number; projectedBudget: number; assumptions: string[] }): Promise<{ data: WFScenarioPlan }> {
  const plan: WFScenarioPlan = {
    id: `sc-${String(mockScenarioPlans.length + 1).padStart(3, "0")}`,
    name: body.name,
    scenarioType: body.scenarioType as WfScenarioType,
    description: body.description,
    projectedHeadcount: body.projectedHeadcount,
    projectedBudget: body.projectedBudget,
    assumptions: body.assumptions,
    createdAt: new Date().toISOString(),
  };
  mockScenarioPlans.push(plan);
  return { data: plan };
}

// ── Reports ────────────────────────────────────────────

export async function fetchWFHeadcountReports(): Promise<{ data: WFHeadcountReport[] }> {
  return {
    data: mockHeadcountPlans.map((h) => ({
      department: h.department,
      current: h.currentHeadcount,
      planned: h.plannedHeadcount,
      filled: h.currentHeadcount,
      variance: h.variance,
    })),
  };
}

export async function fetchWFForecastReports(): Promise<{ data: WFForecastReport[] }> {
  return {
    data: [
      { period: "Q1 2026", currentWorkforce: 255, forecastedWorkforce: 265, attrition: 8, hiring: 18 },
      { period: "Q2 2026", currentWorkforce: 265, forecastedWorkforce: 278, attrition: 7, hiring: 20 },
      { period: "Q3 2026", currentWorkforce: 278, forecastedWorkforce: 298, attrition: 10, hiring: 30 },
      { period: "Q4 2026", currentWorkforce: 298, forecastedWorkforce: 315, attrition: 9, hiring: 26 },
    ],
  };
}

export async function fetchWFHiringReports(): Promise<{ data: WFHiringReport[] }> {
  return {
    data: [
      { department: "Engineering", positions: 9, filled: 3, inProgress: 4, cost: 1270000 },
      { department: "Data", positions: 3, filled: 1, inProgress: 1, cost: 450000 },
      { department: "Sales", positions: 8, filled: 0, inProgress: 2, cost: 560000 },
      { department: "Marketing", positions: 2, filled: 0, inProgress: 0, cost: 220000 },
      { department: "HR", positions: 2, filled: 1, inProgress: 1, cost: 180000 },
      { department: "Operations", positions: 3, filled: 0, inProgress: 1, cost: 195000 },
    ],
  };
}

export async function fetchWFSkillGapReports(): Promise<{ data: WFSkillGapReport[] }> {
  return {
    data: [
      { department: "Engineering", totalGaps: 4, criticalGaps: 2, highPriorityGaps: 2 },
      { department: "Data", totalGaps: 3, criticalGaps: 1, highPriorityGaps: 2 },
      { department: "Sales", totalGaps: 2, criticalGaps: 0, highPriorityGaps: 1 },
      { department: "Marketing", totalGaps: 2, criticalGaps: 0, highPriorityGaps: 1 },
      { department: "Finance", totalGaps: 3, criticalGaps: 1, highPriorityGaps: 1 },
      { department: "Operations", totalGaps: 3, criticalGaps: 1, highPriorityGaps: 2 },
    ],
  };
}

export async function fetchWFSuccessionReports(): Promise<{ data: WFSuccessionReport[] }> {
  return {
    data: mockSuccessionPlans.map((s) => ({
      role: s.criticalRole,
      currentEmployee: s.currentEmployee,
      successor: s.potentialSuccessor,
      readiness: s.readinessLevel.replace(/_/g, " "),
      risk: s.riskLevel,
    })),
  };
}

export async function fetchWFBudgetReports(): Promise<{ data: WFBudgetReport[] }> {
  return {
    data: mockBudgetPlans.map((b) => ({
      department: b.department,
      currentBudget: b.currentBudget,
      forecastBudget: b.forecastBudget,
      hiringCost: b.hiringCost,
      trainingCost: b.trainingCost,
    })),
  };
}

export interface RewardsDashboardStats {
  totalAwardsGiven: number;
  activePrograms: number;
  totalPointsIssued: number;
  totalAchievementsUnlocked: number;
  topPerformers: { employeeId: string; name: string; points: number; awards: number }[];
  recentAwards: EmployeeAward[];
  topAchievements: AchievementRecord[];
}

// ── Mock Data ───────────────────────────────────────────

const mockEmployeeAwards: EmployeeAward[] = [
  { id: "awd-001", employeeId: "EMP-001", awardName: "Outstanding Performance Q1", category: "PERFORMANCE", description: "Top performer in engineering team", dateAwarded: "2026-04-15", awardedBy: "Sarah Chen", status: "ACTIVE", employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" } },
  { id: "awd-002", employeeId: "EMP-002", awardName: "Innovation Excellence", category: "INNOVATION", description: "Developed a new caching system", dateAwarded: "2026-05-01", awardedBy: "Mike Johnson", status: "ACTIVE", employee: { id: "e2", firstName: "Bob", lastName: "Smith", employeeId: "EMP-002" } },
  { id: "awd-003", employeeId: "EMP-003", awardName: "Team Player Award", category: "COLLABORATION", description: "Exceptional cross-team collaboration", dateAwarded: "2026-03-20", awardedBy: "Lisa Wang", status: "ACTIVE", employee: { id: "e3", firstName: "Carol", lastName: "Davis", employeeId: "EMP-003" } },
  { id: "awd-004", employeeId: "EMP-004", awardName: "Leadership Excellence", category: "LEADERSHIP", description: "Led successful product launch", dateAwarded: "2026-05-10", awardedBy: "Tom Martinez", status: "ACTIVE", employee: { id: "e4", firstName: "Dan", lastName: "Wilson", employeeId: "EMP-004" } },
  { id: "awd-005", employeeId: "EMP-005", awardName: "Customer Service Star", category: "CUSTOMER_SERVICE", description: "Exceptional client satisfaction ratings", dateAwarded: "2026-04-28", awardedBy: "Sarah Chen", status: "ACTIVE", employee: { id: "e5", firstName: "Eve", lastName: "Martinez", employeeId: "EMP-005" } },
  { id: "awd-006", employeeId: "EMP-006", awardName: "Safety Champion Q1", category: "SAFETY", description: "Zero safety incidents in team", dateAwarded: "2026-04-01", awardedBy: "HR Team", status: "ACTIVE", employee: { id: "e6", firstName: "Frank", lastName: "Lee", employeeId: "EMP-006" } },
  { id: "awd-007", employeeId: "EMP-007", awardName: "Mentorship Award", category: "MENTORSHIP", description: "Guided 3 new hires through onboarding", dateAwarded: "2026-05-15", awardedBy: "Mike Johnson", status: "ACTIVE", employee: { id: "e7", firstName: "Grace", lastName: "Kim", employeeId: "EMP-007" } },
  { id: "awd-008", employeeId: "EMP-008", awardName: "Culture Champion", category: "CULTURE", description: "Organized team building events", dateAwarded: "2026-03-01", awardedBy: "Lisa Wang", status: "ACTIVE", employee: { id: "e8", firstName: "Henry", lastName: "Brown", employeeId: "EMP-008" } },
];

const mockRewardsPrograms: RewardsRecognitionProgram[] = [
  { id: "rrp-001", name: "Peer Recognition Program", description: "Employees can nominate peers for recognition", type: "PEER_RECOGNITION", frequency: "ONGOING", eligibilityCriteria: "All employees", rewardAmount: 500, status: "ACTIVE", participantCount: 120, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "rrp-002", name: "Manager Excellence Awards", description: "Quarterly manager nomination program", type: "MANAGER_NOMINATION", frequency: "QUARTERLY", eligibilityCriteria: "Managers only", rewardAmount: 2000, status: "ACTIVE", participantCount: 45, createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "rrp-003", name: "Spot Recognition", description: "Auto-recognition for milestones and achievements", type: "AUTO_RECOGNITION", frequency: "ONGOING", eligibilityCriteria: "All employees", rewardAmount: 250, status: "ACTIVE", participantCount: 230, createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "rrp-004", name: "Annual Top Performer", description: "Yearly award for top performing employees", type: "MANAGER_NOMINATION", frequency: "YEARLY", eligibilityCriteria: "Top 10% performers", rewardAmount: 10000, status: "DRAFT", participantCount: 0, createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
];

const mockRewardBalances: RewardPointBalance[] = [
  { id: "bal-001", employeeId: "EMP-001", totalPoints: 4500, usedPoints: 1200, availablePoints: 3300, tier: "GOLD", employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" }, lastUpdated: "2026-05-20" },
  { id: "bal-002", employeeId: "EMP-002", totalPoints: 3200, usedPoints: 800, availablePoints: 2400, tier: "SILVER", employee: { id: "e2", firstName: "Bob", lastName: "Smith", employeeId: "EMP-002" }, lastUpdated: "2026-05-18" },
  { id: "bal-003", employeeId: "EMP-003", totalPoints: 6800, usedPoints: 2100, availablePoints: 4700, tier: "PLATINUM", employee: { id: "e3", firstName: "Carol", lastName: "Davis", employeeId: "EMP-003" }, lastUpdated: "2026-05-22" },
  { id: "bal-004", employeeId: "EMP-004", totalPoints: 1500, usedPoints: 500, availablePoints: 1000, tier: "BRONZE", employee: { id: "e4", firstName: "Dan", lastName: "Wilson", employeeId: "EMP-004" }, lastUpdated: "2026-05-10" },
  { id: "bal-005", employeeId: "EMP-005", totalPoints: 5100, usedPoints: 1500, availablePoints: 3600, tier: "GOLD", employee: { id: "e5", firstName: "Eve", lastName: "Martinez", employeeId: "EMP-005" }, lastUpdated: "2026-05-21" },
  { id: "bal-006", employeeId: "EMP-006", totalPoints: 2800, usedPoints: 900, availablePoints: 1900, tier: "SILVER", employee: { id: "e6", firstName: "Frank", lastName: "Lee", employeeId: "EMP-006" }, lastUpdated: "2026-05-19" },
];

const mockRewardTransactions: RewardPointTransaction[] = [
  { id: "txn-001", employeeId: "EMP-001", points: 500, type: "EARNED", reason: "Q1 Performance Bonus", referenceType: "AWARD", referenceId: "awd-001", employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" }, createdAt: "2026-04-15T00:00:00Z" },
  { id: "txn-002", employeeId: "EMP-001", points: 200, type: "REDEEMED", reason: "Gift card redemption", referenceType: null, referenceId: null, employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" }, createdAt: "2026-05-01T00:00:00Z" },
  { id: "txn-003", employeeId: "EMP-002", points: 300, type: "EARNED", reason: "Innovation Award", referenceType: "AWARD", referenceId: "awd-002", employee: { id: "e2", firstName: "Bob", lastName: "Smith", employeeId: "EMP-002" }, createdAt: "2026-05-01T00:00:00Z" },
  { id: "txn-004", employeeId: "EMP-003", points: 1000, type: "EARNED", reason: "Platinum tier bonus", referenceType: null, referenceId: null, employee: { id: "e3", firstName: "Carol", lastName: "Davis", employeeId: "EMP-003" }, createdAt: "2026-05-10T00:00:00Z" },
  { id: "txn-005", employeeId: "EMP-003", points: 500, type: "REDEEMED", reason: "Charity donation match", referenceType: null, referenceId: null, employee: { id: "e3", firstName: "Carol", lastName: "Davis", employeeId: "EMP-003" }, createdAt: "2026-05-15T00:00:00Z" },
  { id: "txn-006", employeeId: "EMP-005", points: 400, type: "EARNED", reason: "Customer satisfaction bonus", referenceType: "AWARD", referenceId: "awd-005", employee: { id: "e5", firstName: "Eve", lastName: "Martinez", employeeId: "EMP-005" }, createdAt: "2026-04-28T00:00:00Z" },
  { id: "txn-007", employeeId: "EMP-007", points: 250, type: "EARNED", reason: "Mentorship recognition", referenceType: "AWARD", referenceId: "awd-007", employee: { id: "e7", firstName: "Grace", lastName: "Kim", employeeId: "EMP-007" }, createdAt: "2026-05-15T00:00:00Z" },
  { id: "txn-008", employeeId: "EMP-006", points: 100, type: "ADJUSTED", reason: "Points correction from HR", referenceType: null, referenceId: null, employee: { id: "e6", firstName: "Frank", lastName: "Lee", employeeId: "EMP-006" }, createdAt: "2026-05-05T00:00:00Z" },
  { id: "txn-009", employeeId: "EMP-004", points: 300, type: "EARNED", reason: "Leadership award", referenceType: "AWARD", referenceId: "awd-004", employee: { id: "e4", firstName: "Dan", lastName: "Wilson", employeeId: "EMP-004" }, createdAt: "2026-05-10T00:00:00Z" },
];

const mockAchievementRecords: AchievementRecord[] = [
  { id: "ach-001", employeeId: "EMP-001", title: "Project Milestone: Platform Redesign", description: "Successfully completed platform architecture redesign ahead of schedule", category: "PROJECT_MILESTONE", badgeIcon: "Trophy", criteria: "Complete major project on time", unlockDate: "2026-04-20T00:00:00Z", status: "UNLOCKED", employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" }, createdAt: "2026-04-20T00:00:00Z", updatedAt: "2026-04-20T00:00:00Z" },
  { id: "ach-002", employeeId: "EMP-002", title: "Perfect Attendance Q1", description: "No absences recorded in Q1 2026", category: "ATTENDANCE", badgeIcon: "Calendar", criteria: "100% attendance for quarter", unlockDate: "2026-04-01T00:00:00Z", status: "UNLOCKED", employee: { id: "e2", firstName: "Bob", lastName: "Smith", employeeId: "EMP-002" }, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ach-003", employeeId: "EMP-003", title: "Skill Mastery: Kubernetes", description: "Completed advanced Kubernetes certification", category: "SKILL_MASTERY", badgeIcon: "Award", criteria: "Pass advanced certification exam", unlockDate: "2026-05-10T00:00:00Z", status: "UNLOCKED", employee: { id: "e3", firstName: "Carol", lastName: "Davis", employeeId: "EMP-003" }, createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
  { id: "ach-004", employeeId: "EMP-004", title: "5 Year Service Milestone", description: "Completed 5 years with the company", category: "MILESTONE", badgeIcon: "Star", criteria: "5 years of service", unlockDate: "2026-03-15T00:00:00Z", status: "UNLOCKED", employee: { id: "e4", firstName: "Dan", lastName: "Wilson", employeeId: "EMP-004" }, createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z" },
  { id: "ach-005", employeeId: "EMP-005", title: "Innovation Award", description: "Filed 2 patent applications this quarter", category: "INNOVATION", badgeIcon: "Lightbulb", criteria: "File patent application", unlockDate: "2026-05-01T00:00:00Z", status: "UNLOCKED", employee: { id: "e5", firstName: "Eve", lastName: "Martinez", employeeId: "EMP-005" }, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "ach-006", employeeId: "EMP-006", title: "Mentor of the Quarter", description: "Recognized for outstanding mentorship contributions", category: "MENTORSHIP", badgeIcon: "Users", criteria: "Complete mentorship program", unlockDate: "2026-04-30T00:00:00Z", status: "UNLOCKED", employee: { id: "e6", firstName: "Frank", lastName: "Lee", employeeId: "EMP-006" }, createdAt: "2026-04-30T00:00:00Z", updatedAt: "2026-04-30T00:00:00Z" },
  { id: "ach-007", employeeId: "EMP-001", title: "Leadership Excellence", description: "Demonstrated exceptional leadership on cross-functional team", category: "LEADERSHIP", badgeIcon: "TrendingUp", criteria: "Lead cross-functional initiative", unlockDate: "2026-05-20T00:00:00Z", status: "LOCKED", employee: { id: "e1", firstName: "Alice", lastName: "Johnson", employeeId: "EMP-001" }, createdAt: "2026-05-20T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
];

// ── Dashboard ──

export async function fetchRewardsDashboard(): Promise<{ data: RewardsDashboardStats }> {
  return {
    data: {
      totalAwardsGiven: mockEmployeeAwards.length,
      activePrograms: mockRewardsPrograms.filter((p) => p.status === "ACTIVE").length,
      totalPointsIssued: mockRewardBalances.reduce((sum, b) => sum + b.totalPoints, 0),
      totalAchievementsUnlocked: mockAchievementRecords.filter((a) => a.status === "UNLOCKED").length,
      topPerformers: [
        { employeeId: "EMP-003", name: "Carol Davis", points: 4700, awards: 1 },
        { employeeId: "EMP-005", name: "Eve Martinez", points: 3600, awards: 1 },
        { employeeId: "EMP-001", name: "Alice Johnson", points: 3300, awards: 1 },
        { employeeId: "EMP-002", name: "Bob Smith", points: 2400, awards: 1 },
        { employeeId: "EMP-006", name: "Frank Lee", points: 1900, awards: 1 },
      ],
      recentAwards: [...mockEmployeeAwards].sort((a, b) => new Date(b.dateAwarded).getTime() - new Date(a.dateAwarded).getTime()).slice(0, 5),
      topAchievements: [...mockAchievementRecords].filter((a) => a.status === "UNLOCKED").sort((a, b) => new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime()).slice(0, 5),
    },
  };
}

// ── Employee Awards ──

export async function fetchAwards(filters?: {
  search?: string; employeeId?: string; category?: string; status?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<{ data: EmployeeAward[]; total: number; skip: number; take: number }> {
  let filtered = [...mockEmployeeAwards];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((a) => a.awardName.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q))); }
  if (filters?.employeeId) filtered = filtered.filter((a) => a.employeeId === filters.employeeId);
  if (filters?.category) filtered = filtered.filter((a) => a.category === filters.category);
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createAward(body: {
  employeeId: string; awardName: string; category: string;
  description?: string; dateAwarded: string; awardedBy?: string;
}): Promise<{ data: EmployeeAward }> {
  const award: EmployeeAward = {
    id: `awd-${String(mockEmployeeAwards.length + 1).padStart(3, "0")}`,
    employeeId: body.employeeId,
    awardName: body.awardName,
    category: body.category,
    description: body.description ?? null,
    dateAwarded: body.dateAwarded,
    awardedBy: body.awardedBy ?? null,
    status: "ACTIVE",
  };
  mockEmployeeAwards.push(award);
  return { data: award };
}

export async function updateAward(id: string, body: {
  awardName?: string; category?: string; description?: string;
  dateAwarded?: string; awardedBy?: string; status?: string;
}): Promise<{ data: EmployeeAward }> {
  const idx = mockEmployeeAwards.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Award not found");
  Object.assign(mockEmployeeAwards[idx], body);
  return { data: mockEmployeeAwards[idx] };
}

export async function deleteAward(id: string): Promise<{ ok: boolean }> {
  const idx = mockEmployeeAwards.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Award not found");
  mockEmployeeAwards.splice(idx, 1);
  return { ok: true };
}

// ── Recognition Programs ──

export async function fetchRewardsRecognitionPrograms(filters?: {
  search?: string; type?: string; status?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<{ data: RewardsRecognitionProgram[]; total: number; skip: number; take: number }> {
  let filtered = [...mockRewardsPrograms];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))); }
  if (filters?.type) filtered = filtered.filter((p) => p.type === filters.type);
  if (filters?.status) filtered = filtered.filter((p) => p.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createRewardsRecognitionProgram(body: {
  name: string; description?: string; type: string; frequency: string;
  eligibilityCriteria?: string; rewardAmount?: number;
}): Promise<{ data: RewardsRecognitionProgram }> {
  const program: RewardsRecognitionProgram = {
    id: `rrp-${String(mockRewardsPrograms.length + 1).padStart(3, "0")}`,
    name: body.name,
    description: body.description ?? null,
    type: body.type,
    frequency: body.frequency,
    eligibilityCriteria: body.eligibilityCriteria ?? null,
    rewardAmount: body.rewardAmount ?? null,
    status: "DRAFT",
    participantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockRewardsPrograms.push(program);
  return { data: program };
}

export async function updateRewardsRecognitionProgram(id: string, body: {
  name?: string; description?: string; type?: string; frequency?: string;
  eligibilityCriteria?: string; rewardAmount?: number; status?: string;
}): Promise<{ data: RewardsRecognitionProgram }> {
  const idx = mockRewardsPrograms.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Program not found");
  Object.assign(mockRewardsPrograms[idx], { ...body, updatedAt: new Date().toISOString() });
  return { data: mockRewardsPrograms[idx] };
}

export async function deleteRewardsRecognitionProgram(id: string): Promise<{ ok: boolean }> {
  const idx = mockRewardsPrograms.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Program not found");
  mockRewardsPrograms.splice(idx, 1);
  return { ok: true };
}

// ── Reward Points ──

export async function fetchRewardPointsBalances(filters?: {
  search?: string; employeeId?: string; tier?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<{ data: RewardPointBalance[]; total: number; skip: number; take: number }> {
  let filtered = [...mockRewardBalances];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((b) => { const name = b.employee ? `${b.employee.firstName} ${b.employee.lastName}` : ""; return name.toLowerCase().includes(q) || b.employeeId.toLowerCase().includes(q); }); }
  if (filters?.employeeId) filtered = filtered.filter((b) => b.employeeId === filters.employeeId);
  if (filters?.tier) filtered = filtered.filter((b) => b.tier === filters.tier);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function fetchRewardPointTransactions(filters?: {
  employeeId?: string; type?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<{ data: RewardPointTransaction[]; total: number; skip: number; take: number }> {
  let filtered = [...mockRewardTransactions];
  if (filters?.employeeId) filtered = filtered.filter((t) => t.employeeId === filters.employeeId);
  if (filters?.type) filtered = filtered.filter((t) => t.type === filters.type);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function awardPoints(body: {
  employeeId: string; points: number; reason: string;
  referenceType?: string; referenceId?: string;
}): Promise<{ data: RewardPointTransaction }> {
  const txn: RewardPointTransaction = {
    id: `txn-${String(mockRewardTransactions.length + 1).padStart(3, "0")}`,
    employeeId: body.employeeId,
    points: body.points,
    type: "EARNED",
    reason: body.reason,
    referenceType: body.referenceType ?? null,
    referenceId: body.referenceId ?? null,
    createdAt: new Date().toISOString(),
  };
  mockRewardTransactions.push(txn);
  const bal = mockRewardBalances.find((b) => b.employeeId === body.employeeId);
  if (bal) { bal.totalPoints += body.points; bal.availablePoints += body.points; bal.lastUpdated = new Date().toISOString().split("T")[0]; }
  return { data: txn };
}

// ── Achievements ──

export async function fetchAchievements(filters?: {
  search?: string; employeeId?: string; category?: string; status?: string;
  skip?: number; take?: number; orderBy?: string; orderDir?: string;
}): Promise<{ data: AchievementRecord[]; total: number; skip: number; take: number }> {
  let filtered = [...mockAchievementRecords];
  if (filters?.search) { const q = filters.search.toLowerCase(); filtered = filtered.filter((a) => a.title.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q))); }
  if (filters?.employeeId) filtered = filtered.filter((a) => a.employeeId === filters.employeeId);
  if (filters?.category) filtered = filtered.filter((a) => a.category === filters.category);
  if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
  const total = filtered.length;
  const skip = filters?.skip ?? 0;
  const take = filters?.take ?? 25;
  return { data: filtered.slice(skip, skip + take), total, skip, take };
}

export async function createAchievement(body: {
  employeeId: string; title: string; description?: string;
  category: string; badgeIcon?: string; criteria?: string; unlockDate: string;
}): Promise<{ data: AchievementRecord }> {
  const achievement: AchievementRecord = {
    id: `ach-${String(mockAchievementRecords.length + 1).padStart(3, "0")}`,
    employeeId: body.employeeId,
    title: body.title,
    description: body.description ?? null,
    category: body.category,
    badgeIcon: body.badgeIcon ?? null,
    criteria: body.criteria ?? null,
    unlockDate: body.unlockDate,
    status: "LOCKED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockAchievementRecords.push(achievement);
  return { data: achievement };
}

export async function updateAchievement(id: string, body: {
  title?: string; description?: string; category?: string;
  badgeIcon?: string; criteria?: string; status?: string;
}): Promise<{ data: AchievementRecord }> {
  const idx = mockAchievementRecords.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Achievement not found");
  Object.assign(mockAchievementRecords[idx], { ...body, updatedAt: new Date().toISOString() });
  return { data: mockAchievementRecords[idx] };
}

export async function deleteAchievement(id: string): Promise<{ ok: boolean }> {
  return handleRewardsResponse<{ ok: boolean }>(
    await fetch(`${REWARDS_BASE}/achievements/${id}`, { method: "DELETE" }),
  );
}

