import React, { useState } from 'react';
import { api } from '../../service/api';

export const WellnessForm = ({ program, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(program || { title: '', description: '', is_active: true });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (program) {
        await api.put(`/engagement/wellness/${program.id}`, formData);
      } else {
        await api.post('/engagement/wellness/', formData);
      }
      onSubmit();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
      <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" required />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={submitting}>Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
};
