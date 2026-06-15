import { api } from "./api";

const mockData = {
  overview: { message: "Zoiko HR overview (mock)" },
  departments: [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Sales" },
    { id: 3, name: "HR" },
  ],
  attendance: [
    {
      id: 1,
      user: "Alice Johnson",
      date: "2026-06-11",
      checkInTime: "09:00:15 AM",
      checkOutTime: "05:45:30 PM",
      totalHours: "8.76",
      status: "Present",
    },
    {
      id: 2,
      user: "Alice Johnson",
      date: "2026-06-10",
      checkInTime: "09:15:45 AM",
      checkOutTime: "06:00:00 PM",
      totalHours: "8.74",
      status: "Late",
    },
    {
      id: 3,
      user: "Alice Johnson",
      date: "2026-06-09",
      checkInTime: "08:58:20 AM",
      checkOutTime: "05:30:45 PM",
      totalHours: "8.54",
      status: "Present",
    },
    {
      id: 4,
      user: "Alice Johnson",
      date: "2026-06-08",
      checkInTime: "09:30:00 AM",
      checkOutTime: "05:50:15 PM",
      totalHours: "8.34",
      status: "Late",
    },
    {
      id: 5,
      user: "Alice Johnson",
      date: "2026-06-07",
      checkInTime: "09:05:10 AM",
      checkOutTime: "05:45:00 PM",
      totalHours: "8.67",
      status: "Present",
    },
    {
      id: 6,
      user: "Alice Johnson",
      date: "2026-06-06",
      checkInTime: null,
      checkOutTime: null,
      totalHours: null,
      status: "Absent",
    },
    {
      id: 7,
      user: "Alice Johnson",
      date: "2026-06-05",
      checkInTime: "09:00:00 AM",
      checkOutTime: "05:45:30 PM",
      totalHours: "8.76",
      status: "Present",
    },
    {
      id: 8,
      user: "Alice Johnson",
      date: "2026-06-04",
      checkInTime: "08:59:45 AM",
      checkOutTime: "05:30:20 PM",
      totalHours: "8.51",
      status: "Present",
    },
    {
      id: 9,
      user: "Alice Johnson",
      date: "2026-06-03",
      checkInTime: "09:22:00 AM",
      checkOutTime: "06:15:30 PM",
      totalHours: "8.89",
      status: "Late",
    },
    {
      id: 10,
      user: "Alice Johnson",
      date: "2026-06-02",
      checkInTime: "09:00:30 AM",
      checkOutTime: "05:45:15 PM",
      totalHours: "8.75",
      status: "Present",
    },
    {
      id: 11,
      user: "Alice Johnson",
      date: "2026-06-01",
      checkInTime: "09:10:20 AM",
      checkOutTime: "05:50:45 PM",
      totalHours: "8.67",
      status: "Present",
    },
  ],
  leave: [
    { id: 1, user: "Charlie", type: "Annual", days: 5 },
  ],
  leaves: [
    { id: 1, user: "Charlie", type: "Annual", days: 5 },
  ],
  assets: [
    {
      id: 1,
      assetTag: "AST-001",
      itemName: "MacBook Pro 16\" 2024",
      category: "Hardware",
      serialNumber: "C02YQ0ZRWL",
      assignedTo: "Alice Johnson",
      dateAssigned: "2024-03-15",
      condition: "Excellent",
    },
    {
      id: 2,
      assetTag: "AST-002",
      itemName: "Dell XPS 13",
      category: "Hardware",
      serialNumber: "DWFWF4KQ4",
      assignedTo: "Bob Smith",
      dateAssigned: "2024-01-20",
      condition: "Excellent",
    },
    {
      id: 3,
      assetTag: "AST-003",
      itemName: "Microsoft Office 365",
      category: "Software",
      serialNumber: "MSO-365-2024",
      assignedTo: "Charlie Brown",
      dateAssigned: "2024-06-01",
      condition: "Excellent",
    },
    {
      id: 4,
      assetTag: "AST-004",
      itemName: "Dell Monitor 27\"",
      category: "Peripherals",
      serialNumber: "FD4BF7K9L",
      assignedTo: "Diana Prince",
      dateAssigned: "2023-11-10",
      condition: "Excellent",
    },
    {
      id: 5,
      assetTag: "AST-005",
      itemName: "Logitech MX Master 3",
      category: "Peripherals",
      serialNumber: "LOGO-MXM3-567",
      assignedTo: "Eve Davis",
      dateAssigned: "2024-02-14",
      condition: "Damaged",
    },
    {
      id: 6,
      assetTag: "AST-006",
      itemName: "iPhone 15 Pro",
      category: "Mobile",
      serialNumber: "DNPL9QYMQ4J9",
      assignedTo: "Frank Wilson",
      dateAssigned: "2024-05-22",
      condition: "Excellent",
    },
    {
      id: 7,
      assetTag: "AST-007",
      itemName: "Adobe Creative Cloud",
      category: "Software",
      serialNumber: "ACC-CC-2024",
      assignedTo: "Grace Lee",
      dateAssigned: "2024-04-10",
      condition: "Excellent",
    },
    {
      id: 8,
      assetTag: "AST-008",
      itemName: "iPad Pro 12.9\"",
      category: "Mobile",
      serialNumber: "IPAD-12-9-24",
      assignedTo: "Henry Martinez",
      dateAssigned: "2023-09-05",
      condition: "Excellent",
    },
    {
      id: 9,
      assetTag: "AST-009",
      itemName: "Slack Pro License",
      category: "Software",
      serialNumber: "SLACK-PRO-2024",
      assignedTo: "Ivy Thompson",
      dateAssigned: "2024-01-15",
      condition: "Excellent",
    },
    {
      id: 10,
      assetTag: "AST-010",
      itemName: "Mechanical Keyboard RGB",
      category: "Peripherals",
      serialNumber: "MECH-KB-4521",
      assignedTo: "Jack Anderson",
      dateAssigned: "2024-03-01",
      condition: "Damaged",
    },
  ],
  workforce: [
    { id: 1, name: "Alice", role: "Engineer" },
  ],
  compensation: [
    {
      id: 1,
      month: "June 2026",
      grossPay: 9000,
      netPay: 7200,
      status: "Paid",
    },
    {
      id: 2,
      month: "May 2026",
      grossPay: 8900,
      netPay: 7120,
      status: "Paid",
    },
    {
      id: 3,
      month: "April 2026",
      grossPay: 8800,
      netPay: 7040,
      status: "Paid",
    },
    {
      id: 4,
      month: "March 2026",
      grossPay: 8700,
      netPay: 6960,
      status: "Paid",
    },
  ],
  payrollSummary: {
    totalMonthlyPayout: 245000,
    pendingBonuses: 15000,
    employeeCount: 32,
    employees: [
      { id: 1, name: "Alice Johnson", baseSalary: 7200, proposedAdjustment: 0, adjustedSalary: 7200 },
      { id: 2, name: "Bob Smith", baseSalary: 6800, proposedAdjustment: 0, adjustedSalary: 6800 },
      { id: 3, name: "Charlie Brown", baseSalary: 7400, proposedAdjustment: 0, adjustedSalary: 7400 },
      { id: 4, name: "Diana Prince", baseSalary: 7800, proposedAdjustment: 0, adjustedSalary: 7800 },
    ],
  },
  recruitment: [],
  learning: [],
  designations: [
    { id: 1, title: "Software Engineer", department_id: 1, department_name: "Engineering", level: "L2", description: "Responsible for core software development tasks.", status: "active" },
    { id: 2, title: "Senior Product Manager", department_id: 2, department_name: "Sales", level: "L5", description: "Manages overall product lifecycle and cross-team alignment.", status: "active" },
    { id: 3, title: "HR Generalist", department_id: 3, department_name: "HR", level: "L3", description: "Supports recruiting, onboarding, and employee relations.", status: "active" },
    { id: 4, title: "DevOps Architect", department_id: 1, department_name: "Engineering", level: "L6", description: "Designs and maintains cloud infrastructure and CI/CD pipelines.", status: "active" },
    { id: 5, title: "Director of Engineering", department_id: 1, department_name: "Engineering", level: "L8", description: "Leads engineering departments and aligns technological strategy.", status: "active" },
  ],
};


