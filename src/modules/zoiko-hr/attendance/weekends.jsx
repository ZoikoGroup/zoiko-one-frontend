import { useState, useEffect, useMemo } from "react";
import { Save } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getWeekendConfigs, createWeekendConfig, updateWeekendConfig, deleteWeekendConfig,
} from "../../../service/hrService";



const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];



export default function WeekendConfig() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editDescriptions, setEditDescriptions] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeekendConfigs();
        if (mounted) {
          const list = Array.isArray(data) ? data : data?.items || data?.configs || [];
          setConfigs(list);
          const descs = {};
          list.forEach((c) => { descs[c.day_of_week ?? c.day] = c.description || ""; });
          setEditDescriptions(descs);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load weekend config");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const getConfigForDay = (dayValue) => {
    return configs.find((c) => (c.day_of_week ?? c.day) === dayValue);
  };

  const handleToggleWeekend = async (dayValue, current) => {
    try {
      const existing = getConfigForDay(dayValue);
      if (existing) {
        await updateWeekendConfig(existing.id, { is_weekend: !current });
      } else {
        await createWeekendConfig({ day_of_week: dayValue, is_weekend: true, is_alternate: false });
      }
      const data = await getWeekendConfigs();
      const list = Array.isArray(data) ? data : data?.items || data?.configs || [];
      setConfigs(list);
    } catch (err) {
      setError(err.message || "Failed to update weekend config");
    }
  };

  const handleToggleAlternate = async (dayValue, current) => {
    try {
      const existing = getConfigForDay(dayValue);
      if (existing) {
        await updateWeekendConfig(existing.id, { is_alternate: !current });
      } else {
        await createWeekendConfig({ day_of_week: dayValue, is_weekend: false, is_alternate: true });
      }
      const data = await getWeekendConfigs();
      const list = Array.isArray(data) ? data : data?.items || data?.configs || [];
      setConfigs(list);
    } catch (err) {
      setError(err.message || "Failed to update alternate config");
    }
  };

  const handleDescriptionChange = (dayValue, value) => {
    setEditDescriptions((prev) => ({ ...prev, [dayValue]: value }));
  };

  const handleSaveDescriptions = async () => {
    setSaving(true);
    try {
      for (const dayValue of Object.keys(editDescriptions)) {
        const existing = getConfigForDay(Number(dayValue));
        if (existing) {
          await updateWeekendConfig(existing.id, { description: editDescriptions[dayValue] });
        }
      }
      const data = await getWeekendConfigs();
      const list = Array.isArray(data) ? data : data?.items || data?.configs || [];
      setConfigs(list);
    } catch (err) {
      setError(err.message || "Failed to save descriptions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <HRPage title="Weekend Configuration" subtitle="Configure weekly off rules and alternate Saturdays">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading weekend configuration...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Weekend Configuration" subtitle="Configure weekly off rules and alternate Saturdays">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekend Configuration</h1>
            <p className="text-sm text-gray-500 mt-1">Define weekly off days and alternate weekend rules</p>
          </div>
          <button onClick={handleSaveDescriptions} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Day of Week</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Is Weekend</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Is Alternate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {DAYS_OF_WEEK.map((day) => {
                  const config = getConfigForDay(day.value);
                  const isWeekend = config?.is_weekend || false;
                  const isAlternate = config?.is_alternate || false;
                  const dayName = day.label;
                  return (
                    <tr key={day.value} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dayName}</td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={isWeekend} onChange={() => handleToggleWeekend(day.value, isWeekend)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                          <span className={`text-xs font-medium ${isWeekend ? "text-green-600" : "text-gray-400"}`}>
                            {isWeekend ? "Weekend" : "Working Day"}
                          </span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={isAlternate} onChange={() => handleToggleAlternate(day.value, isAlternate)}
                            disabled={isWeekend}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed" />
                          <span className={`text-xs font-medium ${isAlternate ? "text-orange-600" : "text-gray-400"}`}>
                            {isAlternate ? "Alternate" : "Regular"}
                          </span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" value={editDescriptions[day.value] || ""}
                          onChange={(e) => handleDescriptionChange(day.value, e.target.value)}
                          className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="Add description..." />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-indigo-800 mb-2">Regional Weekend Rules</h3>
          <p className="text-xs text-indigo-600">
            Configure alternate Saturday rules for different regions or departments. Days marked as "Alternate" are treated as weekends
            on alternating weeks. Use the description field to specify regional rules or additional notes.
          </p>
        </div>
      </div>
    </HRPage>
  );
}

