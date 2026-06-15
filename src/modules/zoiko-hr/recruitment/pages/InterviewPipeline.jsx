import { useState } from "react";
import { Search, Calendar, ChevronRight, Phone, Video, User, Clock, CheckCircle2, XCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

const pipelineStages = [
  { id: "screening", label: "Screening" },
  { id: "phone_screen", label: "Phone Screen" },
  { id: "technical", label: "Technical" },
  { id: "cultural", label: "Cultural Fit" },
  { id: "final", label: "Final Round" },
  { id: "decision", label: "Decision" },
];

const initialCandidates = [
  { id: 1, name: "Alice Johnson", position: "Senior Frontend Dev", stage: "screening", date: "2025-04-01", type: "Phone", feedback: "", status: "pending" },
  { id: 2, name: "Bob Smith", position: "Backend Engineer", stage: "phone_screen", date: "2025-04-02", type: "Video Call", feedback: "Strong technical skills", status: "completed" },
  { id: 3, name: "Carol Davis", position: "Product Designer", stage: "technical", date: "2025-04-03", type: "On-site", feedback: "Good portfolio", status: "completed" },
  { id: 4, name: "David Lee", position: "DevOps Engineer", stage: "cultural", date: "2025-04-04", type: "Video Call", feedback: "Team fit excellent", status: "completed" },
  { id: 5, name: "Eva Martinez", position: "Senior Frontend Dev", stage: "final", date: "2025-04-05", type: "Panel", feedback: "Outstanding candidate", status: "completed" },
  { id: 6, name: "Frank Wilson", position: "Data Analyst", stage: "screening", date: "2025-04-06", type: "Phone", feedback: "", status: "pending" },
  { id: 7, name: "Grace Kim", position: "Backend Engineer", stage: "technical", date: "2025-04-07", type: "Video Call", feedback: "Needs improvement in system design", status: "pending" },
  { id: 8, name: "Henry Brown", position: "Product Manager", stage: "decision", date: "2025-04-08", type: "Panel", feedback: "Ready for offer", status: "completed" },
];

export default function InterviewPipeline() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState(initialCandidates);

  const filtered = search
    ? candidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.position.toLowerCase().includes(search.toLowerCase()))
    : candidates;

  const getStageCandidates = (stageId) => filtered.filter((c) => c.stage === stageId);

  const moveStage = (id, direction) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = pipelineStages.findIndex((s) => s.id === c.stage);
        const newIdx = Math.max(0, Math.min(pipelineStages.length - 1, idx + direction));
        return { ...c, stage: pipelineStages[newIdx].id };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Drag and drop candidates through interview stages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            <Calendar className="w-4 h-4" /> Schedule Interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {pipelineStages.map((stage) => {
          const stageCandidates = getStageCandidates(stage.id);
          return (
            <div key={stage.id} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-gray-700">{stage.label}</h3>
                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{stageCandidates.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {stageCandidates.map((c) => (
                  <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">{c.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 truncate">{c.position}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      {c.type === "Phone" ? <Phone className="w-3 h-3" /> : c.type === "Video Call" ? <Video className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                      <span>{c.type}</span>
                      <span className="mx-1">•</span>
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(c.date)}</span>
                    </div>
                    {c.feedback && <p className="text-xs text-gray-500 italic mb-2">"{c.feedback}"</p>}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <StatusBadge status={c.status} />
                      <div className="flex gap-1">
                        {pipelineStages.findIndex((s) => s.id === c.stage) > 0 && (
                          <button onClick={() => moveStage(c.id, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        )}
                        {pipelineStages.findIndex((s) => s.id === c.stage) < pipelineStages.length - 1 && (
                          <button onClick={() => moveStage(c.id, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
