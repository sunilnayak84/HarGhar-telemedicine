import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HealthDataVisualization() {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/health_records', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Process the data for visualization
      const processedData = response.data.map(record => ({
        date: new Date(record.created_at).toLocaleDateString(),
        severity: record.severity === 'low' ? 1 : record.severity === 'medium' ? 2 : 3
      }));

      setHealthData(processedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch health data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Health Data Visualization</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={healthData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="severity" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HealthDataVisualization;