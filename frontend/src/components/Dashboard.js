import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/health_records', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHealthRecords(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch health records. Please try again later.');
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Your Health Records</h3>
      {healthRecords.length === 0 ? (
        <p>No health records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Symptoms</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {healthRecords.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.created_at).toLocaleDateString()}</td>
                <td>{record.symptoms}</td>
                <td>{record.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;