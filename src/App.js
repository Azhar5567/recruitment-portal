// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import RoleDetail from './pages/RoleDetail';
import CandidateDetail from './pages/CandidateDetail';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Help from './pages/Help';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-4">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
        <p className="text-lg text-gray-700">Page not found</p>
        <a
          href="/"
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/roles/:roleId" element={<RoleDetail />} />
        <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
