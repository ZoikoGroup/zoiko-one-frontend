import React, { useState } from 'react';
import HRPage from '../../../components/HRPage';

export default function Leave() {
  const [requests, setRequests] = useState([
    { id: 1, name: 'John Doe', type: 'Annual Leave', start: '2026-06-15', end: '2026-06-22', days: 6, status: 'Pending' },
    { id: 2, name: 'Jane Smith', type: 'Sick Leave', start: '2026-06-11', end: '2026-06-12', days: 1, status: 'Approved' },
    { id: 3, name: 'Robert Johnson', type: 'Maternity/Paternity', start: '2026-07-01', end: '2026-08-01', days: 31, status: 'Pending' },
  ]);

  const handleStatusChange = (id, nextStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: nextStatus } : req));
  };

  return (
    <HRPage title="Leave Management" subtitle="Track balances, approve configurations, and handle time-off requests.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-bold text-amber-500 mt-2">{requests.filter(r => r.status === 'Pending').length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Approved This Month</p>
            <p className="text-2xl font-bold text-green-600 mt-2">14 Employees</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">On Leave Today</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">4 Active</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Company Leave Balance Avg</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">18.5 Days</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Time-Off Requests Pipeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3 text-center">Days</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{req.name}</td>
                    <td className="px-6 py-4">{req.type}</td>
                    <td className="px-6 py-4 text-xs font-mono">{req.start} to {req.end}</td>
                    <td className="px-6 py-4 text-center font-semibold">{req.days}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        req.status === 'Approved' ? 'bg-green-50 text-green-700' :
                        req.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusChange(req.id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1.5 rounded font-medium transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleStatusChange(req.id, 'Rejected')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded font-medium transition-colors">
                            Deny
                          </button>
                        </>
                      )}
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