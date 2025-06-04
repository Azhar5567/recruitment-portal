// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
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
      if (!currentUser) return navigate('/login');
      setUser(currentUser);
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

        let totalCandidates = 0;
        for (const role of roleNames) {
          const candidatesDoc = await getDocs(collection(db, 'users', user.uid, 'candidates'));
          candidatesDoc.forEach((doc) => {
            if (Array.isArray(doc.data().candidates)) {
              totalCandidates += doc.data().candidates.length;
            }
          });
        }
        setCandidateCount(totalCandidates);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-indigo-800">Total Roles</h2>
            <p className="text-3xl font-bold text-indigo-900 mt-2">{roles.length}</p>
          </div>

          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-green-800">Total Candidates</h2>
            <p className="text-3xl font-bold text-green-900 mt-2">{candidateCount}</p>
          </div>

          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-yellow-800">Active Roles</h2>
            <p className="text-3xl font-bold text-yellow-900 mt-2">{roles.length}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/roles')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View Roles
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
          >
            View Reports
          </button>
        </div>
      </main>
    </div>
  );
}
