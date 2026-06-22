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

export const getCurrentUser = () => api.get("/auth/me");
export const getOverview = () => fetchList("overview");
export const getAttendance = () => fetchList("attendance");
export const getLeave = () => api.get("/hr/leaves");
export const getWorkforce = () => fetchList("workforce");
export const getCompensation = () => fetchList("compensation");
export const getCompensationDashboard = () => api.get("/hr/compensation/dashboard");
export const getPayGrades = () => fetchList("compensation/pay-grades");
export const getCompensationBands = () => fetchList("compensation/bands");
export const getSalaryComponents = () => fetchList("compensation/salary-components");
export const getSalaryStructures = () => fetchList("compensation/salary-structures");
export const getStructureComponents = (id) => api.get(`/hr/compensation/salary-structures/${id}/components`);
export const getEmployeeCompensation = (employeeId) => api.get(`/hr/compensation/employee-compensation${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getSalaryRevisions = () => fetchList("compensation/revisions");
export const getAllowances = () => fetchList("compensation/allowances");
export const getBenefits = () => fetchList("compensation/benefits");
export const getEmployeeBenefits = () => fetchList("compensation/employee-benefits");

export const updateSalaryRevision = (id, payload) => api.put(`/hr/compensation/salary-revisions/${id}`, payload);
export const deleteSalaryRevision = (id) => api.delete(`/hr/compensation/salary-revisions/${id}`);

export const createPayGrade = (payload) => api.post("/hr/compensation/pay-grades", payload);
export const updatePayGrade = (id, payload) => api.put(`/hr/compensation/pay-grades/${id}`, payload);
export const deletePayGrade = (id) => api.delete(`/hr/compensation/pay-grades/${id}`);

export const createCompensationBand = (payload) => api.post("/hr/compensation/bands", payload);
export const updateCompensationBand = (id, payload) => api.put(`/hr/compensation/bands/${id}`, payload);
export const deleteCompensationBand = (id) => api.delete(`/hr/compensation/bands/${id}`);

export const createSalaryComponent = (payload) => api.post("/hr/compensation/salary-components", payload);
export const updateSalaryComponent = (id, payload) => api.put(`/hr/compensation/salary-components/${id}`, payload);
export const deleteSalaryComponent = (id) => api.delete(`/hr/compensation/salary-components/${id}`);

export const createSalaryStructure = (payload) => api.post("/hr/compensation/salary-structures", payload);
export const updateSalaryStructure = (id, payload) => api.put(`/hr/compensation/salary-structures/${id}`, payload);
export const deleteSalaryStructure = (id) => api.delete(`/hr/compensation/salary-structures/${id}`);

export const addStructureComponent = (id, payload) => api.post(`/hr/compensation/salary-structures/${id}/components`, payload);
export const deleteStructureComponent = (id, compId) => api.delete(`/hr/compensation/salary-structures/${id}/components/${compId}`);

export const createEmployeeCompensation = (payload) => api.post("/hr/compensation/employee-compensation", payload);
export const updateEmployeeCompensation = (id, payload) => api.put(`/hr/compensation/employee-compensation/${id}`, payload);
export const deleteEmployeeCompensation = (id) => api.delete(`/hr/compensation/employee-compensation/${id}`);

export const createSalaryRevision = (payload) => api.post("/hr/compensation/revisions", payload);

export const createAllowance = (payload) => api.post("/hr/compensation/allowances", payload);
export const updateAllowance = (id, payload) => api.put(`/hr/compensation/allowances/${id}`, payload);
export const deleteAllowance = (id) => api.delete(`/hr/compensation/allowances/${id}`);

export const createBenefit = (payload) => api.post("/hr/compensation/benefits", payload);
export const updateBenefit = (id, payload) => api.put(`/hr/compensation/benefits/${id}`, payload);
export const deleteBenefit = (id) => api.delete(`/hr/compensation/benefits/${id}`);

export const createEmployeeBenefit = (payload) => api.post("/hr/compensation/employee-benefits", payload);
export const deleteEmployeeBenefit = (id) => api.delete(`/hr/compensation/employee-benefits/${id}`);
export const getPayrollSummary = () => fetchList("payrollSummary");
export const getLearning = () => fetchList("learning");

// NOTE: getDepartments/getDesignations are intentionally NOT built on
// fetchList() — api.js uses raw fetch and resolves to the parsed JSON body
// directly (no axios-style { data } envelope). Components consuming these
// expect `res.data`, so we wrap the result here. See DEPARTMENT/DESIGNATION
// CRUD SPECIFIC section below for the matching create/update/delete wraps.
export const getDepartments = () => api.get("/hr/departments").then(data => ({ data }));
export const getDesignations = () => api.get("/hr/designations").then(data => ({ data }));

// ════════════════════════════════════════════════════════════════════════════
// RECRUITMENT MODULE
// ════════════════════════════════════════════════════════════════════════════
export const getRecruitmentDashboard = () => api.get("/hr/recruitment/dashboard");

export const getRequisitions = (params = {}) => api.get("/hr/recruitment/requisitions", { params });
export const getRequisitionById = (id) => api.get(`/hr/recruitment/requisitions/${id}`);
export const createRequisition = (payload) => api.post("/hr/recruitment/requisitions", payload);
export const updateRequisition = (id, payload) => api.put(`/hr/recruitment/requisitions/${id}`, payload);
export const deleteRequisition = (id) => api.delete(`/hr/recruitment/requisitions/${id}`);
export const approveRequisition = (id) => api.put(`/hr/recruitment/requisitions/${id}/approve`);
export const rejectRequisition = (id) => api.put(`/hr/recruitment/requisitions/${id}/reject`);

export const getCandidates = (params = {}) => api.get("/hr/recruitment/candidates", { params });
export const getCandidateById = (id) => api.get(`/hr/recruitment/candidates/${id}`);
export const createCandidate = (payload) => api.post("/hr/recruitment/candidates", payload);
export const updateCandidate = (id, payload) => api.put(`/hr/recruitment/candidates/${id}`, payload);
export const deleteCandidate = (id) => api.delete(`/hr/recruitment/candidates/${id}`);
export const updateCandidateStatus = (id, payload) => api.put(`/hr/recruitment/candidates/${id}/status`, payload);

export const getInterviews = (params = {}) => api.get("/hr/recruitment/interviews", { params });
export const getInterviewById = (id) => api.get(`/hr/recruitment/interviews/${id}`);
export const createInterview = (payload) => api.post("/hr/recruitment/interviews", payload);
export const updateInterview = (id, payload) => api.put(`/hr/recruitment/interviews/${id}`, payload);
export const deleteInterview = (id) => api.delete(`/hr/recruitment/interviews/${id}`);
export const updateInterviewFeedback = (id, payload) => api.put(`/hr/recruitment/interviews/${id}/feedback`, payload);

export const getOffers = (params = {}) => api.get("/hr/recruitment/offers", { params });
export const getOfferById = (id) => api.get(`/hr/recruitment/offers/${id}`);
export const createOffer = (payload) => api.post("/hr/recruitment/offers", payload);
export const updateOffer = (id, payload) => api.put(`/hr/recruitment/offers/${id}`, payload);
export const deleteOffer = (id) => api.delete(`/hr/recruitment/offers/${id}`);
export const acceptOffer = (id) => api.put(`/hr/recruitment/offers/${id}/accept`);
export const rejectOffer = (id) => api.put(`/hr/recruitment/offers/${id}/reject`);
export const withdrawOffer = (id) => api.put(`/hr/recruitment/offers/${id}/withdraw`);

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

export const getPerformanceAppraisals = (employeeId) => api.get(`/hr/performance/appraisals${employeeId ? `?employee_id=${employeeId}` : ''}`);
export const getPerformanceAppraisalById = (id) => api.get(`/hr/performance/appraisals/${id}`);
export const createPerformanceAppraisal = (payload) => api.post("/hr/performance/appraisals", payload);
export const updatePerformanceAppraisal = (id, payload) => api.put(`/hr/performance/appraisals/${id}`, payload);
export const deletePerformanceAppraisal = (id) => api.delete(`/hr/performance/appraisals/${id}`);

export const getPerformanceAnalytics = () => api.get("/hr/performance/analytics");

// ── COMPENSATION & BENEFITS HELPERS ─────────────────────────────────────────
// Compensation Dashboard, PayGrades, Bands, Components, Structures, EmployeeCompensation,
// Revisions, Allowances, Benefits, EmployeeBenefits are exported at top of file (lines 17-63)

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
// ATTENDANCE MODULE
// ════════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────
export const getAttendanceDashboard = () => api.get("/hr/attendance/dashboard");

// ── Attendance Records ────────────────────────────────────────────────────
export const getAttendanceRecords = (params = {}) => api.get("/hr/attendance/records", { params });
export const getAttendanceRecordById = (id) => api.get(`/hr/attendance/records/${id}`);
export const createAttendanceRecord = (payload) => api.post("/hr/attendance/records", payload);
export const updateAttendanceRecord = (id, payload) => api.put(`/hr/attendance/records/${id}`, payload);
export const deleteAttendanceRecord = (id) => api.delete(`/hr/attendance/records/${id}`);

// ── Shifts ────────────────────────────────────────────────────────────────
export const getShifts = (params = {}) => api.get("/hr/attendance/shifts", { params });
export const getShiftById = (id) => api.get(`/hr/attendance/shifts/${id}`);
export const createShift = (payload) => api.post("/hr/attendance/shifts", payload);
export const updateShift = (id, payload) => api.put(`/hr/attendance/shifts/${id}`, payload);
export const deleteShift = (id) => api.delete(`/hr/attendance/shifts/${id}`);

// ── Shift Rosters ─────────────────────────────────────────────────────────
export const getShiftRosters = (params = {}) => api.get("/hr/attendance/shifts/rosters", { params });
export const createShiftRoster = (payload) => api.post("/hr/attendance/shifts/rosters", payload);
export const deleteShiftRoster = (id) => api.delete(`/hr/attendance/shifts/rosters/${id}`);

// ── Holidays ──────────────────────────────────────────────────────────────
export const getHolidays = (params = {}) => api.get("/hr/attendance/holidays", { params });
export const getHolidayById = (id) => api.get(`/hr/attendance/holidays/${id}`);
export const createHoliday = (payload) => api.post("/hr/attendance/holidays", payload);
export const updateHoliday = (id, payload) => api.put(`/hr/attendance/holidays/${id}`, payload);
export const deleteHoliday = (id) => api.delete(`/hr/attendance/holidays/${id}`);
export const importHolidays = (payload) => api.post("/hr/attendance/holidays/import", payload);

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

// ── Analytics ─────────────────────────────────────────────────────────────
export const getAttendanceAnalytics = (params = {}) => api.get("/hr/attendance/analytics", { params });
export const getAttendanceTrends = (params = {}) => api.get("/hr/attendance/analytics/trends", { params });
export const getDepartmentAnalysis = (params = {}) => api.get("/hr/attendance/analytics/department", { params });
export const getOvertimeAnalytics = (params = {}) => api.get("/hr/attendance/analytics/overtime", { params });
export const getShiftEfficiency = (params = {}) => api.get("/hr/attendance/analytics/shift-efficiency", { params });

// ── LEAVE CRUD SPECIFIC ─────────────────────────────────────────────────────
export const createLeaveRequest = (payload) => api.post("/hr/leaves", payload);
export const getLeaveRequests = (employeeId, params = {}) => {
  const query = new URLSearchParams();
  if (employeeId) query.set("employee_id", employeeId);
  if (params.status) query.set("status", params.status);
  if (params.leave_type) query.set("leave_type", params.leave_type);
  if (params.start_date) query.set("start_date", params.start_date);
  if (params.end_date) query.set("end_date", params.end_date);
  const qs = query.toString();
  return api.get(`/hr/leaves${qs ? `?${qs}` : ""}`);
};
export const getLeaveRequest = (id) => api.get(`/hr/leaves/${id}`);
export const updateLeaveRequest = (id, payload) => api.put(`/hr/leaves/${id}`, payload);
export const deleteLeaveRequest = (id) => api.delete(`/hr/leaves/${id}`);
export const reviewLeaveRequest = (id, payload) => api.put(`/hr/leaves/${id}/review`, payload);
export const getLeaveDashboard = () => api.get("/hr/leaves/dashboard");
export const getLeaveCalendar = (params = {}) => {
  const query = new URLSearchParams();
  if (params.year) query.set("year", params.year);
  if (params.month) query.set("month", params.month);
  const qs = query.toString();
  return api.get(`/hr/leaves/calendar${qs ? `?${qs}` : ""}`);
};
export const getLeaveStatistics = () => api.get("/hr/leaves/statistics");
export const getLeaveTypeConfigs = () => api.get("/hr/leaves/type-configs");
export const createLeaveTypeConfig = (payload) => api.post("/hr/leaves/type-configs", payload);
export const updateLeaveTypeConfig = (id, payload) => api.put(`/hr/leaves/type-configs/${id}`, payload);
export const deleteLeaveTypeConfig = (id) => api.delete(`/hr/leaves/type-configs/${id}`);
export const getLeaveBalances = (employeeId) =>
  api.get(`/hr/leaves/balance${employeeId ? `?employee_id=${employeeId}` : ""}`);
export const updateLeaveBalance = (id, payload) => api.put(`/hr/leaves/balance/${id}`, payload);
export const initLeaveBalances = (employeeId, year) =>
  api.post(`/hr/leaves/balance/init?employee_id=${employeeId}&year=${year}`);
export const getLeaveSettings = () => api.get("/hr/leaves/settings");
export const updateLeaveSettings = (payload) => api.put("/hr/leaves/settings", payload);

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