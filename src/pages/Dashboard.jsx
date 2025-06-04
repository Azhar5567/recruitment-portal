// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const rolesSnapshot = await getDocs(collection(db, 'users', user.uid, 'roles'));
        const roleNames = rolesSnapshot.docs.map((doc) => doc.data().name);
        setRoles(roleNames);

        const candidatesSnapshot = await getDocs(collection(db, 'users', user.uid, 'candidates'));
        let total = 0;
        candidatesSnapshot.forEach(doc => {
          const data = doc.data();
          if (Array.isArray(data.candidates)) {
            total += data.candidates.length;
          }
        });
        setCandidateCount(total);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-indigo-800">Total Roles</h2>
                <p className="text-4xl font-bold text-indigo-900">{roles.length}</p>
              </div>

              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-800">Total Candidates</h2>
                <p className="text-4xl font-bold text-green-900">{candidateCount}</p>
              </div>

              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-yellow-800">Active Roles</h2>
                <p className="text-4xl font-bold text-yellow-900">{roles.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate('/roles')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded text-sm">
                View Roles
              </button>
              <button onClick={() => navigate('/reports')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded text-sm">
                View Reports
              </button>
              <button onClick={() => navigate('/team')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded text-sm">
                Team
              </button>
              <button onClick={() => navigate('/settings')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded text-sm">
                Settings
              </button>
              <button onClick={() => navigate('/help')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded text-sm">
                Help
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
