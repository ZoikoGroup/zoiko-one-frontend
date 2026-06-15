import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Compliance() {
  const issues = [
    { title: 'I-9 Document Refresh Cycle', target: '4 Employees', due: 'In 3 days', security: 'High' },
    { title: 'ISO 27001 Access Audit Sign-off', target: 'Global Infrastructure', due: 'In 12 days', security: 'Critical' },
  ];

  return (
    <HRPage title="Compliance & Workplace Risk" subtitle="Track document status, monitor training validations, and manage auditing tools.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Critical Operational Tasks</h3>
            <div className="space-y-3">
              {issues.map((iss, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{iss.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Applies to: {iss.target} • Deadline: <span className="text-red-500 font-semibold">{iss.due}</span></p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${iss.security === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {iss.security}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}