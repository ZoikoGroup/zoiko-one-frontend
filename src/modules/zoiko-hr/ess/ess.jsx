import React from 'react';
import HRPage from '../../../components/HRPage';

export default function ESS() {
  return (
    <HRPage title="Employee Self Service" subtitle="View personal metrics, update credentials, manage benefits, and access payslips.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-base mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Legal First Name</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none" defaultValue="Alexander" disabled />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Legal Last Name</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none" defaultValue="Pierce" disabled />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Personal Email Address</label>
                <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue="alex.p@zoiko.io" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Primary Contact Number</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue="+1 (555) 019-2834" />
              </div>
            </div>
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Save Account Revisions
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-base mb-3">Quick Dispatches</h3>
            <div className="space-y-2">
              <button className="w-full text-left border border-gray-100 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2.5 rounded-lg font-medium transition-all flex justify-between items-center">
                <span>File Expense Requisition</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full text-left border border-gray-100 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2.5 rounded-lg font-medium transition-all flex justify-between items-center">
                <span>Download May Payslip</span>
                <span className="text-gray-400">↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}