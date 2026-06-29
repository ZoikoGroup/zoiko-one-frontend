import { useState } from "react";

export default function TravelSettings() {
  const [currency, setCurrency] = useState("INR");
  const [perDiem, setPerDiem] = useState("1500");
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Travel Settings</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Configure your personal travel preferences and limits.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Expense Preferences</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Preferred Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px" }}>
                {["INR", "USD", "EUR", "GBP"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Daily Per Diem Limit (₹)</label>
              <input type="number" value={perDiem} onChange={(e) => setPerDiem(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Approval Preferences</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>Auto-notify Manager</p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>Automatically notify your reporting manager for every travel request.</p>
            </div>
            <div onClick={() => setAutoApprove(!autoApprove)} style={{ width: "44px", height: "24px", borderRadius: "999px", cursor: "pointer", position: "relative", background: autoApprove ? "#4F46E5" : "#D1D5DB" }}>
              <div style={{ position: "absolute", top: "3px", width: "18px", height: "18px", borderRadius: "50%", background: "white", transition: "left 0.2s", left: autoApprove ? "23px" : "3px" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ padding: "10px 28px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}