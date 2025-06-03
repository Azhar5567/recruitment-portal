// src/pages/RolesPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import {
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  // 🧠 Load from cache first (for fast load)
  useEffect(() => {
    const cached = sessionStorage.getItem('roles');
    if (cached) {
      setRoles(JSON.parse(cached));
      setLoading(false);
    }

    // 🔄 Real-time Firestore sync
    const unsub = onSnapshot(collection(db, 'roles'), (snapshot) => {
      const roleNames = snapshot.docs.map((doc) => doc.data().name || '').filter(Boolean);
      setRoles(roleNames);
      sessionStorage.setItem('roles', JSON.stringify(roleNames)); // Update cache
      setLoading(false);
    }, (error) => {
      console.error('Error fetching roles:', error);
      setLoading(false);
    });

    return () => unsub(); // Cleanup listener
  }, []);

  // ➕ Add new role to Firestore
  const addRole = async () => {
    const trimmed = newRole.trim();
    if (trimmed && !roles.includes(trimmed)) {
      try {
        await addDoc(collection(db, 'roles'), { name: trimmed });
        setNewRole('');
      } catch (err) {
        console.error('Error adding role:', err);
      }
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

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
          <p className="text-gray-500">No roles added yet. Use the form above to create one.</p>
        ) : (
          <ul className="space-y-2">
            {roles.sort().map((role) => (
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
