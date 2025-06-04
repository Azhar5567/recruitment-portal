// src/pages/Team.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';

const roles = ['Admin', 'Editor', 'Viewer'];

export default function Team() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'team'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeam(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team:', err);
        setLoading(false);
      }
    };

    fetchTeam();
  }, [user]);

  const addMember = async () => {
    if (!email.trim()) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'team'), {
        email,
        role,
      });
      setEmail('');
      setRole('Editor');
      setTeam(prev => [...prev, { email, role }]);
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      const ref = doc(db, 'users', user.uid, 'team', id);
      await updateDoc(ref, { role: newRole });
      setTeam(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const removeMember = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'team', id));
      setTeam(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Team Management</h1>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Team member email"
            className="border px-3 py-2 rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={addMember}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Add Member
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading team...</p>
        ) : team.length === 0 ? (
          <p className="text-gray-500">No team members added yet.</p>
        ) : (
          <ul className="space-y-4">
            {team.map((member) => (
              <li key={member.id} className="border p-4 rounded flex justify-between items-center bg-white shadow-sm">
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-gray-500">Role: {member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(e) => updateRole(member.id, e.target.value)}
                    className="border px-2 py-1 text-sm rounded"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
