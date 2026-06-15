import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingTrainingPaths,
  createOnboardingTrainingPath,
  updateOnboardingTrainingPath,
  deleteOnboardingTrainingPath,
  getOnboardingTrainingAssignments,
  createOnboardingTrainingAssignment,
  updateOnboardingTrainingAssignment,
  deleteOnboardingTrainingAssignment,
  getOnboardingCertifications,
  createOnboardingCertification,
  updateOnboardingCertification,
  deleteOnboardingCertification,
  getOnboardingRecords,
} from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/onboarding" },
  { label: "New Hires", href: "/zoiko-hr/onboarding/new-hires" },
  { label: "Pre-Onboarding", href: "/zoiko-hr/onboarding/pre-onboarding" },
  { label: "Documents", href: "/zoiko-hr/onboarding/documents" },
  { label: "Checklists", href: "/zoiko-hr/onboarding/checklists" },
  { label: "Dept Assignment", href: "/zoiko-hr/onboarding/department-assignment" },
  { label: "Manager Assignment", href: "/zoiko-hr/onboarding/manager-assignment" },
  { label: "Assets & Access", href: "/zoiko-hr/onboarding/assets-access" },
  { label: "Orientation", href: "/zoiko-hr/onboarding/orientation" },
  { label: "Training", href: "/zoiko-hr/onboarding/training" },
  { label: "Progress", href: "/zoiko-hr/onboarding/progress" },
  { label: "Reports", href: "/zoiko-hr/onboarding/reports" },
  { label: "Settings", href: "/zoiko-hr/onboarding/settings" },
];

const TRAINING_TYPES = ["mandatory", "elective", "certification"];

const TYPE_COLORS = {
  mandatory: "bg-red-100 text-red-700",
  elective: "bg-blue-100 text-blue-700",
  certification: "bg-purple-100 text-purple-700",
};

const CERT_STATUSES = ["not_attempted", "in_progress", "passed", "failed"];

