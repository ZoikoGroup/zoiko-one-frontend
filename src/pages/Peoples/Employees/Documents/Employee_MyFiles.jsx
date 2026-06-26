import { useState } from "react";

export default function MyFiles() {
  const [search, setSearch] = useState("");

  const files = [
    { name: "Aadhar Card.pdf",         type: "Identity",    size: "1.2 MB", uploaded: "Jan 10, 2026" },
    { name: "PAN Card.pdf",            type: "Identity",    size: "800 KB", uploaded: "Jan 10, 2026" },
    { name: "Graduation Certificate.pdf", type: "Education", size: "2.1 MB", uploaded: "Feb 5, 2026" },
    { name: "Relieving Letter.pdf",    type: "Employment",  size: "500 KB", uploaded: "Mar 3, 2026" },
    { name: "Bank Statement.pdf",      type: "Financial",   size: "3.4 MB", uploaded: "Apr 14, 2026" },
    { name: "Medical Certificate.pdf", type: "Medical",     size: "900 KB", uploaded: "May 20, 2026" },
  ];

  const typeColor = {
    Identity:   "#4F46E5",
    Education:  "#059669",
    Employment: "#0EA5E9",
    Financial:  "#D97706",
    Medical:    "#DC2626",
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>My Files</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>All your personal documents in one place.</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", width: "220px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        {filtered.map((f) => (
          <div key={f.name} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${typeColor[f.type]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📄</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>{f.name}</p>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{f.size}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "999px", color: typeColor[f.type], background: `${typeColor[f.type]}15` }}>{f.type}</span>
              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{f.uploaded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}