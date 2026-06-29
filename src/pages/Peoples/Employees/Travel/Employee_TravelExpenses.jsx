import { useState } from "react";

export default function TravelExpenses() {
  const [showForm, setShowForm] = useState(false);

  const expenses = [
    { id: "EXP-001", trip: "Mumbai (Jun 25–27)", category: "Hotel",     amount: "₹6,500",  status: "Reimbursed" },
    { id: "EXP-002", trip: "Mumbai (Jun 25–27)", category: "Flight",    amount: "₹8,200",  status: "Reimbursed" },
    { id: "EXP-003", trip: "Pune (Jun 10)",      category: "Cab",       amount: "₹1,800",  status: "Reimbursed" },
    { id: "EXP-004", trip: "Delhi (Jul 5)",      category: "Meals",     amount: "₹2,400",  status: "Pending" },
    { id: "EXP-005", trip: "Delhi (Jul 5)",      category: "Transport", amount: "₹3,100",  status: "Pending" },
  ];

  const statusColor = {
    Reimbursed: { color: "#059669", bg: "#ECFDF5" },
    Pending:    { color: "#D97706", bg: "#FFFBEB" },
    Rejected:   { color: "#DC2626", bg: "#FEF2F2" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Travel Expenses</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Submit and track your business travel reimbursements.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          + Claim Expense
        </button>
      </div>

      {showForm && (
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #059669", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>New Expense Claim</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            {[["Trip", "text", "e.g. Mumbai Visit"], ["Category", "text", "e.g. Hotel, Flight"], ["Amount (₹)", "number", "0"]].map(([label, type, placeholder]) => (
              <div key={label}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>{label}</label>
                <input type={type} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", background: "white", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            <button style={{ padding: "9px 20px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Submit Claim</button>
          </div>
        </div>
      )}

      <div style={{ borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Expense ID", "Trip", "Category", "Amount", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#9CA3AF", fontWeight: "600" }}>{e.id}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#111827" }}>{e.trip}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>{e.category}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: "700", color: "#111827" }}>{e.amount}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[e.status].color, background: statusColor[e.status].bg }}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}