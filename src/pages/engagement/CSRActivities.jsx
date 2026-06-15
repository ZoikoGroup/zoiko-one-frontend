import React, { useState, useEffect } from 'react';
import { api } from '../../service/api';

export const CSRActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api.get('/engagement/csr/');
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CSR Activities</h1>
      {activities.length === 0 ? (
        <p>No CSR activities found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((act) => (
            <li key={act.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{act.title}</h2>
              <p>{act.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
