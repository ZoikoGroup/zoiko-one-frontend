import { api, API_BASE_URL } from "./api";

// ── CORE GENERIC FETCHERS ──────────────────────────────────────────────────
export async function fetchList(resource) {
  const url = `/hr/${resource}`;
  // Directly returns the api call promise; no local mock fallbacks
  return api.get(url);
}


export const createRecord = (resource, payload) => api.post(`/hr/${resource}`, payload);
export const updateRecord = (resource, id, payload) => api.put(`/hr/${resource}/${id}`, payload);
export const deleteRecord = (resource, id) => api.delete(`/hr/${resource}/${id}`)

export const getOverview = () => fetchList("overview");
export const getAttendance = () => fetchList("attendance");
export const getLeave = () => api.get("/hr/leaves");
export const getWorkforce = () => fetchList("workforce");
export const getCompensation = () => fetchList("compensation");
export const getPayrollSummary = () => fetchList("payrollSummary");
export const getRecruitment = () => fetchList("recruitment");
export const getLearning = () => fetchList("learning");

// NOTE: getDepartments/getDesignations are intentionally NOT built on
// fetchList() — api.js uses raw fetch and resolves to the parsed JSON body
// directly (no axios-style { data } envelope). Components consuming these
// expect `res.data`, so we wrap the result here. See DEPARTMENT/DESIGNATION
// CRUD SPECIFIC section below for the matching create/update/delete wraps.
export const getDepartments = () => api.get("/hr/departments").then(data => ({ data }));
export const getDesignations = () => api.get("/hr/designations").then(data => ({ data }));


export const createRecruitmentCandidate = (payload) => api.post("/hr/recruitment", payload);
export const updateRecruitmentCandidate = (id, payload) => api.put(`/hr/recruitment/${id}`, payload);
export const deleteRecruitmentCandidate = (id) => api.delete(`/hr/recruitment/${id}`);

// ════════════════════════════════════════════════════════════════════════════
// TRAVEL MODULE
// ════════════════════════════════════════════════════════════════════════════

