// src/pages/RolesPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('roles') || '[]');
    setRoles(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  const addRole = () => {
    const trimmed = newRole.trim();
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed]);
      setNewRole('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Job Roles</h2>

        <div className="mb-6">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Enter a new role"
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-3 focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <button
            onClick={addRole}
            disabled={!newRole.trim() || roles.includes(newRole.trim())}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition disabled:opacity-40"
          >
            Add Role
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Available Roles</h3>
        {roles.length === 0 ? (
          <p className="text-gray-500">No roles added yet.</p>
        ) : (
          <ul className="space-y-2">
            {[...roles].sort().map((role) => (
              <li key={role}>
                <Link
                  to={`/roles/${encodeURIComponent(role)}`}
                  className="block w-full text-center py-2 border border-gray-200 rounded-md hover:bg-gray-100 transition"
                >
                  {role}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}


