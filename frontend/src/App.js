import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HealthCheck from './components/HealthCheck';
import UserProfile from './components/UserProfile';
import PrivateRoute from './utils/PrivateRoute';
import MedicationReminder from './components/MedicationReminder';
import HealthDataVisualization from './components/HealthDataVisualization';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/health-check">Health Check</Link></li>
            <li><Link to="/medications">Medications</Link></li>
            <li><Link to="/health-data">Health Data</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-check" element={<HealthCheck />} />
            <Route path="/medications" element={<MedicationReminder />} />
            <Route path="/health-data" element={<HealthDataVisualization />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;