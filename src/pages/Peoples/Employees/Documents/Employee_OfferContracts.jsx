export default function OfferContracts() {
  const docs = [
    { name: "Offer Letter",             date: "Jan 5, 2024",  type: "Offer",    size: "420 KB" },
    { name: "Employment Contract",      date: "Jan 10, 2024", type: "Contract", size: "780 KB" },
    { name: "NDA Agreement",            date: "Jan 10, 2024", type: "Legal",    size: "310 KB" },
    { name: "Appraisal Letter 2025",    date: "Apr 1, 2025",  type: "Appraisal",size: "250 KB" },
    { name: "Revised Offer – Apr 2025", date: "Apr 1, 2025",  type: "Offer",    size: "430 KB" },
  ];

  const typeColor = {
    Offer:     { color: "#4F46E5", bg: "#EEF2FF" },
    Contract:  { color: "#059669", bg: "#ECFDF5" },
    Legal:     { color: "#DC2626", bg: "#FEF2F2" },
    Appraisal: { color: "#D97706", bg: "#FFFBEB" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Offer & Contracts</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Your employment agreements, offer letters, and legal documents.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {docs.map((d, i) => (
          <div key={i} style={{ padding: "20px 24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: typeColor[d.type].bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📃</div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>{d.name}</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px", color: typeColor[d.type].color, background: typeColor[d.type].bg }}>{d.type}</span>
                  <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{d.date} · {d.size}</span>
                </div>
              </div>
            </div>
            <button style={{ padding: "8px 16px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}