import React, { useState } from 'react';
import HRPage from '../../../components/HRPage';

export default function Workforce() {
  const [staff] = useState([
    { id: 'EMP-01', name: 'Diana Prince', role: 'Solutions Architect', email: 'diana@zoiko.io', status: 'Active' },
    { id: 'EMP-02', name: 'Bruce Wayne', role: 'Security Manager', email: 'bruce@zoiko.io', status: 'Active' },
    { id: 'EMP-03', name: 'Clark Kent', role: 'Public Relations', email: 'clark@zoiko.io', status: 'On Leave' },
  ]);

  return (
    <HRPage title="Workforce Management" subtitle="Access global profile parameters, update worker access controls, and view standard roles.">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Assigned Role</th>
              <th className="px-6 py-3">Email Context</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono font-medium text-xs">{member.id}</td>
                <td className="px-6 py-4 text-gray-900 font-bold">{member.name}</td>
                <td className="px-6 py-4 text-gray-600">{member.role}</td>
                <td className="px-6 py-4 text-xs font-mono">{member.email}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HRPage>
  );
}