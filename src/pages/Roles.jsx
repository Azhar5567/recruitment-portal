// src/pages/Roles.jsx (Replaced with JobList view for better structure)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import AddJobModal from '../components/AddJobModal';

export default function Roles() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return navigate('/login');
      setUser(currentUser);
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'jobs'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(data);
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Roles</h1>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add Job</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Job Title</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left"># Candidates</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.client}</td>
                  <td className="p-2">{job.status}</td>
                  <td className="p-2">{job.candidateCount || 0}</td>
                  <td className="p-2">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{job.owner || user?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && <AddJobModal onClose={() => setShowModal(false)} userId={user?.uid} />}
      </main>
    </div>
  );
}
