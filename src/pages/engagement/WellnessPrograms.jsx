import React, { useState, useEffect } from 'react';
import { api } from '../../service/api';
import { WellnessForm } from './WellnessForm';

export const WellnessPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProgram, setEditProgram] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await api.get('/engagement/wellness/');
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this wellness program?")) {
      await api.delete(`/engagement/wellness/${id}`);
      fetchPrograms();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Wellness Programs</h1>
        <button onClick={() => { setEditProgram(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
      </div>
      {showForm && <WellnessForm program={editProgram} onSubmit={() => { setShowForm(false); fetchPrograms(); }} onCancel={() => setShowForm(false)} />}
      <ul className="space-y-4">
        {programs.map((prog) => (
          <li key={prog.id} className="p-4 border rounded shadow flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{prog.title}</h2>
              <p>{prog.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditProgram(prog); setShowForm(true); }} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(prog.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
