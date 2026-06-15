import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Travel() {
  const records = [
    { id: 'TR-902', employee: 'Sarah Connor', location: 'Berlin, DE', event: 'Tech Summit 2026', expense: '$1,430', status: 'Approved' },
    { id: 'TR-903', employee: 'John Connor', location: 'Austin, TX', event: 'Client Architecture Sync', expense: '$890', status: 'Processing' },
  ];

  return (
    <HRPage title="Travel & Expense Auditing" subtitle="Authorize travel workflows, monitor hotel configurations, and manage corporate spend.">
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Corporate Travel Dispatches</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all">New Authorization</button>
          </div>
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Traveler</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Purpose</th>
                <th className="px-6 py-3">Projected Cost</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {records.map(rec => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-gray-400">{rec.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{rec.employee}</td>
                  <td className="px-6 py-4 text-gray-700">{rec.location}</td>
                  <td className="px-6 py-4 text-gray-500">{rec.event}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{rec.expense}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${rec.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}