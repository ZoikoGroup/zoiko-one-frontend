import React from 'react';
import HRPage from '../../../components/HRPage';

export default function WorkforcePlanning() {
  return (
    <HRPage title="Workforce Structure Planning" subtitle="Forecast headcount limits, review upcoming department allocations, and handle budget approvals.">
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-2">Structural Forecast Overviews</h3>
        <p className="text-sm text-gray-500 max-w-xl">
          Review talent gaps across upcoming development sprints. Track real-time budget variations, contractor conversions, and predictive attrition data.
        </p>
        <div className="mt-6 border-t pt-4">
          <button className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
            Initialize Projection Model
          </button>
        </div>
      </div>
    </HRPage>
  );
}