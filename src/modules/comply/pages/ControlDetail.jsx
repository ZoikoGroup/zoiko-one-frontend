import { useParams, useNavigate } from "react-router-dom";
import { useControlDetail } from "../hooks/useComply";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";
import { ArrowLeft, Shield, User, Clock, BarChart3, Activity } from "lucide-react";

export default function ControlDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: control, loading } = useControlDetail(id);

  if (loading) return <div className="p-6 text-gray-500">Loading control details...</div>;
  if (!control) return <div className="p-6 text-gray-500">Control not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/comply/controls")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Controls Library
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">{control.code}</span>
              <StatusBadge status={control.status} />
              <StatusBadge status={control.effectiveness} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-2">{control.title}</h1>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Category</span>
            </div>
            <StatusBadge status={control.category} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium">Control Owner</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{control.owner}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Testing Frequency</span>
            </div>
            <StatusBadge status={control.frequency} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium">Effectiveness</span>
            </div>
            <StatusBadge status={control.effectiveness} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{control.description}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Testing History
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Test Cycle Q{i} 2026</p>
                  <p className="text-xs text-gray-500">Tested by {["Sarah Chen", "Mike Johnson", "Anna Petrova"][i - 1]}</p>
                </div>
                <StatusBadge status={i === 2 ? "partially_effective" : "effective"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
