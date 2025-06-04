// src/pages/RoleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';

export default function RoleDetail() {
  const { roleId } = useParams();
  const decodedRole = decodeURIComponent(roleId || '').trim();

  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Contact' },
    { key: 'currentCompany', label: 'Current Company' },
    { key: 'resume', label: 'Resume' },
    { key: 'status', label: 'Status' }
  ];

  const statusOptions = [
    'Sourced', 'Shortlisted', 'Interview Scheduled', 'Interviewed',
    'Selected', 'Rejected', 'Offered', 'Joined', 'Did Not Join'
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
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
    const newCandidate = {};
    columns.forEach(col => newCandidate[col.key] = '');
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
          <h1 className="text-2xl font-bold">Candidates for: {decodedRole || '...'}</h1>
          <button
            onClick={saveCandidates}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search candidates..."
            className="border px-3 py-2 rounded text-sm w-full sm:w-64"
          />
          <button
            onClick={addCandidate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            Add Candidate
          </button>
        </div>

        <div className="overflow-auto bg-white border rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-3 py-2 border text-left font-medium">{col.label}</th>
                ))}
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-2 border">
                      {col.key === 'status' ? (
                        <select
                          value={candidate[col.key] || ''}
                          onChange={(e) => updateCandidate(i, col.key, e.target.value)}
                          className="w-full border rounded p-1"
                        >
                          <option value="">Select</option>
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={candidate[col.key] || ''}
                          onChange={(e) => updateCandidate(i, col.key, e.target.value)}
                          className="w-full border rounded p-1"
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 border text-center">
                    <button
                      onClick={() => removeCandidate(i)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
