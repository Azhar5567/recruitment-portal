// src/pages/Dashboard.jsx (Updated as requested)
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        const roleSnap = await getDocs(collection(db, 'users', currentUser.uid, 'jobs'));
        const roleList = roleSnap.docs.map(doc => doc.data());
        setRoles(roleList);

        const candSnap = await getDocs(collection(db, 'users', currentUser.uid, 'candidates'));
        const candList = candSnap.docs.map(doc => doc.data());
        setCandidates(candList);
      }
    });

    return () => unsub();
  }, [navigate]);

  const openJobs = roles.filter(r => r.status !== 'Closed').length;
  const inProcess = candidates.filter(c => ['Applied', 'Interviewing'].includes(c.status)).length;
  const interviews = candidates.filter(c => c.status === 'Interviewing').length;
  const placements = candidates.filter(c => c.status === 'Hired').length;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Open Jobs" count={openJobs} color="indigo" />
          <Card title="In Process" count={inProcess} color="yellow" />
          <Card title="Interviews" count={interviews} color="blue" />
          <Card title="Placements" count={placements} color="green" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate('/create-job')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            + New Job
          </button>
          <button
            onClick={() => navigate('/create-candidate')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            + New Candidate
          </button>
          <button
            onClick={() => navigate('/create-client')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
          >
            + New Client
          </button>
        </div>

        {/* Task Feed */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Task Feed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Task title="Upcoming Interviews" items={candidates.filter(c => c.status === 'Interviewing')} />
            <Task title="Pending Feedback" items={candidates.filter(c => c.status === 'Offered')} />
            <Task title="Follow-ups" items={candidates.filter(c => c.status === 'Applied')} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, count, color }) {
  return (
    <div className={`bg-${color}-100 text-${color}-800 px-4 py-6 rounded shadow-sm`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{count}</p>
    </div>
  );
}

function Task({ title, items }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items</p>
      ) : (
        <ul className="text-sm list-disc list-inside text-gray-700 space-y-1">
          {items.slice(0, 4).map((c, idx) => (
            <li key={idx}>{c.name} ({c.role})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
