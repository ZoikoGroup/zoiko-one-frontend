import { useEffect, useRef, useState } from "react";
import HRPage from "../../../../components/HRPage";
import { getLeaveTypeConfigs } from "../../../../service/employee";

export default function LeaveTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);

    getLeaveTypeConfigs()
      .then((data) => {
        if (!mounted.current) return;
        setTypes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (mounted.current) setError(err.message || "Failed to load leave types");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => { mounted.current = false; };
  }, []);

  if (loading) {
    return (
      <HRPage title="Leave Types" subtitle="Understand the different types of leaves and their policies.">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Leave Types" subtitle="Understand the different types of leaves and their policies.">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Types" subtitle="Understand the different types of leaves and their policies.">
      {types.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No leave types configured</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((t) => (
            <div key={t.id || t.code || t.name} className="p-5 rounded-xl bg-white border border-gray-200">
              <div className="flex justify-between items-start mb-2.5">
                <h3 className="text-base font-bold text-gray-900">{t.name}</h3>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    color: t.is_paid || t.paid ? "#059669" : "#DC2626",
                    background: t.is_paid || t.paid ? "#ECFDF5" : "#FEF2F2",
                  }}
                >
                  {t.is_paid || t.paid ? "Paid" : "Unpaid"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t.description || t.desc || ""}</p>
              <div className="flex gap-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Days / Year</p>
                  <p className="text-base font-extrabold text-indigo-600">
                    {(t.default_days_per_year ?? t.days ?? 0) === 0 ? "—" : t.default_days_per_year ?? t.days}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Carry Forward</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {t.carry_forward_allowed ? `Yes (max ${t.carry_forward_max_days || 0})` : "No"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </HRPage>
  );
}
