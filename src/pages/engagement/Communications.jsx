import React, { useState, useEffect } from 'react';
import { api } from '../../service/api';

export const Communications = () => {
  const [comms, setComms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComms = async () => {
      try {
        const data = await api.get('/engagement/communication/');
        setComms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Communications</h1>
      {comms.length === 0 ? (
        <p>No communications found.</p>
      ) : (
        <ul className="space-y-4">
          {comms.map((c) => (
            <li key={c.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
