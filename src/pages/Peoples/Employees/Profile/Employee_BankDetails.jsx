import { useState } from "react";
import { Eye, EyeOff, Building, CreditCard, Hash, FileText, ChevronDown, Edit3, Save, X } from "lucide-react";

const initialData = {
  bankName: "HDFC Bank",
  accountHolder: "Arjun Mehta",
  accountNumber: "50200034567891",
  ifscCode: "HDFC0001234",
  panCard: "ABCPM1234D",
  paymentMethod: "Bank Transfer",
};

const PAYMENT_METHODS = ["Bank Transfer", "Check", "Digital Wallet"];

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
      <Icon size={12} />
      {label}
    </label>
    {children}
  </div>
);

export default function BankDetails() {
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(initialData);
  const [showAccount, setShowAccount] = useState(false);
  const [errors, setErrors] = useState({});

  const maskedAccount = "•••• •••• " + data.accountNumber.slice(-4);

  const validate = () => {
    const e = {};
    if (!draft.bankName.trim()) e.bankName = "Required";
    if (!draft.accountHolder.trim()) e.accountHolder = "Required";
    if (!/^\d{9,18}$/.test(draft.accountNumber)) e.accountNumber = "Must be 9–18 digits";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(draft.ifscCode)) e.ifscCode = "Invalid IFSC format";
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(draft.panCard)) e.panCard = "Invalid PAN format";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setData(draft);
    setEditMode(false);
    setErrors({});
  };

  const handleCancel = () => {
    setDraft(data);
    setErrors({});
    setEditMode(false);
  };

  const inputClass = (field) =>
    `w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition
    focus:bg-white focus:ring-2 focus:ring-indigo-300 ${
      errors[field] ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-indigo-400"
    } ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Profile</p>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">Bank Details</h1>
          </div>
          {!editMode ? (
            <button
              onClick={() => { setDraft(data); setEditMode(true); }}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
            >
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition">
                <Save size={14} /> Save
              </button>
            </div>
          )}
        </div>

        {/* Card visual */}
        <div className="mb-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs opacity-60 uppercase tracking-widest font-semibold">Bank Name</p>
              <p className="text-lg font-bold mt-0.5">{data.bankName}</p>
            </div>
            <CreditCard size={32} className="opacity-40" />
          </div>
          <div className="mb-4">
            <p className="text-xl tracking-[0.2em] font-mono font-semibold">
              {showAccount ? data.accountNumber.match(/.{1,4}/g)?.join(" ") : maskedAccount}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-60 uppercase tracking-widest">Account Holder</p>
              <p className="font-semibold mt-0.5">{data.accountHolder}</p>
            </div>
            <button
              onClick={() => setShowAccount(v => !v)}
              className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition font-medium"
            >
              {showAccount ? <EyeOff size={13} /> : <Eye size={13} />}
              {showAccount ? "Hide" : "Reveal"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Bank Name" icon={Building}>
              <input
                className={inputClass("bankName")}
                value={editMode ? draft.bankName : data.bankName}
                disabled={!editMode}
                onChange={e => setDraft(p => ({ ...p, bankName: e.target.value }))}
              />
              {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
            </Field>

            <Field label="Account Holder Name" icon={FileText}>
              <input
                className={inputClass("accountHolder")}
                value={editMode ? draft.accountHolder : data.accountHolder}
                disabled={!editMode}
                onChange={e => setDraft(p => ({ ...p, accountHolder: e.target.value }))}
              />
              {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder}</p>}
            </Field>

            <Field label="Account Number" icon={CreditCard}>
              <div className="relative">
                <input
                  className={inputClass("accountNumber") + " pr-10"}
                  value={editMode ? draft.accountNumber : (showAccount ? data.accountNumber : maskedAccount)}
                  disabled={!editMode}
                  onChange={e => setDraft(p => ({ ...p, accountNumber: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowAccount(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showAccount ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
            </Field>

            <Field label="IFSC / Routing Code" icon={Hash}>
              <input
                className={inputClass("ifscCode")}
                value={editMode ? draft.ifscCode : data.ifscCode}
                disabled={!editMode}
                onChange={e => setDraft(p => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
              />
              {errors.ifscCode && <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>}
            </Field>

            <Field label="PAN Card / Tax ID" icon={FileText}>
              <input
                className={inputClass("panCard")}
                value={editMode ? draft.panCard : data.panCard}
                disabled={!editMode}
                onChange={e => setDraft(p => ({ ...p, panCard: e.target.value.toUpperCase() }))}
              />
              {errors.panCard && <p className="text-xs text-red-500 mt-1">{errors.panCard}</p>}
            </Field>

            <Field label="Payment Method" icon={ChevronDown}>
              <div className="relative">
                <select
                  className={inputClass("paymentMethod") + " appearance-none pr-8"}
                  value={editMode ? draft.paymentMethod : data.paymentMethod}
                  disabled={!editMode}
                  onChange={e => setDraft(p => ({ ...p, paymentMethod: e.target.value }))}
                >
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
          </div>

          {!editMode && (
            <p className="text-xs text-slate-400 text-center pt-2">
              🔒 Your banking details are encrypted and stored securely.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}