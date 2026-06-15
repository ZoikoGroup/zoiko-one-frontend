import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useInterviews } from "../hooks/useRecruitment";
import { formatDate } from "../utils/helpers";

export default function InterviewFeedback() {
  const { data: interviews, loading } = useInterviews();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const completed = interviews.filter((i) => i.status === "completed");

  const feedbackData = completed.map((i, idx) => ({
    id: i.id,
    candidate: i.candidate,
    position: i.position,
    date: i.date,
    interviewers: i.interviewers,
    rating: [4, 5, 3, 4][idx % 4],
    strengths: ["Technical skills", "Communication", "Problem solving", "Leadership"][idx % 4],
    areas: ["System design", "Team collaboration", "Time management", "Delegation"][idx % 4],
    decision: ["advance", "advance", "hold", "advance"][idx % 4],
    notes: "Strong candidate with relevant experience. Recommended for next round.",
  }));

  if (search) {
    const q = search.toLowerCase();
    filtered = feedbackData.filter((f) => f.candidate.toLowerCase().includes(q));
  }
  var filtered = feedbackData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage interview feedback</p>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={[]} onFilterChange={() => {}} />

      <div className="space-y-4">
        {filtered.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{fb.candidate}</h3>
                <p className="text-sm text-gray-500">{fb.position} - {formatDate(fb.date)}</p>
              </div>
              <StatusBadge status={fb.decision} />
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Strengths</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">{fb.strengths}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Areas to Improve</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">{fb.areas}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
              <p>{fb.notes}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700">Submit Feedback</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
