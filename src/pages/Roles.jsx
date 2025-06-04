// src/pages/Roles.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';

export default function Roles() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const rolesRef = collection(db, 'users', user.uid, 'roles');
    const unsub = onSnapshot(rolesRef, async (snapshot) => {
      const fetchedRoles = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const candidatesRef = collection(db, 'users', user.uid, 'candidates');
        const candidateDocs = await getDocs(candidatesRef);
        const matching = candidateDocs.docs.find(d => d.id === data.name);
        const candidateCount = matching?.data()?.candidates?.length || 0;

        fetchedRoles.push({
          id: docSnap.id,
          name: data.name,
          status: data.status || 'Active',
          candidateCount,
        });
      }
      setRoles(fetchedRoles);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addRole = async () => {
    const trimmed = newRole.trim();
    if (!trimmed || roles.some(r => r.name === trimmed)) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'roles'), {
        name: trimmed,
        status: 'Active',
      });
      setNewRole('');
    } catch (err) {
      console.error('Error adding role:', err);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Your Job Roles
        </h2>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="New role name"
            className="border px-4 py-2 rounded-md"
          />
          <button
            onClick={addRole}
            disabled={!newRole.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition disabled:opacity-40"
          >
            Add Role
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles..."
            className="border px-4 py-2 rounded-md"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading roles...</p>
        ) : filteredRoles.length === 0 ? (
          <p className="text-center text-gray-500">No roles found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredRoles.map((role) => (
              <li key={role.name}>
                <Link
                  to={`/roles/${encodeURIComponent(role.name)}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-sm hover:bg-white transition"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        role.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {role.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {role.candidateCount} candidate{role.candidateCount !== 1 ? 's' : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