export async function fetchList(resource) {
  const url = `/hr/${resource}`;
  try {
    return await api.get(url);
  } catch (err) {
    console.warn(`hrService: fetch failed for ${url}, falling back to mock:`, err.message || err);
  }

  // Return mock data if available, otherwise empty array
  const fallback = mockData[resource];
  if (fallback !== undefined) return Promise.resolve(fallback);
  return Promise.resolve([]);
}

export const getOverview = () => fetchList("overview");
export const getDepartments = () => fetchList("departments");
export const getDesignations = () => fetchList("designations");
export const getAttendance = () => fetchList("attendance");
export const getLeave = () => api.get("/hr/leaves");
export const getWorkforce = () => fetchList("workforce");
export const getCompensation = () => fetchList("compensation");
export const getPayrollSummary = () => fetchList("payrollSummary");
export const getRecruitment = () => fetchList("recruitment");
export const getLearning = () => fetchList("learning");
export const getDocuments = () => api.get("/hr/documents");

export const createRecord = (resource, payload) => api.post(`/hr/${resource}`, payload);
export const updateRecord = (resource, id, payload) => api.put(`/hr/${resource}/${id}`, payload);
export const deleteRecord = (resource, id) => api.delete(`/hr/${resource}/${id}`);

export const createRecruitmentCandidate = (payload) => api.post("/hr/recruitment", payload);
export const updateRecruitmentCandidate = (id, payload) => api.put(`/hr/recruitment/${id}`, payload);
export const deleteRecruitmentCandidate = (id) => api.delete(`/hr/recruitment/${id}`);

