import React, { useState, useEffect } from 'react';
import { api } from '../../service/api';
import { AnnouncementForm } from './AnnouncementForm';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await api.get('/engagement/announcement/');
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await api.delete(`/engagement/announcement/${id}`);
      fetchAnnouncements();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <button onClick={() => { setEditAnnouncement(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
      </div>
      {showForm && <AnnouncementForm announcement={editAnnouncement} onSubmit={() => { setShowForm(false); fetchAnnouncements(); }} onCancel={() => setShowForm(false)} />}
      <ul className="space-y-4">
        {announcements.map((ann) => (
          <li key={ann.id} className="p-4 border rounded shadow flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{ann.title}</h2>
              <p>{ann.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditAnnouncement(ann); setShowForm(true); }} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(ann.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
