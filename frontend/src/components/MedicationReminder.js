import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MedicationReminder() {
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/medications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMedication({ ...newMedication, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/medications', newMedication, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedications();
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        start_date: '',
        end_date: ''
      });
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  return (
    <div>
      <h2>Medication Reminder</h2>
      <form onSubmit={handleSubmit}>
        {/* Your form inputs here */}
      </form>
      <h3>Your Medications</h3>
      <ul>
        {medications.map((med) => (
          <li key={med.id}>
            {med.name} - {med.dosage} - {med.frequency}
            (From: {new Date(med.start_date).toLocaleDateString()}
            {med.end_date ? ` To: ${new Date(med.end_date).toLocaleDateString()}` : ''})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicationReminder;