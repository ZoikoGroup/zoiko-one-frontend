import React, { useState } from 'react';
import HRPage from '../../../components/HRPage';

export default function Departments() {
  const [departments, setDepartments] = useState([
    { id: 'DP-01', name: 'Engineering', head: 'Alex Rivers', employees: 42, budget: '$450,000', openRoles: 5 },
    { id: 'DP-02', name: 'Product Management', head: 'Sarah Jenkins', employees: 12, budget: '$180,000', openRoles: 2 },
    { id: 'DP-03', name: 'Marketing & Design', head: 'Michael Chang', employees: 18, budget: '$210,000', openRoles: 3 },
    { id: 'DP-04', name: 'Human Resources', head: 'Emma Watson', employees: 8, budget: '$95,000', openRoles: 1 },
    { id: 'DP-05', name: 'Finance & Legal', head: 'David Miller', employees: 6, budget: '$140,000', openRoles: 0 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeps = departments.filter(dep => 
    dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HRPage title="Departments Management" subtitle="Manage organizational structures, heads, and allocations.">
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="Search departments or heads..."
            className="w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeps.map((dep) => (
            <div key={dep.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{dep.id}</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1">{dep.name}</h3>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {dep.employees} Members
                </span>
              </div>
              <div className="space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Department Head:</span>
                  <span className="font-medium text-gray-900">{dep.head}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Budget:</span>
                  <span className="font-medium text-gray-900">{dep.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Roles:</span>
                  <span className={`font-medium ${dep.openRoles > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {dep.openRoles} Positions
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg text-xs transition-colors">
                  View Tree
                </button>
                <button className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium py-2 rounded-lg text-xs transition-colors">
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPage>
  );
}