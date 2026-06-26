import { useState } from "react";

export default function UploadRequest() {
  const [form, setForm] = useState({ docType: "Identity Proof", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const history = [
    { docType: "Bank Statement",     requestedOn: "Jun 20, 2026", status: "Uploaded" },
    { docType: "Medical Certificate",requestedOn: "May 15, 2026", status: "Pending" },
    { docType: "Address Proof",      requestedOn: "Apr 10, 2026", status: "Uploaded" },
  ];

  const statusColor = {
    Uploaded: { color: "#059669", bg: "#ECFDF5" },
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
    Rejected: { color: "#DC2626", bg: "#FEF2F2" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Upload Request</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Request HR to upload or collect a document from you.</p>
      </div>

      {/* Request Form */}
      {!submitted ? (
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", maxWidth: "560px", marginBottom: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>New Upload Request</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Document Type</label>
              <select value={form.docType} onChange={(e) => setForm({ ...form, docType: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px" }}>
                {["Identity Proof", "Address Proof", "Bank Statement", "Medical Certificate", "Educational Certificate", "Previous Employment Docs"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Additional Note (optional)</label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} placeholder="Any specific details for HR..." style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => setSubmitted(true)} style={{ padding: "11px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Submit Request</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: "24px", borderRadius: "12px", background: "#ECFDF5", border: "1.5px solid #6EE7B7", maxWidth: "560px", marginBottom: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", fontWeight: "700", color: "#059669", margin: "0 0 8px 0" }}>✓ Request Submitted!</p>
          <p style={{ fontSize: "13px", color: "#065F46", margin: "0 0 16px 0" }}>HR will process your request and notify you shortly.</p>
          <button onClick={() => setSubmitted(false)} style={{ padding: "9px 20px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>New Request</button>
        </div>
      )}

      {/* History */}
      <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Upload History</h3>
        {history.map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 2px 0" }}>{h.docType}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Requested on {h.requestedOn}</p>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[h.status].color, background: statusColor[h.status].bg }}>{h.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}