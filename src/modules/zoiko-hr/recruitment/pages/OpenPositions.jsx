import { useJobRequisitions } from "../hooks/useRecruitment";
import StatusBadge from "../components/StatusBadge";
import { MapPin, Building2, Clock, Users } from "lucide-react";

export default function OpenPositions() {
  const { data: jobs, loading } = useJobRequisitions();
  const open = jobs.filter((j) => j.status === "open" || j.status === "draft");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p className="text-sm text-gray-500 mt-1">{open.length} positions currently open</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {open.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <StatusBadge status={job.priority} />
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {job.department}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> {job.openings} openings
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Created {job.createdDate}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700">Apply Now</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
