import React, { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getMyProfile,
  updateMyProfile,
  getMyLeave,
  getTravel,
  getAssets,
  getMyAttendance,
  getEss,
  createEss,
  updateEss,
  deleteEss,
} from "../../../service/hrService";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const ESS_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const TABS = [
  { key: "leave", label: "Leave Requests" },
  { key: "travel", label: "Travel Requests" },
  { key: "assets", label: "My Assets" },
  { key: "attendance", label: "Attendance" },
  { key: "ess", label: "ESS Requests" },
];

const ITEMS_PER_PAGE = 5;

export default function ESS() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: "", address: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState(null);

  const [leaveData, setLeaveData] = useState([]);
  const [travelData, setTravelData] = useState([]);
  const [assetsData, setAssetsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [essData, setEssData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [activeTab, setActiveTab] = useState("leave");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showEssModal, setShowEssModal] = useState(false);
  const [essForm, setEssForm] = useState({ request_type: "", description: "" });
  const [essFormErrors, setEssFormErrors] = useState({});
  const [essSubmitting, setEssSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setProfileLoading(true);
      setDataLoading(true);
      setProfileError(null);
      setDataError(null);
      try {
        const p = await getMyProfile();
        if (!mounted) return;
        setProfile(p);
        setProfileForm({ phone: p.phone || "", address: p.address || "" });
        const empId = p.id;
        const [leaveRes, travelRes, assetsRes, attendanceRes, essRes] = await Promise.allSettled([
          getMyLeave(empId),
          getTravel(empId),
          getAssets(empId),
          getMyAttendance(empId),
          getEss(empId),
        ]);
        if (!mounted) return;
        if (leaveRes.status === "fulfilled") setLeaveData(Array.isArray(leaveRes.value) ? leaveRes.value : []);
        else if (leaveData.length === 0) setLeaveData([]);
        if (travelRes.status === "fulfilled") setTravelData(Array.isArray(travelRes.value) ? travelRes.value : []);
        else if (travelData.length === 0) setTravelData([]);
        if (assetsRes.status === "fulfilled") setAssetsData(Array.isArray(assetsRes.value) ? assetsRes.value : []);
        else if (assetsData.length === 0) setAssetsData([]);
        if (attendanceRes.status === "fulfilled") setAttendanceData(Array.isArray(attendanceRes.value) ? attendanceRes.value : []);
        else if (attendanceData.length === 0) setAttendanceData([]);
        if (essRes.status === "fulfilled") setEssData(Array.isArray(essRes.value) ? essRes.value : []);
        else if (essData.length === 0) setEssData([]);
      } catch (err) {
        if (mounted) {
          setProfileError(err.message || "Failed to load data");
          setDataError(err.message || "Failed to load data");
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
          setDataLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getEmpId = () => profile?.id;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaveMsg(null);
    try {
      const payload = {};
      if (profileForm.phone !== (profile.phone || "")) payload.phone = profileForm.phone || null;
      if (profileForm.address !== (profile.address || "")) payload.address = profileForm.address || null;
      if (Object.keys(payload).length > 0) {
        const updated = await updateMyProfile(payload);
        setProfile(updated);
      }
      setProfileSaveMsg({ type: "success", text: "Profile updated successfully." });
      setEditingProfile(false);
    } catch (err) {
      setProfileSaveMsg({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setProfileSaving(false);
    }
  };

  const filteredData = useMemo(() => {
    let data;
    switch (activeTab) {
      case "leave": data = leaveData; break;
      case "travel": data = travelData; break;
      case "assets": data = assetsData; break;
      case "attendance": data = attendanceData; break;
      case "ess": data = essData; break;
      default: data = [];
    }
    let result = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (activeTab === "leave") {
        result = result.filter((r) => r.leave_type?.toLowerCase().includes(q));
      } else if (activeTab === "travel") {
        result = result.filter((r) => r.destination?.toLowerCase().includes(q) || r.purpose?.toLowerCase().includes(q));
      } else if (activeTab === "assets") {
        result = result.filter((r) => r.name?.toLowerCase().includes(q) || r.asset_tag?.toLowerCase().includes(q));
      } else if (activeTab === "attendance") {
        result = result.filter((r) => r.date?.includes(q) || r.status?.toLowerCase().includes(q));
      } else if (activeTab === "ess") {
        result = result.filter((r) => r.request_type?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
      }
    }
    if (statusFilter && activeTab !== "attendance" && activeTab !== "assets") {
      result = result.filter((r) => r.status === statusFilter);
    }
    return result;
  }, [activeTab, leaveData, travelData, assetsData, attendanceData, essData, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleCreateEss = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!essForm.request_type.trim()) errors.request_type = "Request type is required";
    setEssFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setEssSubmitting(true);
    try {
      await createEss({
        employee_id: getEmpId(),
        request_type: essForm.request_type.trim(),
        description: essForm.description.trim() || null,
      });
      setShowEssModal(false);
      setEssForm({ request_type: "", description: "" });
      const res = await getEss(getEmpId());
      setEssData(Array.isArray(res) ? res : []);
    } catch (err) {
      setEssFormErrors({ submit: err.message || "Failed to create request" });
    } finally {
      setEssSubmitting(false);
    }
  };

  const handleResolveEss = async (id) => {
    try {
      await updateEss(id, { status: "completed" });
      const res = await getEss(getEmpId());
      setEssData(Array.isArray(res) ? res : []);
    } catch (err) {
      setDataError(err.message || "Failed to update ESS request");
    }
  };

  const handleDeleteEss = async (id) => {
    if (!window.confirm("Delete this ESS request?")) return;
    try {
      await deleteEss(id);
      const res = await getEss(getEmpId());
      setEssData(Array.isArray(res) ? res : []);
    } catch (err) {
      setDataError(err.message || "Failed to delete ESS request");
    }
  };

  const openLeave = leaveData.filter((r) => r.status === "pending" || r.status === "approved").length;
  const pendingTravel = travelData.filter((r) => r.status === "pending").length;
  const myAssetCount = assetsData.filter((a) => a.status === "assigned").length;
  const openEss = essData.filter((r) => r.status === "pending").length;

  const renderTable = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-400 text-sm">Loading...</span>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400 text-sm">
          {dataError ? `Error: ${dataError}` : `No ${activeTab} records found.`}
        </div>
      );
    }

    const renderLeaveRow = (r) => (
      <tr key={r.id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 text-gray-500">{r.leave_type || "-"}</td>
        <td className="px-4 py-3 text-gray-700">{r.start_date || "-"} &rarr; {r.end_date || "-"}</td>
        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
      </tr>
    );

    const renderTravelRow = (r) => (
      <tr key={r.id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 text-gray-700">{r.destination}</td>
        <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{r.purpose || "-"}</td>
        <td className="px-4 py-3 text-xs text-gray-500">{r.start_date} &rarr; {r.end_date}</td>
        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
      </tr>
    );

    const renderAssetRow = (a) => (
      <tr key={a.id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 font-mono text-xs text-blue-600 font-semibold">{a.asset_tag}</td>
        <td className="px-4 py-3 text-gray-700">{a.name}</td>
        <td className="px-4 py-3">{a.category ? <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{a.category}</span> : "-"}</td>
        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[a.status] || "bg-blue-100 text-blue-800"}`}>{a.status}</span></td>
      </tr>
    );

    const renderAttendanceRow = (r) => (
      <tr key={r.id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 text-gray-700">{r.date || "-"}</td>
        <td className="px-4 py-3 text-gray-500">{r.check_in || "-"}</td>
        <td className="px-4 py-3 text-gray-500">{r.check_out || "-"}</td>
        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${r.status === "present" ? "bg-green-100 text-green-800" : r.status === "late" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}>{r.status || "-"}</span></td>
      </tr>
    );

    const renderEssRow = (r) => (
      <tr key={r.id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 text-gray-700 font-medium">{r.request_type}</td>
        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.description || "-"}</td>
        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ESS_STATUS_COLORS[r.status]}`}>{r.status}</span></td>
        <td className="px-4 py-3">
          <div className="flex gap-1">
            {r.status === "pending" && (
              <button onClick={() => handleResolveEss(r.id)} className="text-green-600 hover:text-green-800 text-xs font-medium">Resolve</button>
            )}
            <button onClick={() => handleDeleteEss(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
          </div>
        </td>
      </tr>
    );

    let rows;
    switch (activeTab) {
      case "leave": rows = paginated.map(renderLeaveRow); break;
      case "travel": rows = paginated.map(renderTravelRow); break;
      case "assets": rows = paginated.map(renderAssetRow); break;
      case "attendance": rows = paginated.map(renderAttendanceRow); break;
      case "ess": rows = paginated.map(renderEssRow); break;
      default: rows = null;
    }

    let headers;
    switch (activeTab) {
      case "leave": headers = ["Type", "Dates", "Status"]; break;
      case "travel": headers = ["Destination", "Purpose", "Dates", "Status"]; break;
      case "assets": headers = ["Asset Tag", "Name", "Category", "Status"]; break;
      case "attendance": headers = ["Date", "Check In", "Check Out", "Status"]; break;
      case "ess": headers = ["Type", "Description", "Status", "Actions"]; break;
      default: headers = [];
    }

    return (
      <>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {headers.map((h) => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">{rows}</tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-400">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <HRPage title="Employee Self Service" subtitle="View your profile, requests, and company assets.">
      {dataError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{dataError}</span>
          <button onClick={() => setDataError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {profileSaveMsg && (
        <div className={`mb-4 px-4 py-3 rounded-lg flex justify-between items-center ${profileSaveMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          <span>{profileSaveMsg.text}</span>
          <button onClick={() => setProfileSaveMsg(null)} className="font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Open Leave", count: openLeave, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Travel", count: pendingTravel, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "My Assets", count: myAssetCount, color: "text-green-600", bg: "bg-green-50" },
            { label: "Open ESS", count: openEss, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">My Profile</h3>
            {!editingProfile ? (
              <button onClick={() => setEditingProfile(true)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit Profile</button>
            ) : (
              <button onClick={() => { setEditingProfile(false); setProfileForm({ phone: profile?.phone || "", address: profile?.address || "" }); }} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
            )}
          </div>
          {profileLoading ? (
            <div className="text-gray-400 text-sm py-4">Loading profile...</div>
          ) : profile ? (
            editingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Name</label>
                    <p className="text-gray-800 font-medium px-3 py-2 bg-gray-50 rounded-lg">{profile.first_name} {profile.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
                    <p className="text-gray-800 px-3 py-2 bg-gray-50 rounded-lg">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Phone</label>
                    <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Job Title</label>
                    <p className="text-gray-800 px-3 py-2 bg-gray-50 rounded-lg">{profile.job_title}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Address</label>
                    <textarea rows={2} value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={profileSaving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Name</span><span className="text-gray-800 font-medium">{profile.first_name} {profile.last_name}</span></div>
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Email</span><span className="text-gray-800">{profile.email}</span></div>
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Phone</span><span className="text-gray-800">{profile.phone || "-"}</span></div>
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Job Title</span><span className="text-gray-800">{profile.job_title}</span></div>
                <div className="md:col-span-2"><span className="text-xs font-semibold text-gray-400 uppercase block">Address</span><span className="text-gray-800">{profile.address || "-"}</span></div>
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Employee Code</span><span className="text-gray-800 font-mono">{profile.employee_code}</span></div>
                <div><span className="text-xs font-semibold text-gray-400 uppercase block">Department</span><span className="text-gray-800">{profile.department?.name || "-"}</span></div>
              </div>
            )
          ) : (
            <div className="text-red-500 text-sm">{profileError || "Failed to load profile"}</div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setSearch(""); setStatusFilter(""); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {t.label}
              </button>
            ))}
            {activeTab === "ess" && (
              <button onClick={() => { setShowEssModal(true); setEssFormErrors({}); }} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Request</button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              placeholder={
                activeTab === "leave" ? "Search by type..." :
                activeTab === "travel" ? "Search destination..." :
                activeTab === "assets" ? "Search name or tag..." :
                activeTab === "attendance" ? "Search date..." :
                "Search requests..."
              }
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activeTab !== "attendance" && activeTab !== "assets" && (
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>

          {renderTable()}
        </div>
      </div>

      {showEssModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">New ESS Request</h2>
              <button onClick={() => { setShowEssModal(false); setEssForm({ request_type: "", description: "" }); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreateEss} className="p-6 space-y-4">
              {essFormErrors.submit && <div className="text-red-500 text-sm">{essFormErrors.submit}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Type *</label>
                <input type="text" value={essForm.request_type} onChange={(e) => setEssForm({ ...essForm, request_type: e.target.value })} placeholder="e.g. Document Request, IT Support" className={`w-full border ${essFormErrors.request_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                {essFormErrors.request_type && <p className="text-red-500 text-xs mt-1">{essFormErrors.request_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={essForm.description} onChange={(e) => setEssForm({ ...essForm, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEssModal(false); setEssForm({ request_type: "", description: "" }); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={essSubmitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">{essSubmitting ? "Submitting..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
