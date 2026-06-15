import { useState } from "react";
import { User, Mail, Phone, MapPin, Building2, Briefcase, Calendar, Users, Save, Edit3, X, PhoneCall, Heart } from "lucide-react";
import { useProfile } from "../hooks/useEss";
import { updateProfileData } from "../services/essService";
import { formatDate } from "../utils/helpers";

export default function EssProfile() {
  const { data: profile, loading } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({});

  if (loading) return <div className="p-6 text-gray-400">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-gray-400">No profile data</div>;

  const initForm = () => ({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    workEmail: profile.workEmail,
    workPhone: profile.workPhone,
  });

  const handleEdit = () => {
    setForm(initForm());
    setEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfileData(form);
      setMessage({ type: "success", text: "Profile updated successfully." });
      setEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your personal information</p>
        </div>
        {!editing ? (
          <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg flex justify-between items-center ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.designation}</p>
          <p className="text-xs text-gray-400 mt-1">{profile.department}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
            <p>Employee ID: <span className="font-medium text-gray-800">{profile.employeeId}</span></p>
            <p>Joined: <span className="font-medium text-gray-800">{formatDate(profile.joinDate)}</span></p>
            <p>Manager: <span className="font-medium text-gray-800">{profile.manager}</span></p>
            <p>Blood Group: <span className="font-medium text-gray-800">{profile.bloodGroup}</span></p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Personal Information</h3>
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                    <input type="email" value={form.workEmail} onChange={(e) => setForm({ ...form, workEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
                    <input type="text" value={form.workPhone} onChange={(e) => setForm({ ...form, workPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoRow icon={User} label="Full Name" value={profile.name} />
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} />
                <InfoRow icon={Mail} label="Work Email" value={profile.workEmail} />
                <InfoRow icon={Phone} label="Work Phone" value={profile.workPhone || "-"} />
                <InfoRow icon={MapPin} label="Address" value={profile.address} />
                <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                <InfoRow icon={Heart} label="Blood Group" value={profile.bloodGroup} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-500" /> Work Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow icon={Building2} label="Department" value={profile.department} />
              <InfoRow icon={Briefcase} label="Designation" value={profile.designation} />
              <InfoRow icon={Users} label="Manager" value={profile.manager} />
              <InfoRow icon={Calendar} label="Join Date" value={formatDate(profile.joinDate)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><PhoneCall className="w-5 h-5 text-blue-500" /> Emergency Contacts</h3>
            <div className="space-y-3">
              {profile.emergencyContacts.map((ec) => (
                <div key={ec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ec.name}</p>
                    <p className="text-xs text-gray-500">{ec.relationship}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{ec.phone}</p>
                    <p className="text-xs text-gray-500">{ec.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="p-1.5 bg-blue-50 rounded-lg"><Icon className="w-4 h-4 text-blue-600" /></div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );
}
