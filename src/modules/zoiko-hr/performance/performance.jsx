import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Performance() {
  const reviews = [
    { id: 1, name: 'Alice Smith', department: 'Engineering', cycle: 'Q2 2026', rating: '4.8/5.0', status: 'Completed' },
    { id: 2, name: 'Brian Miller', department: 'Product', cycle: 'Q2 2026', rating: 'Pending', status: 'In Review' },
    { id: 3, name: 'Clara Oswald', department: 'Marketing', cycle: 'Q2 2026', rating: '4.2/5.0', status: 'Completed' },
    { id: 4, name: 'Danny Pink', department: 'HR', cycle: 'Q2 2026', rating: 'Pending', status: 'Self Appraisal' },
  ];

  return (
    <HRPage title="Performance Evaluations" subtitle="Establish appraisal tracks, handle manager feedback logs, and monitor internal metrics.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-medium opacity-80 uppercase tracking-wide">Active Appraisal Cycle</h4>
            <p className="text-2xl font-bold mt-2">Q2 Mid-Year Review 2026</p>
            <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[65%]" />
            </div>
            <p className="text-xs opacity-90 mt-2">65% of assessments finalized</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Avg Rating</h4>
              <p className="text-3xl font-extrabold text-gray-800 mt-2">4.42 <span className="text-sm font-normal text-gray-400">/ 5.0</span></p>
            </div>
            <span className="text-xs text-green-600 font-medium">↑ +0.12 vs last cycle</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Action Required</h4>
              <p className="text-3xl font-extrabold text-amber-500 mt-2">18 Reviews</p>
            </div>
            <span className="text-xs text-gray-500">Awaiting manager completion metrics</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Evaluations Register</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Configure Weights & OKRs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Team Member</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Cycle Frame</th>
                  <th className="px-6 py-3">Score Outcome</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 text-gray-600">{r.department}</td>
                    <td className="px-6 py-4 font-mono text-xs">{r.cycle}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{r.rating}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        r.status === 'In Review' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:underline">Open Matrix</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}