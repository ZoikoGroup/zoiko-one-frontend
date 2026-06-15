import { useState } from "react";
import { Plus, Star, MessageSquare, User } from "lucide-react";
import { useFeedback } from "../hooks/usePerformance";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

export default function ContinuousFeedback() {
  const { data: feedback, loading } = useFeedback();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = search
    ? feedback.filter((f) => f.from.toLowerCase().includes(search.toLowerCase()) || f.to.toLowerCase().includes(search.toLowerCase()))
    : feedback;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Continuous Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time peer, manager, and self feedback</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Give Feedback
        </button>
      </div>

      <div className="relative max-w-sm">
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="space-y-4">
        {filtered.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{fb.from} <span className="text-gray-400 font-normal">→</span> {fb.to}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={fb.type} />
                    <span className="text-xs text-gray-400">{formatDate(fb.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
              <p>"{fb.content}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
