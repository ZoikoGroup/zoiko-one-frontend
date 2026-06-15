import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, ExternalLink } from "lucide-react";
import { useCandidate } from "../hooks/useRecruitment";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: candidate, loading } = useCandidate(id);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;
  if (!candidate) return <div className="p-6 text-gray-400">Candidate not found</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Candidates
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-500 mt-1">{candidate.position}</p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" /> {candidate.email}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {candidate.phone}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /> {candidate.location || "Remote"}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-gray-400" /> Applied {formatDate(candidate.appliedDate)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Briefcase className="w-4 h-4 text-gray-400" /> {candidate.experience} years experience</div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><ExternalLink className="w-4 h-4 text-gray-400" /> Source: {candidate.source}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
            <div><p className="text-sm font-medium text-gray-900">Applied for position</p><p className="text-xs text-gray-400">{formatDate(candidate.appliedDate)}</p></div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
            <div><p className="text-sm font-medium text-gray-900">Under review by hiring manager</p><p className="text-xs text-gray-400">Pending</p></div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-gray-300" />
            <div><p className="text-sm font-medium text-gray-400">Interview scheduled</p><p className="text-xs text-gray-400">Not yet</p></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">Schedule Interview</button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Send Message</button>
        <button className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Reject</button>
      </div>
    </div>
  );
}
