export default function Notifications() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Notifications
      </h2>

      <div className="space-y-4">
        <p>🔔 Payroll cycle due tomorrow</p>
        <p>🔔 3 organizations pending approval</p>
        <p>🔔 Revenue target achieved</p>
        <p>🔔 New enterprise customer onboarded</p>
      </div>
    </div>
  );
}