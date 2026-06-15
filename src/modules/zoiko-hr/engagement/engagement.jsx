import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Engagement() {
  return (
    <HRPage title="Employee Engagement Indices" subtitle="Deploy satisfaction surveys, run pulse polls, and capture direct feedback safely.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-400 text-xs uppercase">Overall Pulse Score</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-gray-800">8.2</span>
              <span className="text-xs text-green-600 font-medium">↑ +0.4 MoM</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Aggregated from 88% response metrics</p>
          </div>
        </div>
      </div>
    </HRPage>
  );
}