export const getEmployees = (params = {}) => api.get("/hr/employees", { params });
export const getTravel = (employeeId) => api.get(`/hr/travel${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getTravelById = (id) => api.get(`/hr/travel/${id}`);
export const createTravel = (payload) => api.post("/hr/travel", payload);
export const updateTravel = (id, payload) => api.put(`/hr/travel/${id}`, payload);
export const deleteTravel = (id) => api.delete(`/hr/travel/${id}`);

export const getMyProfile = () => api.get("/hr/employees/me");
export const updateMyProfile = (payload) => api.put("/hr/employees/me", payload);

export const getMyLeave = (employeeId) => api.get(`/hr/leaves${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getMyAttendanceLegacy = (employeeId) => api.get(`/hr/attendance${employeeId ? `?employee_id=${employeeId}` : ''}`);

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

// ── ONBOARDING DOCUMENTS ──────────────────────────────────────────────────
export const getOnboardingDocuments = (recordId) => api.get(`/hr/onboarding/documents${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const getOnboardingDocumentById = (id) => api.get(`/hr/onboarding/documents/${id}`);
export const createOnboardingDocument = (formData) => api.post("/hr/onboarding/documents", formData, { headers: { "Content-Type": undefined }, auth: true });
export const updateOnboardingDocument = (id, payload) => api.put(`/hr/onboarding/documents/${id}`, payload);
export const deleteOnboardingDocument = (id) => api.delete(`/hr/onboarding/documents/${id}`);

// ── ONBOARDING CHECKLIST TEMPLATES ───────────────────────────────────────
export const getOnboardingChecklistTemplates = (category) => api.get(`/hr/onboarding/checklist-templates${category ? `?category=${category}` : ''}`);
export const getOnboardingChecklistTemplateById = (id) => api.get(`/hr/onboarding/checklist-templates/${id}`);
export const createOnboardingChecklistTemplate = (payload) => api.post("/hr/onboarding/checklist-templates", payload);
export const updateOnboardingChecklistTemplate = (id, payload) => api.put(`/hr/onboarding/checklist-templates/${id}`, payload);
export const deleteOnboardingChecklistTemplate = (id) => api.delete(`/hr/onboarding/checklist-templates/${id}`);

// ── ONBOARDING CHECKLIST ASSIGNMENTS ─────────────────────────────────────
export const getOnboardingChecklistAssignments = (recordId) => api.get(`/hr/onboarding/checklist-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingChecklistAssignment = (payload) => api.post("/hr/onboarding/checklist-assignments", payload);
export const updateOnboardingChecklistAssignment = (id, payload) => api.put(`/hr/onboarding/checklist-assignments/${id}`, payload);
export const deleteOnboardingChecklistAssignment = (id) => api.delete(`/hr/onboarding/checklist-assignments/${id}`);

// ── ONBOARDING MENTOR ASSIGNMENTS ────────────────────────────────────────
export const getOnboardingMentorAssignments = (recordId) => api.get(`/hr/onboarding/mentor-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingMentorAssignment = (payload) => api.post("/hr/onboarding/mentor-assignments", payload);
export const updateOnboardingMentorAssignment = (id, payload) => api.put(`/hr/onboarding/mentor-assignments/${id}`, payload);
export const deleteOnboardingMentorAssignment = (id) => api.delete(`/hr/onboarding/mentor-assignments/${id}`);

// ── ONBOARDING ASSET ALLOCATIONS ─────────────────────────────────────────
export const getOnboardingAssetAllocations = (recordId) => api.get(`/hr/onboarding/asset-allocations${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingAssetAllocation = (payload) => api.post("/hr/onboarding/asset-allocations", payload);
export const updateOnboardingAssetAllocation = (id, payload) => api.put(`/hr/onboarding/asset-allocations/${id}`, payload);
export const deleteOnboardingAssetAllocation = (id) => api.delete(`/hr/onboarding/asset-allocations/${id}`);

// ── ONBOARDING ACCESS REQUESTS ───────────────────────────────────────────
export const getOnboardingAccessRequests = (recordId) => api.get(`/hr/onboarding/access-requests${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingAccessRequest = (payload) => api.post("/hr/onboarding/access-requests", payload);
export const updateOnboardingAccessRequest = (id, payload) => api.put(`/hr/onboarding/access-requests/${id}`, payload);
export const deleteOnboardingAccessRequest = (id) => api.delete(`/hr/onboarding/access-requests/${id}`);

// ── ONBOARDING ORIENTATION SESSIONS ──────────────────────────────────────
export const getOnboardingOrientationSessions = () => api.get("/hr/onboarding/orientation-sessions");
export const getOnboardingOrientationSessionById = (id) => api.get(`/hr/onboarding/orientation-sessions/${id}`);
export const createOnboardingOrientationSession = (payload) => api.post("/hr/onboarding/orientation-sessions", payload);
export const updateOnboardingOrientationSession = (id, payload) => api.put(`/hr/onboarding/orientation-sessions/${id}`, payload);
export const deleteOnboardingOrientationSession = (id) => api.delete(`/hr/onboarding/orientation-sessions/${id}`);

// ── ONBOARDING ORIENTATION ATTENDEES ─────────────────────────────────────
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

// ── ONBOARDING TRAINING PATHS ────────────────────────────────────────────
export const getOnboardingTrainingPaths = (type) => api.get(`/hr/onboarding/training-paths${type ? `?training_type=${type}` : ''}`);
export const getOnboardingTrainingPathById = (id) => api.get(`/hr/onboarding/training-paths/${id}`);
export const createOnboardingTrainingPath = (payload) => api.post("/hr/onboarding/training-paths", payload);
export const updateOnboardingTrainingPath = (id, payload) => api.put(`/hr/onboarding/training-paths/${id}`, payload);
export const deleteOnboardingTrainingPath = (id) => api.delete(`/hr/onboarding/training-paths/${id}`);

// ── ONBOARDING TRAINING ASSIGNMENTS ──────────────────────────────────────
export const getOnboardingTrainingAssignments = (recordId) => api.get(`/hr/onboarding/training-assignments${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingTrainingAssignment = (payload) => api.post("/hr/onboarding/training-assignments", payload);
export const updateOnboardingTrainingAssignment = (id, payload) => api.put(`/hr/onboarding/training-assignments/${id}`, payload);
export const deleteOnboardingTrainingAssignment = (id) => api.delete(`/hr/onboarding/training-assignments/${id}`);

// ── ONBOARDING CERTIFICATIONS ────────────────────────────────────────────
export const getOnboardingCertifications = (recordId) => api.get(`/hr/onboarding/certifications${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingCertification = (payload) => api.post("/hr/onboarding/certifications", payload);
export const updateOnboardingCertification = (id, payload) => api.put(`/hr/onboarding/certifications/${id}`, payload);
export const deleteOnboardingCertification = (id) => api.delete(`/hr/onboarding/certifications/${id}`);

// ── ONBOARDING MILESTONES ────────────────────────────────────────────────
export const getOnboardingMilestones = (recordId) => api.get(`/hr/onboarding/milestones${recordId ? `?onboarding_record_id=${recordId}` : ''}`);
export const createOnboardingMilestone = (payload) => api.post("/hr/onboarding/milestones", payload);
export const updateOnboardingMilestone = (id, payload) => api.put(`/hr/onboarding/milestones/${id}`, payload);
export const deleteOnboardingMilestone = (id) => api.delete(`/hr/onboarding/milestones/${id}`);

// ── ONBOARDING ACTIVITIES ────────────────────────────────────────────────
export const getOnboardingActivities = (limit = 50) => api.get(`/hr/onboarding/activities?limit=${limit}`);

// ── ONBOARDING DASHBOARD & REPORTS ───────────────────────────────────────
export const getOnboardingDashboard = () => api.get("/hr/onboarding/dashboard");
export const getOnboardingJoiningReport = () => api.get("/hr/onboarding/reports/joining");
export const getOnboardingPendingActivities = () => api.get("/hr/onboarding/reports/pending-activities");
export const getOnboardingCompletionReport = () => api.get("/hr/onboarding/reports/completion");
export const getOnboardingDepartmentReport = () => api.get("/hr/onboarding/reports/department-wise");

// ════════════════════════════════════════════════════════════════════════════
// ASSETS
// ════════════════════════════════════════════════════════════════════════════
export const getAssetDashboard = () => api.get("/hr/assets/dashboard");

export const getAssets = (params = {}) => api.get("/hr/assets", { params });
export const getAssetById = (id) => api.get(`/hr/assets/${id}`);
export const createAsset = (payload) => api.post("/hr/assets", payload);
export const updateAsset = (id, payload) => api.put(`/hr/assets/${id}`, payload);
export const deleteAsset = (id) => api.delete(`/hr/assets/${id}`);

export const getMaintenanceByAsset = (assetId) => api.get(`/hr/assets/${assetId}/maintenance`);
export const getMaintenanceById = (assetId, maintId) => api.get(`/hr/assets/${assetId}/maintenance/${maintId}`);
export const createMaintenance = (assetId, payload) => api.post(`/hr/assets/${assetId}/maintenance`, payload);
export const updateMaintenance = (assetId, maintId, payload) => api.put(`/hr/assets/${assetId}/maintenance/${maintId}`, payload);
export const resolveMaintenance = (assetId, maintId, payload) => api.put(`/hr/assets/${assetId}/maintenance/${maintId}/resolve`, payload);

export const getAssetRequests = (params = {}) => api.get("/hr/assets/requests", { params });
export const createAssetRequest = (payload) => api.post("/hr/assets/requests", payload);
export const approveAssetRequest = (reqId, payload) => api.put(`/hr/assets/requests/${reqId}/approve`, payload);
export const rejectAssetRequest = (reqId) => api.put(`/hr/assets/requests/${reqId}/reject`);
export const fulfillAssetRequest = (reqId) => api.put(`/hr/assets/requests/${reqId}/fulfill`);
export const cancelAssetRequest = (reqId) => api.put(`/hr/assets/requests/${reqId}/cancel`);

export const getAssetCategories = () => api.get("/hr/assets/categories");
export const createAssetCategory = (payload) => api.post("/hr/assets/categories", payload);
export const updateAssetCategory = (catId, payload) => api.put(`/hr/assets/categories/${catId}`, payload);
export const deleteAssetCategory = (catId) => api.delete(`/hr/assets/categories/${catId}`);
export const transferAsset = (assetId, payload) => api.put(`/hr/assets/${assetId}/transfer`, payload);
export const assignAsset = (assetId, payload) => api.put(`/hr/assets/${assetId}/assign`, payload);
export const returnAsset = (assetId, payload) => api.put(`/hr/assets/${assetId}/return`, payload);

export const getAssetReports = () => api.get("/hr/assets/reports");
export const createAssetReport = (payload) => api.post("/hr/assets/reports", payload);

export const getAssetSettings = () => api.get("/hr/assets/settings");
export const updateAssetSetting = (key, payload) => api.put(`/hr/assets/settings/${key}`, payload);

export async function exportAssetsCsv() {
  const { getAccessToken, API_BASE_URL: DynamicBaseUrl } = await import("./api");
  const token = getAccessToken();
  const res = await fetch(`${DynamicBaseUrl}/hr/assets/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to export CSV");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assets_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAssetsExcel() {
  const { getAccessToken, API_BASE_URL: DynamicBaseUrl } = await import("./api");
  const token = getAccessToken();
  const res = await fetch(`${DynamicBaseUrl}/hr/assets/export/excel`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to export Excel");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assets_${new Date().toISOString().split("T")[0]}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── TIMELINE/LEARNING ──────────────────────────────────────────────────────
export const getLearningDashboard = () => api.get("/hr/learning/dashboard");

export const getCourses = (params = {}) => api.get("/hr/learning/courses", { params });
export const getCourseById = (id) => api.get(`/hr/learning/courses/${id}`);
export const createCourse = (payload) => api.post("/hr/learning/courses", payload);
export const updateCourse = (id, payload) => api.put(`/hr/learning/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/hr/learning/courses/${id}`);

export const getEnrollments = (params = {}) => api.get("/hr/learning/enrollments", { params });
export const getEnrollmentById = (id) => api.get(`/hr/learning/enrollments/${id}`);
export const createEnrollment = (payload) => api.post("/hr/learning/enrollments", payload);
export const updateEnrollment = (id, payload) => api.put(`/hr/learning/enrollments/${id}`, payload);
export const deleteEnrollment = (id) => api.delete(`/hr/learning/enrollments/${id}`);

export const getLearningPaths = () => api.get("/hr/learning/paths");
export const getLearningPathById = (id) => api.get(`/hr/learning/paths/${id}`);
export const createLearningPath = (payload) => api.post("/hr/learning/paths", payload);
export const updateLearningPath = (id, payload) => api.put(`/hr/learning/paths/${id}`, payload);
export const deleteLearningPath = (id) => api.delete(`/hr/learning/paths/${id}`);
export const addPathItem = (pathId, payload) => api.post(`/hr/learning/paths/${pathId}/items`, payload);
export const updatePathItem = (pathId, itemId, payload) => api.put(`/hr/learning/paths/${pathId}/items/${itemId}`, payload);
export const removePathItem = (pathId, itemId) => api.delete(`/hr/learning/paths/${pathId}/items/${itemId}`);

export const getCertifications = (employeeId) => api.get(`/hr/learning/certifications${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getCertificationById = (id) => api.get(`/hr/learning/certifications/${id}`);
export const createCertification = (payload) => api.post("/hr/learning/certifications", payload);
export const updateCertification = (id, payload) => api.put(`/hr/learning/certifications/${id}`, payload);
export const deleteCertification = (id) => api.delete(`/hr/learning/certifications/${id}`);

export const getSkills = (employeeId) => api.get(`/hr/learning/skills${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getSkillById = (id) => api.get(`/hr/learning/skills/${id}`);
export const createSkill = (payload) => api.post("/hr/learning/skills", payload);
export const updateSkill = (id, payload) => api.put(`/hr/learning/skills/${id}`, payload);
export const deleteSkill = (id) => api.delete(`/hr/learning/skills/${id}`);

// ── TRAINING PROGRAMS ──────────────────────────────────────────────────────
export const getTrainingPrograms = (params = {}) => api.get("/hr/learning/programs", { params });
export const getTrainingProgramById = (id) => api.get(`/hr/learning/programs/${id}`);
export const createTrainingProgram = (payload) => api.post("/hr/learning/programs", payload);
export const updateTrainingProgram = (id, payload) => api.put(`/hr/learning/programs/${id}`, payload);
export const deleteTrainingProgram = (id) => api.delete(`/hr/learning/programs/${id}`);

export const getProgramAssignments = (programId) => api.get(`/hr/learning/programs/${programId}/assignments`);
export const createProgramAssignment = (programId, payload) => api.post(`/hr/learning/programs/${programId}/assignments`, payload);
export const updateProgramAssignment = (programId, assignId, payload) => api.put(`/hr/learning/programs/${programId}/assignments/${assignId}`, payload);
export const removeProgramAssignment = (programId, assignId) => api.delete(`/hr/learning/programs/${programId}/assignments/${assignId}`);

// ── ASSESSMENTS & QUIZZES ──────────────────────────────────────────────────
export const getAssessments = (courseId) => api.get(`/hr/learning/assessments${courseId ? `?course_id=${courseId}` : ''}`);
export const getAssessmentById = (id) => api.get(`/hr/learning/assessments/${id}`);
export const createAssessment = (payload) => api.post("/hr/learning/assessments", payload);
export const updateAssessment = (id, payload) => api.put(`/hr/learning/assessments/${id}`, payload);
export const deleteAssessment = (id) => api.delete(`/hr/learning/assessments/${id}`);

export const getQuestions = (assessmentId) => api.get(`/hr/learning/assessments/${assessmentId}/questions`);
export const createQuestion = (assessmentId, payload) => api.post(`/hr/learning/assessments/${assessmentId}/questions`, payload);
export const updateQuestion = (assessmentId, questionId, payload) => api.put(`/hr/learning/assessments/${assessmentId}/questions/${questionId}`, payload);
export const deleteQuestion = (assessmentId, questionId) => api.delete(`/hr/learning/assessments/${assessmentId}/questions/${questionId}`);

export const startQuiz = (payload) => api.post("/hr/learning/assessments/start", payload);
export const submitQuiz = (assessmentId, attemptId, payload) => api.post(`/hr/learning/assessments/${assessmentId}/attempts/${attemptId}/submit`, payload);
export const getQuizAttempts = (assessmentId, employeeId) => {
  let url = `/hr/learning/assessments/${assessmentId}/attempts`;
  const params = [];
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const getQuizAttemptById = (attemptId) => api.get(`/hr/learning/assessments/attempts/${attemptId}`);

// ── TRAINING CALENDAR ──────────────────────────────────────────────────────
export const getTrainingCalendarEvents = (startDate, endDate, eventType) => {
  let url = "/hr/learning/calendar";
  const params = [];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);
  if (eventType) params.push(`event_type=${eventType}`);
  if (params.length) url += `?${params.join("&")}`;
  return api.get(url);
};
export const getTrainingCalendarEventById = (id) => api.get(`/hr/learning/calendar/${id}`);
export const createTrainingCalendarEvent = (payload) => api.post("/hr/learning/calendar", payload);
export const updateTrainingCalendarEvent = (id, payload) => api.put(`/hr/learning/calendar/${id}`, payload);
export const deleteTrainingCalendarEvent = (id) => api.delete(`/hr/learning/calendar/${id}`);

// ── LEARNING REPORTS ───────────────────────────────────────────────────────
export const getCourseCompletionReport = () => api.get("/hr/learning/reports/course-completion");
export const getCertificationReport = () => api.get("/hr/learning/reports/certifications");
export const getSkillGapAnalysis = () => api.get("/hr/learning/reports/skill-gap");
export const getEmployeeLearningProgress = (employeeId) => api.get(`/hr/learning/reports/employee-progress/${employeeId}`);
export const getDepartmentLearningReport = (departmentId) => api.get(`/hr/learning/reports/department-learning/${departmentId}`);

async function downloadLearningReport(endpoint, filename) {
  const { getAccessToken, API_BASE_URL } = await import("./api");
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to export learning report");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const exportCourseCompletionReportCsv = () =>
  downloadLearningReport("/hr/learning/reports/course-completion/csv", `course_completion_${new Date().toISOString().split("T")[0]}.csv`);

export const exportCourseCompletionReportExcel = () =>
  downloadLearningReport("/hr/learning/reports/course-completion/excel", `course_completion_${new Date().toISOString().split("T")[0]}.xlsx`);

export const exportCertificationReportCsv = () =>
  downloadLearningReport("/hr/learning/reports/certifications/csv", `certifications_${new Date().toISOString().split("T")[0]}.csv`);

export const exportCertificationReportExcel = () =>
  downloadLearningReport("/hr/learning/reports/certifications/excel", `certifications_${new Date().toISOString().split("T")[0]}.xlsx`);

export const exportSkillGapReportCsv = () =>
  downloadLearningReport("/hr/learning/reports/skill-gap/csv", `skill_gap_${new Date().toISOString().split("T")[0]}.csv`);

export const exportSkillGapReportExcel = () =>
  downloadLearningReport("/hr/learning/reports/skill-gap/excel", `skill_gap_${new Date().toISOString().split("T")[0]}.xlsx`);

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

// ── COMPENSATION & BENEFITS HELPERS ─────────────────────────────────────────
export const getCompensationDashboard = () => api.get("/hr/compensation/dashboard");

export const getPayGrades = () => api.get("/hr/compensation/pay-grades");
export const createPayGrade = (payload) => api.post("/hr/compensation/pay-grades", payload);
export const updatePayGrade = (id, payload) => api.put(`/hr/compensation/pay-grades/${id}`, payload);
export const deletePayGrade = (id) => api.delete(`/hr/compensation/pay-grades/${id}`);

export const getSalaryStructures = (employeeId) =>
  api.get(`/hr/compensation/salary-structures${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createSalaryStructure = (payload) => api.post("/hr/compensation/salary-structures", payload);

export const getSalaryRevisions = (employeeId) =>
  api.get(`/hr/compensation/salary-revisions${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createSalaryRevision = (payload) => api.post("/hr/compensation/salary-revisions", payload);

export const getBonuses = (employeeId) =>
  api.get(`/hr/compensation/bonuses${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const getBonusById = (id) => api.get(`/hr/compensation/bonuses/${id}`);
export const createBonus = (payload) => api.post("/hr/compensation/bonuses", payload);
export const updateBonus = (id, payload) => api.put(`/hr/compensation/bonuses/${id}`, payload);
export const deleteBonus = (id) => api.delete(`/hr/compensation/bonuses/${id}`);

export const getIncentives = (employeeId) =>
  api.get(`/hr/compensation/incentives${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createIncentive = (payload) => api.post("/hr/compensation/incentives", payload);

export const getBenefits = (employeeId) =>
  api.get(`/hr/compensation/benefits${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createBenefit = (payload) => api.post("/hr/compensation/benefits", payload);

export const getAllowances = (employeeId) =>
  api.get(`/hr/compensation/allowances${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createAllowance = (payload) => api.post("/hr/compensation/allowances", payload);

export const getDeductions = (employeeId) =>
  api.get(`/hr/compensation/deductions${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const createDeduction = (payload) => api.post("/hr/compensation/deductions", payload);

export const getCompensationItemById = (id) => api.get(`/hr/compensations/${id}`);
export const updateCompensationItem = (id, payload) => api.put(`/hr/compensations/${id}`, payload);
export const deleteCompensationItem = (id) => api.delete(`/hr/compensations/${id}`);

export const getBenefitById = (id) => api.get(`/hr/compensation/benefits/${id}`);
export const updateBenefit = (id, payload) => api.put(`/hr/compensation/benefits/${id}`, payload);
export const deleteBenefit = (id) => api.delete(`/hr/compensation/benefits/${id}`);

export const getIncentiveById = (id) => api.get(`/hr/compensation/incentives/${id}`);
export const updateIncentive = (id, payload) => api.put(`/hr/compensation/incentives/${id}`, payload);
export const deleteIncentive = (id) => api.delete(`/hr/compensation/incentives/${id}`);

export const getAllowanceById = (id) => api.get(`/hr/compensation/allowances/${id}`);
export const updateAllowance = (id, payload) => api.put(`/hr/compensation/allowances/${id}`, payload);
export const deleteAllowance = (id) => api.delete(`/hr/compensation/allowances/${id}`);

export const getDeductionById = (id) => api.get(`/hr/compensation/deductions/${id}`);
export const updateDeduction = (id, payload) => api.put(`/hr/compensation/deductions/${id}`, payload);
export const deleteDeduction = (id) => api.delete(`/hr/compensation/deductions/${id}`);

export const updateSalaryStructure = (id, payload) => api.put(`/hr/compensation/salary-structures/${id}`, payload);
export const deleteSalaryStructure = (id) => api.delete(`/hr/compensation/salary-structures/${id}`);

export const updateSalaryRevision = (id, payload) => api.put(`/hr/compensation/salary-revisions/${id}`, payload);
export const deleteSalaryRevision = (id) => api.delete(`/hr/compensation/salary-revisions/${id}`);

// ── ENGAGEMENT SURVEY HELPERS ───────────────────────────────────────────────
export const getEngagementSurveys = (employeeId) =>
  api.get(`/hr/engagement${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const getEngagementSurveyById = (id) => api.get(`/hr/engagement/${id}`);
export const createEngagementSurvey = (payload) => api.post("/hr/engagement", payload);
export const updateEngagementSurvey = (id, payload) => api.put(`/hr/engagement/${id}`, payload);
export const deleteEngagementSurvey = (id) => api.delete(`/hr/engagement/${id}`);
export const getEngagementDashboard = () => api.get("/hr/engagement/dashboard");

// ── HR DASHBOARD STATS ──────────────────────────────────────────────────────
export const getHrDashboardStats = () => api.get("/hr/dashboard/stats");

// ── DEPARTMENT CRUD SPECIFIC ────────────────────────────────────────────────
export const getDepartmentById = (id) =>
  api.get(`/hr/departments/${id}`).then(data => ({ data }));
export const createDepartment = (payload) =>
  api.post("/hr/departments", payload).then(data => ({ data }));
export const updateDepartment = (id, payload) =>
  api.put(`/hr/departments/${id}`, payload).then(data => ({ data }));
export const deleteDepartment = (id) =>
  api.delete(`/hr/departments/${id}`).then(data => ({ data }));

// ── DESIGNATIONS CRUD SPECIFIC ──────────────────────────────────────────────
export const getDesignationById = (id) =>
  api.get(`/hr/designations/${id}`).then(data => ({ data }));
export const createDesignation = (payload) =>
  api.post("/hr/designations", payload).then(data => ({ data }));
export const updateDesignation = (id, payload) =>
  api.put(`/hr/designations/${id}`, payload).then(data => ({ data }));
export const deleteDesignation = (id) =>
  api.delete(`/hr/designations/${id}`).then(data => ({ data }));

// ── EMPLOYEE CRUD SPECIFIC ──────────────────────────────────────────────────
export const getEmployeeById = (id) => api.get(`/hr/employees/${id}`);
export const createEmployee = (payload) => api.post("/hr/employees", payload);
export const updateEmployee = (id, payload) => api.put(`/hr/employees/${id}`, payload);
export const deleteEmployee = (id) => api.delete(`/hr/employees/${id}`);

// ════════════════════════════════════════════════════════════════════════════
// ATTENDANCE
// ════════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────
export const getAttendanceDashboard = () => api.get("/hr/attendance/dashboard");

// ── Daily Records ──────────────────────────────────────────────────────────
export const getAttendanceRecords = (params = {}) => api.get("/hr/attendance/records", { params });
export const getAttendanceRecordById = (id) => api.get(`/hr/attendance/records/${id}`);
export const createAttendanceRecord = (payload) => api.post("/hr/attendance/records", payload);
export const updateAttendanceRecord = (id, payload) => api.put(`/hr/attendance/records/${id}`, payload);
export const deleteAttendanceRecord = (id) => api.delete(`/hr/attendance/records/${id}`);

// ── Clock In/Out ───────────────────────────────────────────────────────────
export const clockIn = (payload) => api.post("/hr/attendance/clock-in", payload);
export const clockOut = (id, payload) => api.post(`/hr/attendance/clock-out/${id}`, payload);
export const breakStart = (id, payload) => api.post(`/hr/attendance/break-start/${id}`, payload);
export const breakEnd = (id, payload) => api.post(`/hr/attendance/break-end/${id}`, payload);

// ── Regularization ─────────────────────────────────────────────────────────
export const getRegularizations = (params = {}) => api.get("/hr/attendance/regularizations", { params });
export const getRegularizationById = (id) => api.get(`/hr/attendance/regularizations/${id}`);
export const createRegularization = (payload) => api.post("/hr/attendance/regularizations", payload);
export const approveRegularizationManager = (id, payload) => api.put(`/hr/attendance/regularizations/${id}/approve-manager`, payload);
export const approveRegularizationHR = (id, payload) => api.put(`/hr/attendance/regularizations/${id}/approve-hr`, payload);
export const rejectRegularization = (id, payload) => api.put(`/hr/attendance/regularizations/${id}/reject`, payload);
export const cancelRegularization = (id) => api.put(`/hr/attendance/regularizations/${id}/cancel`);

// ── Policies ───────────────────────────────────────────────────────────────
export const getAttendancePolicies = (params = {}) => api.get("/hr/attendance/policies", { params });
export const getAttendancePolicyById = (id) => api.get(`/hr/attendance/policies/${id}`);
export const createAttendancePolicy = (payload) => api.post("/hr/attendance/policies", payload);
export const updateAttendancePolicy = (id, payload) => api.put(`/hr/attendance/policies/${id}`, payload);
export const deleteAttendancePolicy = (id) => api.delete(`/hr/attendance/policies/${id}`);

// ── Shifts ─────────────────────────────────────────────────────────────────
export const getShifts = (params = {}) => api.get("/hr/attendance/shifts", { params });
export const getShiftById = (id) => api.get(`/hr/attendance/shifts/${id}`);
export const createShift = (payload) => api.post("/hr/attendance/shifts", payload);
export const updateShift = (id, payload) => api.put(`/hr/attendance/shifts/${id}`, payload);
export const deleteShift = (id) => api.delete(`/hr/attendance/shifts/${id}`);

// ── Shift Rosters ──────────────────────────────────────────────────────────
export const getRosters = (params = {}) => api.get("/hr/attendance/rosters", { params });
export const createRoster = (payload) => api.post("/hr/attendance/rosters", payload);
export const bulkCreateRosters = (payload) => api.post("/hr/attendance/rosters/bulk", payload);
export const deleteRoster = (id) => api.delete(`/hr/attendance/rosters/${id}`);

// ── My Attendance ──────────────────────────────────────────────────────────
export const getMyAttendance = (params = {}) => api.get("/hr/attendance/my-attendance", { params });
export const getEmployeeAttendanceSummary = (employeeId, params = {}) => api.get(`/hr/attendance/employee/${employeeId}/summary`, { params });
export const getEmployeeAttendanceHistory = (employeeId, params = {}) => api.get(`/hr/attendance/employee/${employeeId}/history`, { params });
export const getEmployeeAttendanceScore = (employeeId) => api.get(`/hr/attendance/employee/${employeeId}/score`);

// ── Biometric ──────────────────────────────────────────────────────────────
export const getBiometricDevices = () => api.get("/hr/attendance/biometric/devices");
export const createBiometricDevice = (payload) => api.post("/hr/attendance/biometric/devices", payload);
export const updateBiometricDevice = (id, payload) => api.put(`/hr/attendance/biometric/devices/${id}`, payload);
export const deleteBiometricDevice = (id) => api.delete(`/hr/attendance/biometric/devices/${id}`);
export const syncBiometricLogs = (payload) => api.post("/hr/attendance/biometric/sync", payload);
export const importBiometricLogs = (payload) => api.post("/hr/attendance/biometric/import", payload);
export const checkBiometricDeviceHealth = (id) => api.get(`/hr/attendance/biometric/device-health/${id}`);

// ── Geofencing ─────────────────────────────────────────────────────────────
export const getGeofenceLocations = () => api.get("/hr/attendance/geofencing");
export const getGeofenceLocationById = (id) => api.get(`/hr/attendance/geofencing/${id}`);
export const createGeofenceLocation = (payload) => api.post("/hr/attendance/geofencing", payload);
export const updateGeofenceLocation = (id, payload) => api.put(`/hr/attendance/geofencing/${id}`, payload);
export const deleteGeofenceLocation = (id) => api.delete(`/hr/attendance/geofencing/${id}`);

// ── Overtime ───────────────────────────────────────────────────────────────
export const getOvertimeRequests = (params = {}) => api.get("/hr/attendance/overtime", { params });
export const getOvertimeRequestById = (id) => api.get(`/hr/attendance/overtime/${id}`);
export const createOvertimeRequest = (payload) => api.post("/hr/attendance/overtime", payload);
export const approveOvertimeRequest = (id, payload) => api.put(`/hr/attendance/overtime/${id}/approve`, payload);
export const rejectOvertimeRequest = (id, payload) => api.put(`/hr/attendance/overtime/${id}/reject`, payload);
export const getOvertimeReports = (params = {}) => api.get("/hr/attendance/overtime/reports", { params });

// ── Exceptions ─────────────────────────────────────────────────────────────
export const getAttendanceExceptions = (params = {}) => api.get("/hr/attendance/exceptions", { params });
export const getAttendanceExceptionById = (id) => api.get(`/hr/attendance/exceptions/${id}`);
export const createAttendanceException = (payload) => api.post("/hr/attendance/exceptions", payload);
export const resolveAttendanceException = (id, payload) => api.put(`/hr/attendance/exceptions/${id}/resolve`, payload);
export const escalateAttendanceException = (id, payload) => api.put(`/hr/attendance/exceptions/${id}/escalate`, payload);

// ── Holidays ───────────────────────────────────────────────────────────────
export const getHolidays = (params = {}) => api.get("/hr/attendance/holidays", { params });
export const getHolidayById = (id) => api.get(`/hr/attendance/holidays/${id}`);
export const createHoliday = (payload) => api.post("/hr/attendance/holidays", payload);
export const updateHoliday = (id, payload) => api.put(`/hr/attendance/holidays/${id}`, payload);
export const deleteHoliday = (id) => api.delete(`/hr/attendance/holidays/${id}`);
export const importHolidays = (payload) => api.post("/hr/attendance/holidays/import", payload);

// ── Weekend Config ─────────────────────────────────────────────────────────
export const getWeekendConfigs = () => api.get("/hr/attendance/weekends");
export const createWeekendConfig = (payload) => api.post("/hr/attendance/weekends", payload);
export const updateWeekendConfig = (id, payload) => api.put(`/hr/attendance/weekends/${id}`, payload);
export const deleteWeekendConfig = (id) => api.delete(`/hr/attendance/weekends/${id}`);

// ── Audit Logs ─────────────────────────────────────────────────────────────
export const getAttendanceAuditLogs = (params = {}) => api.get("/hr/attendance/audit-logs", { params });

// ── Reports ────────────────────────────────────────────────────────────────
export const getDailyReport = (params = {}) => api.get("/hr/attendance/reports/daily", { params });
export const getMonthlyReport = (params = {}) => api.get("/hr/attendance/reports/monthly", { params });
export const getDepartmentReport = (params = {}) => api.get("/hr/attendance/reports/department", { params });
export const getShiftReport = (params = {}) => api.get("/hr/attendance/reports/shift", { params });
export const getLateArrivalReport = (params = {}) => api.get("/hr/attendance/reports/late-arrivals", { params });
export const getOvertimeReport = (params = {}) => api.get("/hr/attendance/reports/overtime", { params });
export const getAbsenteeReport = (params = {}) => api.get("/hr/attendance/reports/absentee", { params });
export const getAttendanceComplianceReport = (params = {}) => api.get("/hr/attendance/reports/compliance", { params });

// ── Analytics ──────────────────────────────────────────────────────────────
export const getAttendanceTrends = (params = {}) => api.get("/hr/attendance/analytics/trends", { params });
export const getDepartmentAnalysis = (params = {}) => api.get("/hr/attendance/analytics/department", { params });
export const getOvertimeAnalytics = (params = {}) => api.get("/hr/attendance/analytics/overtime", { params });
export const getShiftEfficiency = (params = {}) => api.get("/hr/attendance/analytics/shift-efficiency", { params });

// ── Exports ────────────────────────────────────────────────────────────────
export async function exportAttendanceCsv(params = {}) {
  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const response = await fetch(`/api/hr/attendance/export/csv${queryString ? `?${queryString}` : ""}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_export.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportAttendanceExcel(params = {}) {
  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const response = await fetch(`/api/hr/attendance/export/excel${queryString ? `?${queryString}` : ""}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_export.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
}

// ── LEAVE CRUD SPECIFIC ─────────────────────────────────────────────────────
export const createLeaveRequest = (payload) => api.post("/hr/leaves", payload);
export const getLeaveRequests = (employeeId) =>
  api.get(`/hr/leaves${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const reviewLeaveRequest = (id, payload) => api.put(`/hr/leaves/${id}/review`, payload);

// ── WORKFORCE PLANNING SPECIFIC ─────────────────────────────────────────────
export const getWorkforcePlans = () => api.get("/hr/workforce-planning");
export const createWorkforcePlan = (payload) => api.post("/hr/workforce-planning", payload);
export const getWorkforceSummary = () => api.get("/hr/workforce/summary");

// ── COMPLIANCE & RISK AUDITS ────────────────────────────────────────────────
export const getComplianceDashboard = () => api.get("/hr/compliance/dashboard");
export const getComplianceReport = () => api.get("/hr/compliance/reports");

export const getPolicies = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/policies${query ? `?${query}` : ""}`);
};
export const getPolicyById = (id) => api.get(`/hr/compliance/policies/${id}`);
export const createPolicy = (payload) => api.post("/hr/compliance/policies", payload);
export const updatePolicy = (id, payload) => api.put(`/hr/compliance/policies/${id}`, payload);
export const deletePolicy = (id) => api.delete(`/hr/compliance/policies/${id}`);

export const getAcknowledgements = (employeeId, policyId) => {
  const params = [];
  if (employeeId) params.push(`employee_id=${employeeId}`);
  if (policyId) params.push(`policy_id=${policyId}`);
  return api.get(`/hr/compliance/acknowledgements${params.length ? `?${params.join("&")}` : ""}`);
};
export const createAcknowledgement = (payload) => api.post("/hr/compliance/acknowledgements", payload);

export const getAudits = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/audits${query ? `?${query}` : ""}`);
};
export const getAuditById = (id) => api.get(`/hr/compliance/audits/${id}`);
export const createAudit = (payload) => api.post("/hr/compliance/audits", payload);
export const updateAudit = (id, payload) => api.put(`/hr/compliance/audits/${id}`, payload);
export const deleteAudit = (id) => api.delete(`/hr/compliance/audits/${id}`);

export const getRegulatoryRequirements = () => api.get("/hr/compliance/regulations");
export const createRegulatoryRequirement = (payload) => api.post("/hr/compliance/regulations", payload);

export const getRiskAssessments = (status) =>
  api.get(`/hr/compliance/risks${status ? `?status=${status}` : ""}`);
export const getRiskAssessmentById = (id) => api.get(`/hr/compliance/risks/${id}`);
export const createRiskAssessment = (payload) => api.post("/hr/compliance/risks", payload);
export const updateRiskAssessment = (id, payload) => api.put(`/hr/compliance/risks/${id}`, payload);
export const deleteRiskAssessment = (id) => api.delete(`/hr/compliance/risks/${id}`);

export const getComplianceViolations = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return api.get(`/hr/compliance/violations${query ? `?${query}` : ""}`);
};
export const getComplianceViolationById = (id) => api.get(`/hr/compliance/violations/${id}`);
export const createComplianceViolation = (payload) => api.post("/hr/compliance/violations", payload);
export const updateComplianceViolation = (id, payload) => api.put(`/hr/compliance/violations/${id}`, payload);
export const deleteComplianceViolation = (id) => api.delete(`/hr/compliance/violations/${id}`);

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

// ── DOCUMENTS ──────────────────────────────────────────────────────────────
// NOTE: api.js uses raw fetch and resolves to the parsed JSON body directly
// (not an axios-style { data, status, headers } envelope). Every document
// component (employee-documents.jsx, company-documents.jsx, dashboard.jsx,
// approvals.jsx, settings.jsx) was written expecting `res.data`, so we wrap
// the result here to match that shape without having to touch 5 files.

// Get all documents
export const getDocuments = () =>
  api.get("/hr/documents").then(data => ({ data }));

// Upload a new document (using FormData)
export const uploadDocument = (formData) =>
  api.post("/hr/documents/upload", formData).then(data => ({ data }));

// Delete a document
export const deleteDocument = (documentId) =>
  api.delete(`/hr/documents/${documentId}`).then(data => ({ data }));

// Update document status (Approve, Reject, Expire)
export const updateDocumentStatus = (documentId, newStatus) =>
  api.patch(`/hr/documents/${documentId}/status`, { status: newStatus }).then(data => ({ data }));

// Edit/Update document metadata
export const updateDocument = (documentId, updateData) =>
  api.put(`/hr/documents/${documentId}`, updateData).then(data => ({ data }));