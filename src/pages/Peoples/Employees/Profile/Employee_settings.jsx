import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, Shield, CheckCircle, XCircle } from "lucide-react";

const calcStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { score, label: "Medium", color: "bg-amber-400" };
  return { score, label: "Strong", color: "bg-emerald-500" };
};

const requirements = [
  { label: "At least 8 characters", test: pw => pw.length >= 8 },
  { label: "One uppercase letter", test: pw => /[A-Z]/.test(pw) },
  { label: "One number", test: pw => /[0-9]/.test(pw) },
  { label: "One special character", test: pw => /[^A-Za-z0-9]/.test(pw) },
];

const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
  <div>
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
        <Lock size={15} />
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "••••••••"}
        className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  </div>
);

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [twoFA, setTwoFA] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = calcStrength(newPw);

  const validate = () => {
    const e = {};
    if (!current) e.current = "Enter your current password";
    if (strength.score < 3) e.newPw = "Password is too weak";
    if (!newPw) e.newPw = "Enter a new password";
    if (newPw !== confirm) e.confirm = "Passwords do not match";
    if (!confirm) e.confirm = "Confirm your password";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    setCurrent(""); setNewPw(""); setConfirm("");
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-start justify-center">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Profile</p>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Security Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your password and authentication preferences.</p>
        </div>

        {submitted && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-semibold">
            <CheckCircle size={16} /> Password updated successfully!
          </div>
        )}

        {/* Password Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-indigo-50">
              <Lock size={16} className="text-indigo-500" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Change Password</h2>
          </div>

          <div className="space-y-4">
            <div>
              <PasswordField
                label="Current Password"
                value={current}
                onChange={e => { setCurrent(e.target.value); setErrors(p => ({ ...p, current: "" })); }}
                show={show.current}
                onToggle={() => toggle("current")}
              />
              {errors.current && <p className="text-xs text-red-500 mt-1">{errors.current}</p>}
            </div>

            <div>
              <PasswordField
                label="New Password"
                value={newPw}
                onChange={e => { setNewPw(e.target.value); setErrors(p => ({ ...p, newPw: "" })); }}
                show={show.new}
                onToggle={() => toggle("new")}
                placeholder="Create a strong password"
              />
              {errors.newPw && <p className="text-xs text-red-500 mt-1">{errors.newPw}</p>}

              {/* Strength Meter */}
              {newPw && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${
                    strength.label === "Strong" ? "text-emerald-600"
                    : strength.label === "Medium" ? "text-amber-500"
                    : "text-red-500"
                  }`}>
                    {strength.label} Password
                  </p>

                  {/* Requirements */}
                  <div className="mt-3 space-y-1.5">
                    {requirements.map(req => {
                      const met = req.test(newPw);
                      return (
                        <div key={req.label} className="flex items-center gap-2">
                          {met
                            ? <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                            : <XCircle size={13} className="text-slate-300 shrink-0" />
                          }
                          <span className={`text-xs ${met ? "text-slate-600" : "text-slate-400"}`}>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <PasswordField
                label="Confirm New Password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: "" })); }}
                show={show.confirm}
                onToggle={() => toggle("confirm")}
                placeholder="Re-enter your new password"
              />
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              {confirm && newPw && confirm === newPw && (
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> Passwords match
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-indigo-200"
          >
            Update Password
          </button>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-violet-50">
              <ShieldCheck size={16} className="text-violet-500" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Two-Factor Authentication</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5 ml-10">Add an extra layer of security to your account with 2FA.</p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Shield size={18} className={twoFA ? "text-violet-500" : "text-slate-300"} />
              <div>
                <p className="text-sm font-semibold text-slate-800">Authenticator App</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {twoFA ? "2FA is enabled on your account" : "Use Google Authenticator or Authy"}
                </p>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => setTwoFA(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${twoFA ? "bg-violet-500" : "bg-slate-200"}`}
              aria-label="Toggle 2FA"
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                  twoFA ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {twoFA && (
            <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl">
              <p className="text-xs font-semibold text-violet-700 mb-1">✓ Two-factor authentication is active</p>
              <p className="text-xs text-violet-500">
                You'll be asked for a verification code each time you sign in from a new device.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}