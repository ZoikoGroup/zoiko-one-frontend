import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingRecords,
  getOnboardingMilestones,
  createOnboardingMilestone,
  updateOnboardingMilestone,
  deleteOnboardingMilestone,
  getOnboardingDocuments,
  getOnboardingAssetAllocations,
  getOnboardingOrientationAttendees,
  getOnboardingTrainingAssignments,
  getOnboardingChecklistAssignments,
} from "../../../service/hrService";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Package,
  Calendar,
  BookOpen,
  ListChecks,
  Flag,
  Target,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  X,
} from "lucide-react";

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

const CATEGORIES = [
  { key: "documents", label: "Documents", icon: FileText, color: "bg-blue-500" },
  { key: "assets", label: "Assets", icon: Package, color: "bg-violet-500" },
  { key: "orientation", label: "Orientation", icon: Calendar, color: "bg-amber-500" },
  { key: "training", label: "Training", icon: BookOpen, color: "bg-rose-500" },
  { key: "checklists", label: "Checklists", icon: ListChecks, color: "bg-teal-500" },
];

const MILESTONE_STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  blocked: "bg-red-100 text-red-700 border-red-200",
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

function StatusBadge({ label, color }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function ProgressBar({ value, size = "md", showLabel = true, color }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const barColor =
    color ||
    (pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500");

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${heights[size]} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-gray-600 w-10 text-right tabular-nums">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

function RecordCard({ record, milestones, documents, assets, orientation, training, checklists, onAddMilestone, onEditMilestone, onDeleteMilestone }) {
  const [expanded, setExpanded] = useState(false);

  const categoryCounts = useMemo(() => {
    const docs = Array.isArray(documents) ? documents.filter((d) => d.onboarding_record_id === record.id || d.record_id === record.id) : [];
    const ast = Array.isArray(assets) ? assets.filter((a) => a.onboarding_record_id === record.id || a.record_id === record.id) : [];
    const orient = Array.isArray(orientation) ? orientation.filter((o) => o.onboarding_record_id === record.id || o.record_id === record.id) : [];
    const train = Array.isArray(training) ? training.filter((t) => t.onboarding_record_id === record.id || t.record_id === record.id) : [];
    const check = Array.isArray(checklists) ? checklists.filter((c) => c.onboarding_record_id === record.id || c.record_id === record.id) : [];

    const docDone = docs.filter((d) => d.status === "submitted" || d.status === "approved" || d.status === "completed").length;
    const assetDone = ast.filter((a) => a.status === "allocated" || a.status === "delivered" || a.status === "completed").length;
    const orientDone = orient.filter((o) => o.status === "attended" || o.status === "completed").length;
    const trainDone = train.filter((t) => (t.progress_percentage ?? t.progressPercentage ?? 0) >= 100).length;
    const checkDone = check.filter((c) => c.status === "completed").length;

    return {
      documents: { total: docs.length, done: docDone },
      assets: { total: ast.length, done: assetDone },
      orientation: { total: orient.length, done: orientDone },
      training: { total: train.length, done: trainDone },
      checklists: { total: check.length, done: checkDone },
    };
  }, [record.id, documents, assets, orientation, training, checklists]);

  const overallProgress = useMemo(() => {
    const weights = { documents: 1, assets: 1, orientation: 1, training: 1, checklists: 1 };
    let totalWeight = 0;
    let weightedSum = 0;

    for (const cat of CATEGORIES) {
      const c = categoryCounts[cat.key];
      if (c.total > 0) {
        const pct = (c.done / c.total) * 100;
        weightedSum += pct * weights[cat.key];
        totalWeight += weights[cat.key];
      }
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }, [categoryCounts]);

  const recordMilestones = useMemo(() => {
    return Array.isArray(milestones)
      ? milestones.filter((m) => m.onboarding_record_id === record.id || m.record_id === record.id)
      : [];
  }, [milestones, record.id]);

  const completedMilestones = recordMilestones.filter((m) => m.status === "completed").length;
  const totalMilestones = recordMilestones.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-800 truncate">
              {record.candidate_name || record.name || `Record #${record.id}`}
            </h3>
            <StatusBadge
              label={
                overallProgress === 100
                  ? "Completed"
                  : overallProgress > 0
                  ? "In Progress"
                  : "Not Started"
              }
              color={
                overallProgress === 100
                  ? "bg-green-100 text-green-700"
                  : overallProgress > 0
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500"
              }
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {record.email && <span>{record.email}</span>}
            {record.department && <span>{record.department}</span>}
            {totalMilestones > 0 && (
              <span className="flex items-center gap-1">
                <Flag size={12} />
                {completedMilestones}/{totalMilestones} milestones
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-lg font-bold text-gray-800">{overallProgress}%</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Overall</p>
          </div>
          <div className="w-24">
            <ProgressBar value={overallProgress} size="sm" showLabel={false} />
          </div>
          {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => {
              const c = categoryCounts[cat.key];
              const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <div key={cat.key} className="bg-gray-50 rounded-lg p-3 text-center">
                  <cat.icon size={18} className={`mx-auto mb-1 ${cat.color.replace("bg-", "text-")}`} />
                  <p className="text-xs text-gray-400 font-medium">{cat.label}</p>
                  <p className="text-lg font-bold text-gray-800">{pct}%</p>
                  <p className="text-[10px] text-gray-400">
                    {c.done}/{c.total}
                  </p>
                  <div className="mt-1">
                    <ProgressBar value={pct} size="sm" showLabel={false} color={cat.color.replace("bg-", "bg-").replace("500", "500")} />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Flag size={14} className="text-blue-600" />
                Milestones
                {totalMilestones > 0 && (
                  <span className="text-xs font-normal text-gray-400">
                    ({completedMilestones}/{totalMilestones} completed)
                  </span>
                )}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMilestone(record.id);
                }}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                <Plus size={14} />
                Add Milestone
              </button>
            </div>

            {recordMilestones.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-lg">
                No milestones configured for this record.
              </p>
            ) : (
              <div className="space-y-2">
                {recordMilestones.map((m) => {
                  const mStatus = m.status || "pending";
                  const statusColor = MILESTONE_STATUS_COLORS[mStatus] || MILESTONE_STATUS_COLORS.pending;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {m.milestone_name || m.name}
                          </span>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${statusColor}`}>
                            {mStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>
                        {m.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{m.description}</p>
                        )}
                        {m.target_date && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Target: {new Date(m.target_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditMilestone(m);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Delete this milestone?")) onDeleteMilestone(m.id);
                          }}
                          className="text-red-300 hover:text-red-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
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
}

export default function OnboardingProgress() {
  const [records, setRecords] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [orientation, setOrientation] = useState([]);
  const [training, setTraining] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneRecordId, setMilestoneRecordId] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [mFormName, setMFormName] = useState("");
  const [mFormDescription, setMFormDescription] = useState("");
  const [mFormStatus, setMFormStatus] = useState("pending");
  const [mFormTargetDate, setMFormTargetDate] = useState("");
  const [mSaving, setMSaving] = useState(false);

  const fetchRecords = async () => {
    try {
      const data = await getOnboardingRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    }
  };

  const fetchMilestones = async () => {
    try {
      const data = await getOnboardingMilestones();
      setMilestones(Array.isArray(data) ? data : []);
    } catch {
      setMilestones([]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const data = await getOnboardingDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      setDocuments([]);
    }
  };

  const fetchAssets = async () => {
    try {
      const data = await getOnboardingAssetAllocations();
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      setAssets([]);
    }
  };

  const fetchOrientation = async () => {
    try {
      const data = await getOnboardingOrientationAttendees();
      setOrientation(Array.isArray(data) ? data : []);
    } catch {
      setOrientation([]);
    }
  };

  const fetchTraining = async () => {
    try {
      const data = await getOnboardingTrainingAssignments();
      setTraining(Array.isArray(data) ? data : []);
    } catch {
      setTraining([]);
    }
  };

  const fetchChecklists = async () => {
    try {
      const data = await getOnboardingChecklistAssignments();
      setChecklists(Array.isArray(data) ? data : []);
    } catch {
      setChecklists([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchRecords(),
        fetchMilestones(),
        fetchDocuments(),
        fetchAssets(),
        fetchOrientation(),
        fetchTraining(),
        fetchChecklists(),
      ]);
    } catch (err) {
      setError(err.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const allProgress = useMemo(() => {
    return records.map((record) => {
      const docs = documents.filter((d) => d.onboarding_record_id === record.id || d.record_id === record.id);
      const ast = assets.filter((a) => a.onboarding_record_id === record.id || a.record_id === record.id);
      const orient = orientation.filter((o) => o.onboarding_record_id === record.id || o.record_id === record.id);
      const train = training.filter((t) => t.onboarding_record_id === record.id || t.record_id === record.id);
      const check = checklists.filter((c) => c.onboarding_record_id === record.id || c.record_id === record.id);
      const recMilestones = milestones.filter((m) => m.onboarding_record_id === record.id || m.record_id === record.id);

      const docPct = docs.length > 0 ? Math.round((docs.filter((d) => d.status === "submitted" || d.status === "approved" || d.status === "completed").length / docs.length) * 100) : 0;
      const assetPct = ast.length > 0 ? Math.round((ast.filter((a) => a.status === "allocated" || a.status === "delivered" || a.status === "completed").length / ast.length) * 100) : 0;
      const orientPct = orient.length > 0 ? Math.round((orient.filter((o) => o.status === "attended" || o.status === "completed").length / orient.length) * 100) : 0;
      const trainPct = train.length > 0 ? Math.round((train.filter((t) => (t.progress_percentage ?? t.progressPercentage ?? 0) >= 100).length / train.length) * 100) : 0;
      const checkPct = check.length > 0 ? Math.round((check.filter((c) => c.status === "completed").length / check.length) * 100) : 0;

      const weights = { docPct: 1, assetPct: 1, orientPct: 1, trainPct: 1, checkPct: 1 };
      let totalWeight = 0;
      let weightedSum = 0;

      const cats = [
        { pct: docPct, len: docs.length, w: weights.docPct },
        { pct: assetPct, len: ast.length, w: weights.assetPct },
        { pct: orientPct, len: orient.length, w: weights.orientPct },
        { pct: trainPct, len: train.length, w: weights.trainPct },
        { pct: checkPct, len: check.length, w: weights.checkPct },
      ];

      for (const c of cats) {
        if (c.len > 0) {
          weightedSum += c.pct * c.w;
          totalWeight += c.w;
        }
      }

      const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

      const completedMs = recMilestones.filter((m) => m.status === "completed").length;
      const totalMs = recMilestones.length;

      return {
        record,
        overall,
        docPct,
        assetPct,
        orientPct,
        trainPct,
        checkPct,
        completedMilestones: completedMs,
        totalMilestones: totalMs,
        status: overall === 100 ? "completed" : overall > 0 ? "in_progress" : "not_started",
      };
    });
  }, [records, documents, assets, orientation, training, checklists, milestones]);

  const dashboardStats = useMemo(() => {
    const total = allProgress.length;
    const completed = allProgress.filter((p) => p.status === "completed").length;
    const inProgress = allProgress.filter((p) => p.status === "in_progress").length;
    const notStarted = allProgress.filter((p) => p.status === "not_started").length;
    const totalMilestonesCount = milestones.length;
    const completedMilestonesCount = milestones.filter((m) => m.status === "completed").length;

    return { total, completed, inProgress, notStarted, totalMilestonesCount, completedMilestonesCount };
  }, [allProgress, milestones]);

  const avgProgress = useMemo(() => {
    if (allProgress.length === 0) return 0;
    return Math.round(allProgress.reduce((s, p) => s + p.overall, 0) / allProgress.length);
  }, [allProgress]);

  const filteredProgress = useMemo(() => {
    let result = allProgress;

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.record.candidate_name || p.record.name || "")
            .toLowerCase()
            .includes(q) ||
          (p.record.email || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [allProgress, statusFilter, searchQuery]);

  const resetMilestoneForm = () => {
    setShowMilestoneForm(false);
    setMilestoneRecordId(null);
    setEditingMilestone(null);
    setMFormName("");
    setMFormDescription("");
    setMFormStatus("pending");
    setMFormTargetDate("");
  };

  const handleAddMilestone = (recordId) => {
    setMilestoneRecordId(recordId);
    setEditingMilestone(null);
    setMFormName("");
    setMFormDescription("");
    setMFormStatus("pending");
    setMFormTargetDate("");
    setShowMilestoneForm(true);
  };

  const handleEditMilestone = (milestone) => {
    setMilestoneRecordId(milestone.onboarding_record_id || milestone.record_id);
    setEditingMilestone(milestone);
    setMFormName(milestone.milestone_name || milestone.name || "");
    setMFormDescription(milestone.description || "");
    setMFormStatus(milestone.status || "pending");
    setMFormTargetDate(milestone.target_date || "");
    setShowMilestoneForm(true);
  };

  const handleSaveMilestone = async () => {
    if (!mFormName.trim()) return;
    setMSaving(true);
    try {
      const payload = {
        onboarding_record_id: milestoneRecordId,
        milestone_name: mFormName.trim(),
        description: mFormDescription.trim() || undefined,
        status: mFormStatus,
        target_date: mFormTargetDate || undefined,
      };

      if (editingMilestone) {
        await updateOnboardingMilestone(editingMilestone.id, payload);
      } else {
        await createOnboardingMilestone(payload);
      }

      resetMilestoneForm();
      await fetchMilestones();
    } catch (err) {
      alert(err.message || "Failed to save milestone");
    } finally {
      setMSaving(false);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await deleteOnboardingMilestone(id);
      await fetchMilestones();
    } catch (err) {
      alert(err.message || "Failed to delete milestone");
    }
  };

  if (loading) {
    return (
      <HRPage title="Onboarding Progress" subtitle="Track completion progress across all onboarding records.">
        <OnboardingSubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-500">Loading progress data...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Onboarding Progress" subtitle="Track completion progress across all onboarding records.">
        <OnboardingSubNav />
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Onboarding Progress" subtitle="Track completion progress across all onboarding records.">
      <OnboardingSubNav />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Average Progress</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{avgProgress}%</p>
            <div className="mt-2">
              <ProgressBar value={avgProgress} size="sm" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{dashboardStats.completed}</p>
            <p className="text-xs text-gray-400 mt-1">out of {dashboardStats.total} records</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{dashboardStats.inProgress}</p>
            <p className="text-xs text-gray-400 mt-1">out of {dashboardStats.total} records</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Not Started</p>
            <p className="text-2xl font-bold text-gray-400 mt-1">{dashboardStats.notStarted}</p>
            <p className="text-xs text-gray-400 mt-1">out of {dashboardStats.total} records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              Status Overview
            </h3>
            <div className="flex items-center justify-center gap-1 py-4">
              {[
                { label: "Completed", value: dashboardStats.completed, color: "#22c55e" },
                { label: "In Progress", value: dashboardStats.inProgress, color: "#3b82f6" },
                { label: "Not Started", value: dashboardStats.notStarted, color: "#9ca3af" },
              ].map((seg) => {
                const pct = dashboardStats.total > 0 ? (seg.value / dashboardStats.total) * 100 : 0;
                return (
                  <div
                    key={seg.label}
                    className="h-16 first:rounded-l-full last:rounded-r-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: seg.color,
                      minWidth: seg.value > 0 ? "4px" : "0",
                    }}
                    title={`${seg.label}: ${seg.value}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              {[
                { label: "Completed", value: dashboardStats.completed, color: "#22c55e" },
                { label: "In Progress", value: dashboardStats.inProgress, color: "#3b82f6" },
                { label: "Not Started", value: dashboardStats.notStarted, color: "#9ca3af" },
              ].map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <Circle size={10} fill={seg.color} stroke={seg.color} />
                  <span className="text-xs text-gray-500">
                    {seg.label} ({seg.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Target size={16} className="text-blue-600" />
              Milestone Summary
            </h3>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-gray-800">
                {dashboardStats.completedMilestonesCount}
                <span className="text-base font-normal text-gray-400">
                  /{dashboardStats.totalMilestonesCount}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Milestones Completed</p>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={
                  dashboardStats.totalMilestonesCount > 0
                    ? (dashboardStats.completedMilestonesCount / dashboardStats.totalMilestonesCount) * 100
                    : 0
                }
                size="md"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["all", "not_started", "in_progress", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "all"
                  ? "All"
                  : s
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          />
        </div>

        <div className="space-y-3">
          {filteredProgress.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <TrendingUp size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                {records.length === 0
                  ? "No onboarding records yet."
                  : "No records match the current filter."}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {records.length === 0
                  ? "Create a new hire record to start tracking progress."
                  : "Try adjusting the filter or search query."}
              </p>
            </div>
          ) : (
            filteredProgress.map((p) => (
              <RecordCard
                key={p.record.id}
                record={p.record}
                milestones={milestones}
                documents={documents}
                assets={assets}
                orientation={orientation}
                training={training}
                checklists={checklists}
                onAddMilestone={handleAddMilestone}
                onEditMilestone={handleEditMilestone}
                onDeleteMilestone={handleDeleteMilestone}
              />
            ))
          )}
        </div>
      </div>

      {showMilestoneForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={resetMilestoneForm}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {editingMilestone ? "Edit Milestone" : "Add Milestone"}
              </h3>
              <button
                onClick={resetMilestoneForm}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Milestone Name
                </label>
                <input
                  type="text"
                  value={mFormName}
                  onChange={(e) => setMFormName(e.target.value)}
                  placeholder="e.g. Document Submission"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={mFormDescription}
                  onChange={(e) => setMFormDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={mFormStatus}
                  onChange={(e) => setMFormStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {["pending", "in_progress", "completed", "blocked"].map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={mFormTargetDate}
                  onChange={(e) => setMFormTargetDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={resetMilestoneForm}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMilestone}
                disabled={mSaving || !mFormName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              >
                {mSaving ? "Saving..." : editingMilestone ? "Update" : "Add Milestone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </HRPage>
  );
}
