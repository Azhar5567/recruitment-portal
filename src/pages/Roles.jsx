// src/pages/Roles.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Header from '../components/Header';

export default function Roles() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [filter, setFilter] = useState('');

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Paused: 'bg-yellow-100 text-yellow-800',
    Closed: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate('/login');
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) return;
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'roles'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoles(data);
    };
    fetchRoles();
  }, [user]);

  const addRole = async () => {
    const name = roleName.trim();
    if (!name || !user) return;
    const ref = await addDoc(collection(db, 'users', user.uid, 'roles'), {
      name,
      status: 'Active'
    });
    setRoleName('');
    setRoles(prev => [...prev, { id: ref.id, name, status: 'Active' }]);
  };

  const deleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    await deleteDoc(doc(db, 'users', user.uid, 'roles', id));
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'users', user.uid, 'roles', id), { status: newStatus });
    setRoles(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Job Roles</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="New role name"
            className="border px-3 py-2 rounded w-full sm:w-60"
          />
          <button
            onClick={addRole}
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded text-sm"
          >
            Add Role
          </button>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search roles..."
            className="border px-3 py-2 rounded w-full sm:w-60"
          />
        </div>

        {filteredRoles.length === 0 ? (
          <p className="text-gray-500 text-sm">No roles found.</p>
        ) : (
          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between border rounded px-4 py-3 shadow-sm hover:bg-gray-50"
              >
                <div
                  onClick={() => navigate(`/roles/${encodeURIComponent(role.name)}`)}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-medium text-lg">{role.name}</p>
                  <p className="text-xs text-gray-500">
                    {
                      role.status === 'Closed'
                        ? 'This role is closed.'
                        : 'Click to view candidates'
                    }
                  </p>
                </div>

                <select
                  value={role.status}
                  onChange={(e) => updateStatus(role.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded font-semibold border ${statusColors[role.status] || 'bg-gray-100'}`}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Closed">Closed</option>
                </select>

                <button
                  onClick={() => deleteRole(role.id)}
                  className="ml-3 text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
