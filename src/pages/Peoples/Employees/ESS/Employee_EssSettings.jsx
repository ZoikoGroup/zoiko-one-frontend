import { useState } from "react";

export default function EssSettings() {
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Settings</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Manage your personal preferences and notification settings.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Notifications */}
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Notification Preferences</h3>
          {[
            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "sms",   label: "SMS Notifications",   desc: "Receive alerts via SMS" },
            { key: "push",  label: "Push Notifications",  desc: "Browser push alerts" },
          ].map((n) => (
            <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{n.label}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{n.desc}</p>
              </div>
              <div
                onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                style={{
                  width: "44px", height: "24px", borderRadius: "999px", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  background: notifications[n.key] ? "#4F46E5" : "#D1D5DB",
                }}
              >
                <div style={{
                  position: "absolute", top: "3px", width: "18px", height: "18px", borderRadius: "50%", background: "white", transition: "left 0.2s",
                  left: notifications[n.key] ? "23px" : "3px",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Language & Timezone */}
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Regional Settings</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#111827" }}>
                {["English", "Hindi", "Telugu", "Tamil"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#111827" }}>
                {["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ padding: "10px 28px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}