// src/pages/Roles.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import UpgradeWithPaypal from '../components/UpgradeWithPaypal';

export default function Roles() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [filter, setFilter] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Paused: 'bg-yellow-100 text-yellow-800',
    Closed: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        setIsPaid(snap.data()?.isPaid || false);
      } else {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const roleSnap = await getDocs(collection(db, 'users', user.uid, 'roles'));
      const roleList = roleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoles(roleList);

      const candidateSnap = await getDocs(collection(db, 'users', user.uid, 'candidates'));
      const candidateCounts = {};
      candidateSnap.forEach(doc => {
        const data = doc.data();
        candidateCounts[doc.id] = (data.candidates || []).length;
      });
      setCandidates(candidateCounts);
    };

    fetchData();
  }, [user]);

  const addRole = async () => {
    const name = roleName.trim();
    if (!name || !user) return;

    const freeLimit = 3;
    const activeRoles = roles.filter(r => r.status !== 'Closed');

    if (!isPaid && activeRoles.length >= freeLimit) {
      setShowUpgrade(true);
      return;
    }

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

  const filteredRoles = roles
    .filter(r =>
      r.name.toLowerCase().includes(filter.toLowerCase()) &&
      (statusTab === 'All' || r.status === statusTab)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

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
            className="border px-3 py-2 rounded w-full sm:w-64"
          />
          <button
            onClick={addRole}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm"
          >
            Add Role
          </button>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search roles..."
            className="border px-3 py-2 rounded w-full sm:w-64"
          />
        </div>

        <div className="flex gap-3 mb-4 text-sm">
          {['All', 'Active', 'Paused', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusTab(status)}
              className={`px-3 py-1 rounded-full border ${
                statusTab === status ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredRoles.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No roles found.</p>
            <p className="text-xs mt-1">Try a different status or search.</p>
          </div>
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
                    {candidates[role.name] || 0} candidate{(candidates[role.name] || 0) !== 1 && 's'}
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

        {showUpgrade && <UpgradeWithPaypal onClose={() => setShowUpgrade(false)} />}
      </main>
    </div>
  );
}