const STATUS_COLORS = {
  not_attempted: "bg-gray-100 text-gray-600",
  in_progress: "bg-yellow-100 text-yellow-800",
  passed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

function OnboardingSubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/onboarding"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function OnboardingTraining() {
  const [activeTab, setActiveTab] = useState("training");
  const [typeFilter, setTypeFilter] = useState("");

  const [paths, setPaths] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: "", text: "" });

  const [showForm, setShowForm] = useState(false);
  const [editingPath, setEditingPath] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("mandatory");
  const [saving, setSaving] = useState(false);

  const [assigningTo, setAssigningTo] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [expandedPath, setExpandedPath] = useState(null);

  const [certRecordFilter, setCertRecordFilter] = useState("");
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certStatus, setCertStatus] = useState("not_attempted");
  const [certDate, setCertDate] = useState("");
  const [savingCert, setSavingCert] = useState(false);

  const showAction = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: "", text: "" }), 4000);
  };

  const fetchPaths = async () => {
    try {
      const data = await getOnboardingTrainingPaths(typeFilter || undefined);
      setPaths(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load training paths");
      setPaths([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await getOnboardingTrainingAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      setAssignments([]);
    }
  };

  const fetchCertifications = async (recordId) => {
    try {
      const data = await getOnboardingCertifications(recordId || undefined);
      setCertifications(Array.isArray(data) ? data : []);
    } catch {
      setCertifications([]);
    }
  };

  const fetchRecords = async () => {
    try {
      const data = await getOnboardingRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchPaths(), fetchAssignments(), fetchRecords()]);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "training") {
      fetchAll();
    } else {
      fetchRecords();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "training") {
      fetchPaths();
    }
  }, [typeFilter]);

  useEffect(() => {
    if (activeTab === "certifications" && certRecordFilter) {
      fetchCertifications(certRecordFilter);
    } else if (activeTab === "certifications") {
      setCertifications([]);
    }
  }, [activeTab, certRecordFilter]);

  const resetForm = () => {
    setShowForm(false);
    setEditingPath(null);
    setFormName("");
    setFormDescription("");
    setFormType("mandatory");
  };

  const handleEdit = (path) => {
    setEditingPath(path);
    setFormName(path.name || "");
    setFormDescription(path.description || "");
    setFormType(path.training_type || path.type || "mandatory");
    setShowForm(true);
  };

  const handleSavePath = async () => {
    if (!formName.trim()) {
      showAction("error", "Training path name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        training_type: formType,
      };
      if (editingPath) {
        await updateOnboardingTrainingPath(editingPath.id, payload);
        showAction("success", "Training path updated");
      } else {
        await createOnboardingTrainingPath(payload);
        showAction("success", "Training path created");
      }
      resetForm();
      await fetchPaths();
    } catch (err) {
      showAction("error", err.message || "Failed to save training path");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePath = async (pathId) => {
    if (!window.confirm("Delete this training path?")) return;
    try {
      await deleteOnboardingTrainingPath(pathId);
      showAction("success", "Training path deleted");
      await fetchPaths();
    } catch (err) {
      showAction("error", err.message || "Failed to delete training path");
    }
  };

  const handleAssign = async () => {
    if (!selectedRecord || !assigningTo) return;
    setAssigning(true);
    try {
      await createOnboardingTrainingAssignment({
        onboarding_record_id: Number(selectedRecord),
        training_path_id: assigningTo,
      });
      showAction("success", "Training assigned");
      setAssigningTo(null);
      setSelectedRecord("");
      await fetchAssignments();
    } catch (err) {
      showAction("error", err.message || "Failed to assign training");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (assignmentId) => {
    try {
      await deleteOnboardingTrainingAssignment(assignmentId);
      showAction("success", "Assignment removed");
      await fetchAssignments();
    } catch (err) {
      showAction("error", err.message || "Failed to remove assignment");
    }
  };

  const handleUpdateProgress = async (assignment) => {
    const newPct = prompt(
      "Enter progress percentage (0-100):",
      assignment.progress_percentage || assignment.progressPercentage || 0
    );
    if (newPct === null) return;
    const pct = parseInt(newPct, 10);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      showAction("error", "Progress must be between 0 and 100");
      return;
    }
    try {
      await updateOnboardingTrainingAssignment(assignment.id, {
        progress_percentage: pct,
      });
      showAction("success", "Progress updated");
      await fetchAssignments();
    } catch (err) {
      showAction("error", err.message || "Failed to update progress");
    }
  };

  const getAssignmentsForPath = (pathId) => {
    return assignments.filter(
      (a) =>
        a.training_path_id === pathId ||
        a.trainingPathId === pathId ||
        a.training_path_id === Number(pathId)
    );
  };

  const getRecordName = (recordId) => {
    const rec = records.find(
      (r) => r.id === recordId || r.id === Number(recordId)
    );
    return rec
      ? rec.candidate_name || rec.name || `Record #${recordId}`
      : `Record #${recordId}`;
  };

  const resetCertForm = () => {
    setShowCertForm(false);
    setEditingCert(null);
    setCertName("");
    setCertIssuer("");
    setCertStatus("not_attempted");
    setCertDate("");
  };

  const handleEditCert = (cert) => {
    setEditingCert(cert);
    setCertName(cert.name || cert.certification_name || "");
    setCertIssuer(cert.issuer || "");
    setCertStatus(cert.status || "not_attempted");
    setCertDate(cert.completion_date || cert.date || "");
    setShowCertForm(true);
  };

  const handleSaveCert = async () => {
    if (!certName.trim()) {
      showAction("error", "Certification name is required");
      return;
    }
    if (!certRecordFilter) {
      showAction("error", "Select an onboarding record first");
      return;
    }
    setSavingCert(true);
    try {
      const payload = {
        onboarding_record_id: Number(certRecordFilter),
        certification_name: certName.trim(),
        issuer: certIssuer.trim() || undefined,
        status: certStatus,
        completion_date: certDate || undefined,
      };
      if (editingCert) {
        await updateOnboardingCertification(editingCert.id, payload);
        showAction("success", "Certification updated");
      } else {
        await createOnboardingCertification(payload);
        showAction("success", "Certification added");
      }
      resetCertForm();
      await fetchCertifications(certRecordFilter);
    } catch (err) {
      showAction("error", err.message || "Failed to save certification");
    } finally {
      setSavingCert(false);
    }
  };

  const handleDeleteCert = async (certId) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await deleteOnboardingCertification(certId);
      showAction("success", "Certification deleted");
      await fetchCertifications(certRecordFilter);
    } catch (err) {
      showAction("error", err.message || "Failed to delete certification");
    }
  };

  if (loading && paths.length === 0 && activeTab === "training") {
    return (
      <HRPage
        title="Training & Certifications"
        subtitle="Manage training paths and certifications for onboarding."
      >
        <OnboardingSubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage
      title="Training & Certifications"
      subtitle="Manage training paths and certifications for onboarding."
    >
      <OnboardingSubNav />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {actionMsg.text && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg flex justify-between items-center ${
            actionMsg.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            onClick={() => setActionMsg({ type: "", text: "" })}
            className="font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("training")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "training"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Training
        </button>
        <button
          onClick={() => setActiveTab("certifications")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "certifications"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Certifications
        </button>
      </div>

      {/* === TRAINING TAB === */}
      {activeTab === "training" && (
        <div>
          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setTypeFilter("")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                !typeFilter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {TRAINING_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  typeFilter === t
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {paths.length} training path{paths.length !== 1 ? "s" : ""}
              {typeFilter ? ` (${typeFilter})` : ""}
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + New Path
            </button>
          </div>

          {/* Paths List */}
          {paths.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">
                No training paths{typeFilter ? ` of type "${typeFilter}"` : ""}{" "}
                yet.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Click "+ New Path" to create one.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paths.map((path) => {
                const pathId = path.id || path._id;
                const pathAssignments = getAssignmentsForPath(pathId);
                const actualType = path.training_type || path.type || "mandatory";
                const isExpanded = expandedPath === pathId;

                return (
                  <div
                    key={pathId}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-800 truncate">
                            {path.name}
                          </h3>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              TYPE_COLORS[actualType] || "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {actualType}
                          </span>
                        </div>
                        {path.description && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            {path.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                          <span>
                            {pathAssignments.length} assignment
                            {pathAssignments.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAssigningTo(pathId)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleEdit(path)}
                          className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePath(pathId)}
                          className="text-red-400 hover:text-red-600 text-xs px-2 py-1"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            setExpandedPath(isExpanded ? null : pathId)
                          }
                          className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1"
                        >
                          {isExpanded ? "\u25BC" : "\u25B6"}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                        <div className="px-5 py-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Assignments & Progress
                          </h4>
                          {pathAssignments.length === 0 ? (
                            <p className="text-xs text-gray-400">
                              Not yet assigned.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {pathAssignments.map((assn) => {
                                const pct =
                                  assn.progress_percentage ??
                                  assn.progressPercentage ??
                                  0;
                                return (
                                  <div
                                    key={assn.id}
                                    className="bg-gray-50 rounded-lg p-3"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-medium text-gray-800">
                                        {getRecordName(
                                          assn.onboarding_record_id ||
                                            assn.onboardingRecordId
                                        )}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            handleUpdateProgress(assn)
                                          }
                                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                        >
                                          Set Progress
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleUnassign(assn.id)
                                          }
                                          className="text-red-400 hover:text-red-600 text-xs"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="inline-block w-full h-2 rounded-full bg-gray-200 overflow-hidden flex-1">
                                        <span
                                          className={`block h-full rounded-full ${
                                            pct === 100
                                              ? "bg-green-500"
                                              : "bg-blue-500"
                                          }`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </span>
                                      <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {pct}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Create/Edit Path Modal */}
          {showForm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
              onClick={resetForm}
            >
              <div
                className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {editingPath ? "Edit Training Path" : "New Training Path"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Path Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Security Awareness Training"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief description of this training path..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TRAINING_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePath}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  >
                    {saving
                      ? "Saving..."
                      : editingPath
                      ? "Update Path"
                      : "Create Path"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assign Modal */}
          {assigningTo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
              onClick={() => setAssigningTo(null)}
            >
              <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Assign Training Path
                  </h3>
                  <button
                    onClick={() => setAssigningTo(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    Select an onboarding record to assign this training path to:
                  </p>
                  <select
                    value={selectedRecord}
                    onChange={(e) => setSelectedRecord(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a record...</option>
                    {records.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.candidate_name || r.name || `Record #${r.id}`}
                        {r.email ? ` (${r.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => setAssigningTo(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={assigning || !selectedRecord}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  >
                    {assigning ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === CERTIFICATIONS TAB === */}
      {activeTab === "certifications" && (
        <div>
          {/* Record Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">
                Onboarding Record:
              </label>
              <select
                value={certRecordFilter}
                onChange={(e) => setCertRecordFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
              >
                <option value="">Select a record...</option>
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.candidate_name || r.name || `Record #${r.id}`}
                    {r.email ? ` (${r.email})` : ""}
                  </option>
                ))}
              </select>
            </div>
            {certRecordFilter && (
              <button
                onClick={() => {
                  resetCertForm();
                  setShowCertForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + Add Certification
              </button>
            )}
          </div>

          {!certRecordFilter ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">
                Select an onboarding record to manage certifications.
              </p>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">
                No certifications yet for this record.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Click "+ Add Certification" to add one.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Certification
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Issuer
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Completion Date
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {certifications.map((cert) => (
                      <tr
                        key={cert.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {cert.certification_name || cert.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {cert.issuer || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[cert.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cert.status
                              ? cert.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                              : "Not Attempted"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {cert.completion_date || cert.date
                            ? new Date(
                                cert.completion_date || cert.date
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditCert(cert)}
                              className="text-gray-500 hover:text-gray-700 text-xs px-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCert(cert.id)}
                              className="text-red-400 hover:text-red-600 text-xs px-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-50">
                {certifications.length} certification
                {certifications.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Add/Edit Certification Modal */}
          {showCertForm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
              onClick={resetCertForm}
            >
              <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {editingCert
                      ? "Edit Certification"
                      : "Add Certification"}
                  </h3>
                  <button
                    onClick={resetCertForm}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      value={certStatus}
                      onChange={(e) => setCertStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CERT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ").replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                          )}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={resetCertForm}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCert}
                    disabled={savingCert}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  >
                    {savingCert
                      ? "Saving..."
                      : editingCert
                      ? "Update"
                      : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </HRPage>
  );
}
