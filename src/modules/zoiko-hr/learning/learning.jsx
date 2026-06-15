import React from 'react';
import HRPage from '../../../components/HRPage';

export default function Learning() {
  const courses = [
    { id: 'L-101', title: 'Data Privacy & Security Protocols', type: 'Compliance', duration: '2 hours', completionRate: '94%' },
    { id: 'L-102', title: 'Advanced Scaled Agile Framework (SAFe)', type: 'Upskilling', duration: '12 hours', completionRate: '42%' },
    { id: 'L-103', title: 'Inclusive Leadership Training', type: 'Management', duration: '4 hours', completionRate: '81%' },
  ];

  return (
    <HRPage title="Learning & Development" subtitle="Host corporate knowledge tracks, design training modules, and track certifications.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700">{course.type}</span>
                  <span className="text-xs text-gray-400 font-mono">{course.id}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base mt-3 leading-snug">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-2">Duration: {course.duration}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Staff Completion Rate</p>
                  <p className="text-lg font-extrabold text-gray-800">{course.completionRate}</p>
                </div>
                <button className="bg-gray-900 hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
                  Analyze Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPage>
  );
}