export const getEmployees = (params = {}) => api.get("/hr/employees", { params });
export const getTravel = (employeeId) => api.get(`/hr/travel${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getTravelById = (id) => api.get(`/hr/travel/${id}`);
export const createTravel = (payload) => api.post("/hr/travel", payload);
export const updateTravel = (id, payload) => api.put(`/hr/travel/${id}`, payload);
export const deleteTravel = (id) => api.delete(`/hr/travel/${id}`);

export const getAssets = (employeeId) => api.get(`/hr/assets${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getAssetById = (id) => api.get(`/hr/assets/${id}`);
export const createAsset = (payload) => api.post("/hr/assets", payload);
export const updateAsset = (id, payload) => api.put(`/hr/assets/${id}`, payload);
export const deleteAsset = (id) => api.delete(`/hr/assets/${id}`);

export const getMyProfile = () => api.get("/hr/employees/me");
export const updateMyProfile = (payload) => api.put("/hr/employees/me", payload);

export const getMyLeave = (employeeId) => api.get(`/hr/leaves${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getMyAttendance = (employeeId) => api.get(`/hr/attendance${employeeId ? `?employee_id=${employeeId}` : ''}`);

export const getEss = (employeeId) => api.get(`/hr/ess${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const createEss = (payload) => api.post("/hr/ess", payload);
export const updateEss = (id, payload) => api.put(`/hr/ess/${id}`, payload);
export const deleteEss = (id) => api.delete(`/hr/ess/${id}`);

export const getOnboardingTasks = (employeeId) => api.get(`/hr/onboarding${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const createOnboardingTask = (payload) => api.post("/hr/onboarding", payload);
export const updateOnboardingTask = (id, payload) => api.put(`/hr/onboarding/${id}`, payload);
export const deleteOnboardingTask = (id) => api.delete(`/hr/onboarding/${id}`);

export const getOnboardingRecords = () => api.get("/hr/onboarding/records");
export const getOnboardingRecordById = (id) => api.get(`/hr/onboarding/records/${id}`);
export const createOnboardingRecord = (payload) => api.post("/hr/onboarding/records", payload);
export const updateOnboardingRecord = (id, payload) => api.put(`/hr/onboarding/records/${id}`, payload);
export const deleteOnboardingRecord = (id) => api.delete(`/hr/onboarding/records/${id}`);

// ── Onboarding Documents ──────────────────────────────────────────────────
export const getOnboardingDocuments = (recordId) => api.get(`/hr/onboarding/documents${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const getOnboardingDocumentById = (id) => api.get(`/hr/onboarding/documents/${id}`);
export const createOnboardingDocument = (formData) => api.post("/hr/onboarding/documents", formData, { headers: { "Content-Type": undefined }, auth: true });
export const updateOnboardingDocument = (id, payload) => api.put(`/hr/onboarding/documents/${id}`, payload);
export const deleteOnboardingDocument = (id) => api.delete(`/hr/onboarding/documents/${id}`);

// ── Onboarding Checklist Templates ───────────────────────────────────────
export const getOnboardingChecklistTemplates = (category) => api.get(`/hr/onboarding/checklist-templates${category ? `?category=${category}` : ''}`);
export const getOnboardingChecklistTemplateById = (id) => api.get(`/hr/onboarding/checklist-templates/${id}`);
export const createOnboardingChecklistTemplate = (payload) => api.post("/hr/onboarding/checklist-templates", payload);
export const updateOnboardingChecklistTemplate = (id, payload) => api.put(`/hr/onboarding/checklist-templates/${id}`, payload);
export const deleteOnboardingChecklistTemplate = (id) => api.delete(`/hr/onboarding/checklist-templates/${id}`);

// ── Onboarding Checklist Assignments ─────────────────────────────────────
export const getOnboardingChecklistAssignments = (recordId) => api.get(`/hr/onboarding/checklist-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingChecklistAssignment = (payload) => api.post("/hr/onboarding/checklist-assignments", payload);
export const updateOnboardingChecklistAssignment = (id, payload) => api.put(`/hr/onboarding/checklist-assignments/${id}`, payload);
export const deleteOnboardingChecklistAssignment = (id) => api.delete(`/hr/onboarding/checklist-assignments/${id}`);

// ── Onboarding Mentor Assignments ────────────────────────────────────────
export const getOnboardingMentorAssignments = (recordId) => api.get(`/hr/onboarding/mentor-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingMentorAssignment = (payload) => api.post("/hr/onboarding/mentor-assignments", payload);
export const updateOnboardingMentorAssignment = (id, payload) => api.put(`/hr/onboarding/mentor-assignments/${id}`, payload);
export const deleteOnboardingMentorAssignment = (id) => api.delete(`/hr/onboarding/mentor-assignments/${id}`);

// ── Onboarding Asset Allocations ─────────────────────────────────────────
export const getOnboardingAssetAllocations = (recordId) => api.get(`/hr/onboarding/asset-allocations${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingAssetAllocation = (payload) => api.post("/hr/onboarding/asset-allocations", payload);
export const updateOnboardingAssetAllocation = (id, payload) => api.put(`/hr/onboarding/asset-allocations/${id}`, payload);
export const deleteOnboardingAssetAllocation = (id) => api.delete(`/hr/onboarding/asset-allocations/${id}`);

// ── Onboarding Access Requests ───────────────────────────────────────────
export const getOnboardingAccessRequests = (recordId) => api.get(`/hr/onboarding/access-requests${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingAccessRequest = (payload) => api.post("/hr/onboarding/access-requests", payload);
export const updateOnboardingAccessRequest = (id, payload) => api.put(`/hr/onboarding/access-requests/${id}`, payload);
export const deleteOnboardingAccessRequest = (id) => api.delete(`/hr/onboarding/access-requests/${id}`);

// ── Onboarding Orientation Sessions ──────────────────────────────────────
export const getOnboardingOrientationSessions = () => api.get("/hr/onboarding/orientation-sessions");
export const getOnboardingOrientationSessionById = (id) => api.get(`/hr/onboarding/orientation-sessions/${id}`);
export const createOnboardingOrientationSession = (payload) => api.post("/hr/onboarding/orientation-sessions", payload);
export const updateOnboardingOrientationSession = (id, payload) => api.put(`/hr/onboarding/orientation-sessions/${id}`, payload);
export const deleteOnboardingOrientationSession = (id) => api.delete(`/hr/onboarding/orientation-sessions/${id}`);

// ── Onboarding Orientation Attendees ─────────────────────────────────────
export const getOnboardingOrientationAttendees = (sessionId, recordId) => {
  let url = "/hr/onboarding/orientation-attendees";
  const params = [];
  if (sessionId) params.push(`session_id=${sessionId}`);
  if (recordId) params.push(`onboarding_record_id=${recordId}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const createOnboardingOrientationAttendee = (payload) => api.post("/hr/onboarding/orientation-attendees", payload);
export const updateOnboardingOrientationAttendee = (id, payload) => api.put(`/hr/onboarding/orientation-attendees/${id}`, payload);
export const deleteOnboardingOrientationAttendee = (id) => api.delete(`/hr/onboarding/orientation-attendees/${id}`);

// ── Onboarding Training Paths ────────────────────────────────────────────
export const getOnboardingTrainingPaths = (type) => api.get(`/hr/onboarding/training-paths${type ? `?training_type=${type}` : ''}`);
export const getOnboardingTrainingPathById = (id) => api.get(`/hr/onboarding/training-paths/${id}`);
export const createOnboardingTrainingPath = (payload) => api.post("/hr/onboarding/training-paths", payload);
export const updateOnboardingTrainingPath = (id, payload) => api.put(`/hr/onboarding/training-paths/${id}`, payload);
export const deleteOnboardingTrainingPath = (id) => api.delete(`/hr/onboarding/training-paths/${id}`);

// ── Onboarding Training Assignments ──────────────────────────────────────
export const getOnboardingTrainingAssignments = (recordId) => api.get(`/hr/onboarding/training-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingTrainingAssignment = (payload) => api.post("/hr/onboarding/training-assignments", payload);
export const updateOnboardingTrainingAssignment = (id, payload) => api.put(`/hr/onboarding/training-assignments/${id}`, payload);
export const deleteOnboardingTrainingAssignment = (id) => api.delete(`/hr/onboarding/training-assignments/${id}`);

// ── Onboarding Certifications ────────────────────────────────────────────
export const getOnboardingCertifications = (recordId) => api.get(`/hr/onboarding/certifications${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingCertification = (payload) => api.post("/hr/onboarding/certifications", payload);
export const updateOnboardingCertification = (id, payload) => api.put(`/hr/onboarding/certifications/${id}`, payload);
export const deleteOnboardingCertification = (id) => api.delete(`/hr/onboarding/certifications/${id}`);

// ── Onboarding Milestones ────────────────────────────────────────────────
export const getOnboardingMilestones = (recordId) => api.get(`/hr/onboarding/milestones${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingMilestone = (payload) => api.post("/hr/onboarding/milestones", payload);
export const updateOnboardingMilestone = (id, payload) => api.put(`/hr/onboarding/milestones/${id}`, payload);
export const deleteOnboardingMilestone = (id) => api.delete(`/hr/onboarding/milestones/${id}`);

// ── Onboarding Activities ────────────────────────────────────────────────
export const getOnboardingActivities = (limit = 50) => api.get(`/hr/onboarding/activities?limit=${limit}`);

// ── Onboarding Dashboard & Reports ───────────────────────────────────────
export const getOnboardingDashboard = () => api.get("/hr/onboarding/dashboard");
export const getOnboardingJoiningReport = () => api.get("/hr/onboarding/reports/joining");
export const getOnboardingPendingActivities = () => api.get("/hr/onboarding/reports/pending-activities");
export const getOnboardingCompletionReport = () => api.get("/hr/onboarding/reports/completion");
export const getOnboardingDepartmentReport = () => api.get("/hr/onboarding/reports/department-wise");

export const getLearningDashboard = () => api.get("/hr/learning/dashboard");

export const getCourses = () => api.get("/hr/learning/courses");
export const getCourseById = (id) => api.get(`/hr/learning/courses/${id}`);
export const createCourse = (payload) => api.post("/hr/learning/courses", payload);
export const updateCourse = (id, payload) => api.put(`/hr/learning/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/hr/learning/courses/${id}`);

export const getEnrollments = (employeeId, courseId) => {
  let url = "/hr/learning/enrollments";
  const params = [];
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (courseId) params.push(`course_id=${courseId}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const createEnrollment = (payload) => api.post("/hr/learning/enrollments", payload);
export const updateEnrollment = (id, payload) => api.put(`/hr/learning/enrollments/${id}`, payload);
export const deleteEnrollment = (id) => api.delete(`/hr/learning/enrollments/${id}`);

export const getLearningPaths = () => api.get("/hr/learning/paths");
export const getLearningPathById = (id) => api.get(`/hr/learning/paths/${id}`);
export const createLearningPath = (payload) => api.post("/hr/learning/paths", payload);
export const updateLearningPath = (id, payload) => api.put(`/hr/learning/paths/${id}`, payload);
export const deleteLearningPath = (id) => api.delete(`/hr/learning/paths/${id}`);
export const addPathItem = (pathId, payload) => api.post(`/hr/learning/paths/${pathId}/items`, payload);
export const removePathItem = (itemId) => api.delete(`/hr/learning/paths/items/${itemId}`);

export const getCertifications = (employeeId) => api.get(`/hr/learning/certifications${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const createCertification = (payload) => api.post("/hr/learning/certifications", payload);
export const deleteCertification = (id) => api.delete(`/hr/learning/certifications/${id}`);

export const getSkills = (employeeId) => api.get(`/hr/learning/skills${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const createSkill = (payload) => api.post("/hr/learning/skills", payload);
export const updateSkill = (id, payload) => api.put(`/hr/learning/skills/${id}`, payload);
export const deleteSkill = (id) => api.delete(`/hr/learning/skills/${id}`);

// ── Training Programs ──────────────────────────────────────────────────────
export const getTrainingPrograms = (status) => api.get(`/hr/learning/training-programs${status ? `?status=${status}` : ''}`);
export const getTrainingProgramById = (id) => api.get(`/hr/learning/training-programs/${id}`);
export const createTrainingProgram = (payload) => api.post("/hr/learning/training-programs", payload);
export const updateTrainingProgram = (id, payload) => api.put(`/hr/learning/training-programs/${id}`, payload);
export const deleteTrainingProgram = (id) => api.delete(`/hr/learning/training-programs/${id}`);

export const getTrainingProgramAssignments = (programId) => api.get(`/hr/learning/training-programs/${programId}/assignments`);
export const createTrainingProgramAssignment = (payload) => api.post("/hr/learning/training-program-assignments", payload);
export const updateTrainingProgramAssignment = (id, payload) => api.put(`/hr/learning/training-program-assignments/${id}`, payload);
export const deleteTrainingProgramAssignment = (id) => api.delete(`/hr/learning/training-program-assignments/${id}`);

// ── Assessments & Quizzes ──────────────────────────────────────────────────
export const getAssessments = (courseId) => api.get(`/hr/learning/assessments${courseId ? `?course_id=${courseId}` : ''}`);
export const getAssessmentById = (id) => api.get(`/hr/learning/assessments/${id}`);
export const createAssessment = (payload) => api.post("/hr/learning/assessments", payload);
export const updateAssessment = (id, payload) => api.put(`/hr/learning/assessments/${id}`, payload);
export const deleteAssessment = (id) => api.delete(`/hr/learning/assessments/${id}`);

export const getQuestions = (assessmentId) => api.get(`/hr/learning/assessments/${assessmentId}/questions`);
export const createQuestion = (assessmentId, payload) => api.post(`/hr/learning/assessments/${assessmentId}/questions`, payload);
export const updateQuestion = (id, payload) => api.put(`/hr/learning/questions/${id}`, payload);
export const deleteQuestion = (id) => api.delete(`/hr/learning/questions/${id}`);

export const getQuizAttempts = (assessmentId, employeeId) => {
  let url = "/hr/learning/quiz-attempts";
  const params = [];
  if (assessmentId) params.push(`assessment_id=${assessmentId}`);
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const createQuizAttempt = (payload) => api.post("/hr/learning/quiz-attempts", payload);
export const updateQuizAttempt = (id, payload) => api.put(`/hr/learning/quiz-attempts/${id}`, payload);

// ── Training Calendar ──────────────────────────────────────────────────────
export const getTrainingCalendarEvents = (year, month, eventType) => {
  let url = "/hr/learning/calendar";
  const params = [];
  if (year) params.push(`year=${year}`);
  if (month) params.push(`month=${month}`);
  if (eventType) params.push(`event_type=${eventType}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const createTrainingCalendarEvent = (payload) => api.post("/hr/learning/calendar", payload);
export const updateTrainingCalendarEvent = (id, payload) => api.put(`/hr/learning/calendar/${id}`, payload);
export const deleteTrainingCalendarEvent = (id) => api.delete(`/hr/learning/calendar/${id}`);

// ── Learning Reports ───────────────────────────────────────────────────────
export const getCourseCompletionReport = () => api.get("/hr/learning/reports/course-completion");
export const getCertificationReport = () => api.get("/hr/learning/reports/certifications");
export const getSkillGapAnalysis = () => api.get("/hr/learning/reports/skill-gap");
export const getEmployeeLearningProgress = (employeeId) => api.get(`/hr/learning/reports/employee-progress/${employeeId}`);
export const getDepartmentLearningReport = (departmentId) => api.get(`/hr/learning/reports/department-learning/${departmentId}`);

export const getPerformanceDashboard = () => api.get("/hr/performance/dashboard");

export const getReviewCycles = () => api.get("/hr/performance/cycles");
export const getReviewCycleById = (id) => api.get(`/hr/performance/cycles/${id}`);
export const createReviewCycle = (payload) => api.post("/hr/performance/cycles", payload);
export const updateReviewCycle = (id, payload) => api.put(`/hr/performance/cycles/${id}`, payload);
export const deleteReviewCycle = (id) => api.delete(`/hr/performance/cycles/${id}`);

export const getPerformanceGoals = (employeeId) => api.get(`/hr/performance/goals${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getPerformanceGoalById = (id) => api.get(`/hr/performance/goals/${id}`);
export const createPerformanceGoal = (payload) => api.post("/hr/performance/goals", payload);
export const updatePerformanceGoal = (id, payload) => api.put(`/hr/performance/goals/${id}`, payload);
export const deletePerformanceGoal = (id) => api.delete(`/hr/performance/goals/${id}`);

export const getPerformanceKpis = (employeeId) => api.get(`/hr/performance/kpis${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getPerformanceKpiById = (id) => api.get(`/hr/performance/kpis/${id}`);
export const createPerformanceKpi = (payload) => api.post("/hr/performance/kpis", payload);
export const updatePerformanceKpi = (id, payload) => api.put(`/hr/performance/kpis/${id}`, payload);
export const deletePerformanceKpi = (id) => api.delete(`/hr/performance/kpis/${id}`);

export const getPerformanceReviews = (employeeId) => api.get(`/hr/performance${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getPerformanceReviewById = (id) => api.get(`/hr/performance/${id}`);
export const createPerformanceReview = (payload) => api.post("/hr/performance", payload);
export const updatePerformanceReview = (id, payload) => api.put(`/hr/performance/${id}`, payload);
export const deletePerformanceReview = (id) => api.delete(`/hr/performance/${id}`);

export const getPeerFeedback = (employeeId, reviewerId) => {
  let url = "/hr/performance/feedback";
  const params = [];
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (reviewerId) params.push(`reviewer_id=${reviewerId}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const createPeerFeedback = (payload) => api.post("/hr/performance/feedback", payload);
export const deletePeerFeedback = (id) => api.delete(`/hr/performance/feedback/${id}`);

export const getImprovementPlans = (employeeId) => api.get(`/hr/performance/pips${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getImprovementPlanById = (id) => api.get(`/hr/performance/pips/${id}`);
export const createImprovementPlan = (payload) => api.post("/hr/performance/pips", payload);
export const updateImprovementPlan = (id, payload) => api.put(`/hr/performance/pips/${id}`, payload);
export const deleteImprovementPlan = (id) => api.delete(`/hr/performance/pips/${id}`);

// ═════════════════════════════════════════════════════════════════════════════
// COMPENSATION & BENEFITS HELPERS
// ═════════════════════════════════════════════════════════════════════════════

export const getCompensationDashboard = () => api.get("/hr/compensation/dashboard");

// Pay Grades
export const getPayGrades = () => api.get("/hr/compensation/pay-grades");
export const createPayGrade = (payload) => api.post("/hr/compensation/pay-grades", payload);
export const updatePayGrade = (id, payload) => api.put(`/hr/compensation/pay-grades/${id}`, payload);
export const deletePayGrade = (id) => api.delete(`/hr/compensation/pay-grades/${id}`);

// Salary Structures
export const getSalaryStructures = (employeeId) =>
  api.get(`/hr/compensation/salary-structures${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createSalaryStructure = (payload) => api.post("/hr/compensation/salary-structures", payload);

// Salary Revisions
export const getSalaryRevisions = (employeeId) =>
  api.get(`/hr/compensation/salary-revisions${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createSalaryRevision = (payload) => api.post("/hr/compensation/salary-revisions", payload);

// Bonuses
export const getBonuses = (employeeId) =>
  api.get(`/hr/compensation/bonuses${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const getBonusById = (id) => api.get(`/hr/compensation/bonuses/${id}`);
export const createBonus = (payload) => api.post("/hr/compensation/bonuses", payload);
export const updateBonus = (id, payload) => api.put(`/hr/compensation/bonuses/${id}`, payload);
export const deleteBonus = (id) => api.delete(`/hr/compensation/bonuses/${id}`);

// Incentives
export const getIncentives = (employeeId) =>
  api.get(`/hr/compensation/incentives${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createIncentive = (payload) => api.post("/hr/compensation/incentives", payload);

// Benefits
export const getBenefits = (employeeId) =>
  api.get(`/hr/compensation/benefits${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createBenefit = (payload) => api.post("/hr/compensation/benefits", payload);

// Allowances
export const getAllowances = (employeeId) =>
  api.get(`/hr/compensation/allowances${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createAllowance = (payload) => api.post("/hr/compensation/allowances", payload);

// Deductions
export const getDeductions = (employeeId) =>
  api.get(`/hr/compensation/deductions${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createDeduction = (payload) => api.post("/hr/compensation/deductions", payload);

// Compensation Items Extended
export const getCompensationItemById = (id) => api.get(`/hr/compensations/${id}`);
export const updateCompensationItem = (id, payload) => api.put(`/hr/compensations/${id}`, payload);
export const deleteCompensationItem = (id) => api.delete(`/hr/compensations/${id}`);

// Benefits Extended
export const getBenefitById = (id) => api.get(`/hr/compensation/benefits/${id}`);
export const updateBenefit = (id, payload) => api.put(`/hr/compensation/benefits/${id}`, payload);
export const deleteBenefit = (id) => api.delete(`/hr/compensation/benefits/${id}`);

// Incentives Extended
export const getIncentiveById = (id) => api.get(`/hr/compensation/incentives/${id}`);
export const updateIncentive = (id, payload) => api.put(`/hr/compensation/incentives/${id}`, payload);
export const deleteIncentive = (id) => api.delete(`/hr/compensation/incentives/${id}`);

// Allowances Extended
export const getAllowanceById = (id) => api.get(`/hr/compensation/allowances/${id}`);
export const updateAllowance = (id, payload) => api.put(`/hr/compensation/allowances/${id}`, payload);
export const deleteAllowance = (id) => api.delete(`/hr/compensation/allowances/${id}`);

// Deductions Extended
export const getDeductionById = (id) => api.get(`/hr/compensation/deductions/${id}`);
export const updateDeduction = (id, payload) => api.put(`/hr/compensation/deductions/${id}`, payload);
export const deleteDeduction = (id) => api.delete(`/hr/compensation/deductions/${id}`);

// Salary Structures Extended
export const updateSalaryStructure = (id, payload) => api.put(`/hr/compensation/salary-structures/${id}`, payload);
export const deleteSalaryStructure = (id) => api.delete(`/hr/compensation/salary-structures/${id}`);

// Salary Revisions Extended
export const updateSalaryRevision = (id, payload) => api.put(`/hr/compensation/salary-revisions/${id}`, payload);
export const deleteSalaryRevision = (id) => api.delete(`/hr/compensation/salary-revisions/${id}`);

// ═════════════════════════════════════════════════════════════════════════════
// ENGAGEMENT SURVEY HELPERS
// ═════════════════════════════════════════════════════════════════════════════

export const getEngagementSurveys = (employeeId) =>
  api.get(`/hr/engagement${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const getEngagementSurveyById = (id) => api.get(`/hr/engagement/${id}`);
export const createEngagementSurvey = (payload) => api.post("/hr/engagement", payload);
export const updateEngagementSurvey = (id, payload) => api.put(`/hr/engagement/${id}`, payload);
export const deleteEngagementSurvey = (id) => api.delete(`/hr/engagement/${id}`);
export const getEngagementDashboard = () => api.get("/hr/engagement/dashboard");

// ═════════════════════════════════════════════════════════════════════════════
// COMPLIANCE & AUDIT HELPERS
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// HR DASHBOARD STATS
// ═════════════════════════════════════════════════════════════════════════════

export const getHrDashboardStats = () => api.get("/hr/dashboard/stats");

// ═════════════════════════════════════════════════════════════════════════════
// DEPARTMENT CRUD SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const getDepartmentById = (id) => api.get(`/hr/departments/${id}`);
export const createDepartment = (payload) => api.post("/hr/departments", payload);
export const updateDepartment = (id, payload) => api.put(`/hr/departments/${id}`, payload);
export const deleteDepartment = (id) => api.delete(`/hr/departments/${id}`);

// ═════════════════════════════════════════════════════════════════════════════
// DESIGNATIONS CRUD SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const getDesignationById = (id) => api.get(`/hr/designations/${id}`);
export const createDesignation = (payload) => api.post("/hr/designations", payload);
export const updateDesignation = (id, payload) => api.put(`/hr/designations/${id}`, payload);
export const deleteDesignation = (id) => api.delete(`/hr/designations/${id}`);

// ═════════════════════════════════════════════════════════════════════════════
// EMPLOYEE CRUD SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const getEmployeeById = (id) => api.get(`/hr/employees/${id}`);
export const createEmployee = (payload) => api.post("/hr/employees", payload);
export const updateEmployee = (id, payload) => api.put(`/hr/employees/${id}`, payload);
export const deleteEmployee = (id) => api.delete(`/hr/employees/${id}`);

// ═════════════════════════════════════════════════════════════════════════════
// ATTENDANCE CRUD SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const createAttendance = (payload) => api.post("/hr/attendance", payload);
export const getAttendanceRecords = (employeeId) =>
  api.get(`/hr/attendance${employeeId ? `?employee_id=${employeeId}` : ""}`);

// ═════════════════════════════════════════════════════════════════════════════
// LEAVE CRUD SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const createLeaveRequest = (payload) => api.post("/hr/leaves", payload);
export const getLeaveRequests = (employeeId) =>
  api.get(`/hr/leaves${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const reviewLeaveRequest = (id, payload) => api.put(`/hr/leaves/${id}/review`, payload);

// ═════════════════════════════════════════════════════════════════════════════
// WORKFORCE PLANNING SPECIFIC
// ═════════════════════════════════════════════════════════════════════════════

export const getWorkforcePlans = () => api.get("/hr/workforce-planning");
export const createWorkforcePlan = (payload) => api.post("/hr/workforce-planning", payload);
export const getWorkforceSummary = () => api.get("/hr/workforce/summary");

export const getComplianceDashboard = () => api.get("/hr/compliance/dashboard");
export const getComplianceReport = () => api.get("/hr/compliance/reports");

// Policies
export const getPolicies = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/policies${query ? `?${query}` : ""}`);
};
export const getPolicyById = (id) => api.get(`/hr/compliance/policies/${id}`);
export const createPolicy = (payload) => api.post("/hr/compliance/policies", payload);
export const updatePolicy = (id, payload) => api.put(`/hr/compliance/policies/${id}`, payload);
export const deletePolicy = (id) => api.delete(`/hr/compliance/policies/${id}`);

// Acknowledgements
export const getAcknowledgements = (employeeId, policyId) => {
  const params = [];
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (policyId) params.push(`policy_id=${policyId}`);
  return api.get(`/hr/compliance/acknowledgements${params.length ? `?${params.join("&")}` : ""}`);
};
export const createAcknowledgement = (payload) => api.post("/hr/compliance/acknowledgements", payload);

// Audits
export const getAudits = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/audits${query ? `?${query}` : ""}`);
};
export const getAuditById = (id) => api.get(`/hr/compliance/audits/${id}`);
export const createAudit = (payload) => api.post("/hr/compliance/audits", payload);
export const updateAudit = (id, payload) => api.put(`/hr/compliance/audits/${id}`, payload);
export const deleteAudit = (id) => api.delete(`/hr/compliance/audits/${id}`);

// Regulatory Requirements
export const getRegulatoryRequirements = () => api.get("/hr/compliance/regulations");
export const createRegulatoryRequirement = (payload) => api.post("/hr/compliance/regulations", payload);

// Risk Assessments
export const getRiskAssessments = (status) =>
  api.get(`/hr/compliance/risks${status ? `?status=${status}` : ""}`);
export const getRiskAssessmentById = (id) => api.get(`/hr/compliance/risks/${id}`);
export const createRiskAssessment = (payload) => api.post("/hr/compliance/risks", payload);
export const updateRiskAssessment = (id, payload) => api.put(`/hr/compliance/risks/${id}`, payload);
export const deleteRiskAssessment = (id) => api.delete(`/hr/compliance/risks/${id}`);

// Compliance Violations
export const getComplianceViolations = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/violations${query ? `?${query}` : ""}`);
};
export const getComplianceViolationById = (id) => api.get(`/hr/compliance/violations/${id}`);
export const createComplianceViolation = (payload) => api.post("/hr/compliance/violations", payload);
export const updateComplianceViolation = (id, payload) => api.put(`/hr/compliance/violations/${id}`, payload);
export const deleteComplianceViolation = (id) => api.delete(`/hr/compliance/violations/${id}`);

// Corrective Actions
export const getCorrectiveActions = (violationId, assignedTo) => {
  const params = [];
  if (violationId) params.push(`violation_id=${violationId}`);
  if (assignedTo) params.push(`assigned_to=${assignedTo}`);
  return api.get(`/hr/compliance/corrective-actions${params.length ? `?${params.join("&")}` : ""}`);
};
export const getCorrectiveActionById = (id) => api.get(`/hr/compliance/corrective-actions/${id}`);
export const createCorrectiveAction = (payload) => api.post("/hr/compliance/corrective-actions", payload);
export const updateCorrectiveAction = (id, payload) => api.put(`/hr/compliance/corrective-actions/${id}`, payload);
export const deleteCorrectiveAction = (id) => api.delete(`/hr/compliance/corrective-actions/${id}`);
// Add more helpers as needed
