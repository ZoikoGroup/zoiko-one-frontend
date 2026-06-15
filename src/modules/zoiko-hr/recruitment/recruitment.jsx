import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Recruitment() {
  const pipelines = [
    { id: 1, role: 'Senior React Developer', department: 'Engineering', candidates: 34, stage: 'Technical Assessment', openings: 2 },
    { id: 2, role: 'Lead Product Designer', department: 'Product', candidates: 18, stage: 'Portfolio Screening', openings: 1 },
    { id: 3, role: 'Talent Acquisition Partner', department: 'HR', candidates: 12, stage: 'Final Interview', openings: 1 },
    { id: 4, role: 'DevOps Infrastructure Specialist', department: 'Engineering', candidates: 9, stage: 'Sourcing Phase', openings: 1 },
  ];

  return (
    <HRPage title="Recruitment Hub" subtitle="Manage open requisitions, review candidates, and control the interview funnel.">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Active Jobs: </span>
              <span className="font-bold text-gray-800">5 Openings</span>
            </div>
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">In-Process Candidates: </span>
              <span className="font-bold text-blue-600">73 Applicants</span>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Create Job Requisition
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {pipelines.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800">{job.role}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">{job.department}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current Active Stage: <span className="text-blue-600 font-medium">{job.stage}</span></p>
              </div>
              
              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Target Slots</p>
                  <p className="text-sm font-bold text-gray-800">{job.openings}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Applicants</p>
                  <p className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{job.candidates}</p>
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-3 py-2 rounded-lg font-medium transition-all">
                    View Pipeline
                  </button>
                  <button className="bg-gray-900 hover:bg-black text-white text-xs px-3 py-2 rounded-lg font-medium transition-all">
                    Find Talent
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPage>
  );
}