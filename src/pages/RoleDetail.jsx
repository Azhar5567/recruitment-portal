// src/pages/RoleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';

export default function RoleDetail() {
  const { roleId } = useParams();
  const decodedRole = decodeURIComponent(roleId || '').trim();

  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const statusOptions = [
    'Sourced', 'Shortlisted', 'Interview Scheduled', 'Interviewed',
    'Selected', 'Rejected', 'Offered', 'Joined', 'Did Not Join'
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !decodedRole) return;
      try {
        const ref = doc(db, 'users', user.uid, 'candidates', decodedRole);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCandidates(data.candidates || []);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      }
    };
    fetchData();
  }, [user, decodedRole]);

  const addCandidate = () => {
    const newCandidate = {
      name: '',
      email: '',
      contact: '',
      currentCompany: '',
      resume: '',
      status: ''
    };
    setCandidates(prev => [...prev, newCandidate]);
  };

  const updateCandidate = (i, key, value) => {
    setCandidates(prev => {
      const copy = [...prev];
      copy[i][key] = value;
      return copy;
    });
  };

  const removeCandidate = (index) => {
    if (!window.confirm('Remove this candidate?')) return;
    setCandidates(prev => prev.filter((_, i) => i !== index));
  };

  const saveCandidates = async () => {
    if (!user || !decodedRole) return;
    setSaving(true);
    try {
      const ref = doc(db, 'users', user.uid, 'candidates', decodedRole);
      await setDoc(ref, { candidates });
      alert('Candidates saved!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save candidates.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCandidates = candidates.filter(c =>
    Object.values(c).join(' ').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidates for: {decodedRole}</h1>
          <button
            onClick={saveCandidates}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, email, etc."
            className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
          />
          <button
            onClick={addCandidate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-sm"
          >
            Add Candidate
          </button>
        </div>

        {filteredCandidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border">Name</th>
                  <th className="text-left p-3 border">Email</th>
                  <th className="text-left p-3 border">Contact</th>
                  <th className="text-left p-3 border">Current Company</th>
                  <th className="text-left p-3 border">Resume</th>
                  <th className="text-left p-3 border">Status</th>
                  <th className="text-center p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCandidate(i, 'name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="email"
                        value={c.email}
                        onChange={(e) => updateCandidate(i, 'email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        value={c.contact}
                        onChange={(e) => updateCandidate(i, 'contact', e.target.value)}
                        placeholder="Phone or LinkedIn"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        value={c.currentCompany}
                        onChange={(e) => updateCandidate(i, 'currentCompany', e.target.value)}
                        placeholder="Current Employer"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        value={c.resume}
                        onChange={(e) => updateCandidate(i, 'resume', e.target.value)}
                        placeholder="Filename or link"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <select
                        value={c.status}
                        onChange={(e) => updateCandidate(i, 'status', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="">Select</option>
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => removeCandidate(i)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
