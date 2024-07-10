import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HealthCheck() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/health_check',
        { symptoms },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Health check submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit health check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Health Check</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter your symptoms (comma-separated)"
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default HealthCheck;