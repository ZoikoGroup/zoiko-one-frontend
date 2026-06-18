import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../../../service/hrService";

export default function ZoikoHRCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCertifications();
      setCertifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load certifications");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return (
    <HRPage title="Certifications" subtitle="Manage employee certifications and track validity.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading certifications...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {certifications.length === 0 ? (
            <p className="text-gray-500 text-center">No certifications found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Employee ID</th>
                  <th className="text-left px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certifications.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{c.id}</td>
                    <td className="px-4 py-3">{c.employee_id}</td>
                    <td className="px-4 py-3">{c.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </HRPage>
  );
}
