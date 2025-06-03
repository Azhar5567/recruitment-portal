// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RolesPage from './pages/RolesPage';
import RequirementDetail from './pages/RequirementDetail';

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
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/roles/:roleName" element={<RequirementDetail />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

