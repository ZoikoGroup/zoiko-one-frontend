import { useState } from "react";
import { Plus, Star, Trash2, Edit3, Save, X, Phone, MapPin, Users } from "lucide-react";

const RELATIONSHIPS = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Guardian", "Other"];

const initialContacts = [
  {
    id: 1,
    name: "Sunita Mehta",
    relationship: "Spouse",
    primaryPhone: "+91 94456 78901",
    alternatePhone: "+91 80123 45678",
    address: "42, Jubilee Hills, Hyderabad, Telangana - 500033",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Ramesh Mehta",
    relationship: "Parent",
    primaryPhone: "+91 91234 56789",
    alternatePhone: "",
    address: "12, Laxmi Nagar, Nagpur, Maharashtra - 440001",
    isPrimary: false,
  },
];

const emptyContact = {
  name: "", relationship: "Spouse",
  primaryPhone: "", alternatePhone: "", address: "", isPrimary: false,
};

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
      <Icon size={11} /> {label}
    </label>
    {children}
  </div>
);

const inputCls = (err) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 outline-none
   focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition
   ${err ? "border-red-300 bg-red-50" : "border-slate-200"}`;

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});

  const validate = (c) => {
    const e = {};
    if (!c.name.trim()) e.name = "Required";
    if (!/^\+?\d[\d\s\-]{8,14}$/.test(c.primaryPhone)) e.primaryPhone = "Invalid phone";
    if (c.alternatePhone && !/^\+?\d[\d\s\-]{8,14}$/.test(c.alternatePhone)) e.alternatePhone = "Invalid phone";
    if (!c.address.trim()) e.address = "Required";
    return e;
  };

  const handleEdit = (c) => { setEditingId(c.id); setDraft({ ...c }); setErrors({}); };
  const handleCancelEdit = () => { setEditingId(null); setDraft(null); setErrors({}); };

  const handleSave = (id) => {
    const e = validate(draft);
    if (Object.keys(e).length) { setErrors(e); return; }
    setContacts(cs => cs.map(c => c.id === id ? { ...draft } : c));
    setEditingId(null); setDraft(null); setErrors({});
  };

  const handleDelete = (id) => setContacts(cs => cs.filter(c => c.id !== id));

  const handleSetPrimary = (id) => {
    setContacts(cs => cs.map(c => ({ ...c, isPrimary: c.id === id })));
  };

  const handleAdd = () => {
    const e = validate(newContact);
    if (Object.keys(e).length) { setErrors(e); return; }
    setContacts(cs => [...cs, { ...newContact, id: Date.now() }]);
    setNewContact(emptyContact); setShowAdd(false); setErrors({});
  };

  const ContactCard = ({ contact }) => {
    const isEditing = editingId === contact.id;
    const c = isEditing ? draft : contact;

    return (
      <div className={`bg-white rounded-2xl border shadow-sm transition ${contact.isPrimary ? "border-indigo-200 shadow-indigo-100" : "border-slate-100"}`}>
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              contact.isPrimary ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
            }`}>
              {contact.name.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{contact.name}</span>
                {contact.isPrimary && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    <Star size={10} fill="currentColor" /> Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{contact.relationship}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {!contact.isPrimary && !isEditing && (
              <button onClick={() => handleSetPrimary(contact.id)} title="Set as primary" className="p-2 rounded-xl hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition">
                <Star size={15} />
              </button>
            )}
            {!isEditing ? (
              <>
                <button onClick={() => handleEdit(contact)} className="p-2 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => handleDelete(contact.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
                  <Trash2 size={15} />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancelEdit} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition"><X size={15} /></button>
                <button onClick={() => handleSave(contact.id)} className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl transition">
                  <Save size={13} /> Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <Field label="Full Name" icon={Users}>
                <input className={inputCls(errors.name)} value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </Field>
              <Field label="Relationship" icon={Users}>
                <select className={inputCls()} value={draft.relationship} onChange={e => setDraft(p => ({ ...p, relationship: e.target.value }))}>
                  {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Primary Phone" icon={Phone}>
                <input className={inputCls(errors.primaryPhone)} value={draft.primaryPhone} onChange={e => setDraft(p => ({ ...p, primaryPhone: e.target.value }))} />
                {errors.primaryPhone && <p className="text-xs text-red-500 mt-1">{errors.primaryPhone}</p>}
              </Field>
              <Field label="Alternate Phone" icon={Phone}>
                <input className={inputCls(errors.alternatePhone)} value={draft.alternatePhone} onChange={e => setDraft(p => ({ ...p, alternatePhone: e.target.value }))} placeholder="Optional" />
                {errors.alternatePhone && <p className="text-xs text-red-500 mt-1">{errors.alternatePhone}</p>}
              </Field>
              <div className="md:col-span-2">
                <Field label="Home Address" icon={MapPin}>
                  <input className={inputCls(errors.address)} value={draft.address} onChange={e => setDraft(p => ({ ...p, address: e.target.value }))} />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </Field>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide flex items-center gap-1"><Phone size={10} /> Primary Phone</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{contact.primaryPhone}</p>
              </div>
              {contact.alternatePhone && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide flex items-center gap-1"><Phone size={10} /> Alternate Phone</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{contact.alternatePhone}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide flex items-center gap-1"><MapPin size={10} /> Home Address</p>
                <p className="text-sm text-slate-700 mt-1">{contact.address}</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Profile</p>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">Emergency Contacts</h1>
          </div>
          <button
            onClick={() => { setShowAdd(true); setErrors({}); }}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200"
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>

        <div className="space-y-4">
          {contacts.sort((a, b) => b.isPrimary - a.isPrimary).map(c => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>

        {/* Add New Contact Form */}
        {showAdd && (
          <div className="mt-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">New Contact</h3>
              <button onClick={() => { setShowAdd(false); setErrors({}); setNewContact(emptyContact); }} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" icon={Users}>
                <input className={inputCls(errors.name)} value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </Field>
              <Field label="Relationship" icon={Users}>
                <select className={inputCls()} value={newContact.relationship} onChange={e => setNewContact(p => ({ ...p, relationship: e.target.value }))}>
                  {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Primary Phone" icon={Phone}>
                <input className={inputCls(errors.primaryPhone)} value={newContact.primaryPhone} onChange={e => setNewContact(p => ({ ...p, primaryPhone: e.target.value }))} placeholder="+91 98765 43210" />
                {errors.primaryPhone && <p className="text-xs text-red-500 mt-1">{errors.primaryPhone}</p>}
              </Field>
              <Field label="Alternate Phone" icon={Phone}>
                <input className={inputCls(errors.alternatePhone)} value={newContact.alternatePhone} onChange={e => setNewContact(p => ({ ...p, alternatePhone: e.target.value }))} placeholder="Optional" />
                {errors.alternatePhone && <p className="text-xs text-red-500 mt-1">{errors.alternatePhone}</p>}
              </Field>
              <div className="md:col-span-2">
                <Field label="Home Address" icon={MapPin}>
                  <input className={inputCls(errors.address)} value={newContact.address} onChange={e => setNewContact(p => ({ ...p, address: e.target.value }))} placeholder="Full home address" />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </Field>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowAdd(false); setErrors({}); setNewContact(emptyContact); }} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition">
                Add Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}