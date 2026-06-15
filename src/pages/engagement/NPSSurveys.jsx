import React, { useState, useEffect } from 'react';
import { api } from '../../service/api';

export const NPSSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await api.get('/engagement/nps/');
        setSurveys(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">NPS Surveys</h1>
      {surveys.length === 0 ? (
        <p>No NPS surveys found.</p>
      ) : (
        <ul className="space-y-4">
          {surveys.map((s) => (
            <li key={s.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">Survey ID: {s.id}</h2>
              <p>Score: {s.score}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
