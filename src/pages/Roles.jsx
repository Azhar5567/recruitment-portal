// src/pages/RoleDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';

export default function RoleDetail() {
  const { roleId } = useParams();
  const decodedRole = decodeURIComponent(roleId || 'Unknown');

  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Contact' },
    { key: 'currentCompany', label: 'Current Company' },
    { key: 'resume', label: 'Resume' },
    { key: 'status', label: 'Status' },
  ]);
  const [newCandidate, setNewCandidate] = useState({});
  const [statusOptions] = useState([
    'Sourced', 'Shortlisted', 'Interview Scheduled', 'Interviewed',
    'Selected', 'Rejected', 'Offered', 'Joined', 'Did Not Join'
  ]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

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
      if (!user) return;
      const docRef = doc(db, 'users', user.uid, 'candidates', decodedRole);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.candidates)) {
          setCandidates(data.candidates);
        }
      }
    };
    fetchData();
  }, [user, decodedRole]);

  const handleChange = (i, key, value) => {
    setCandidates(prev => {
      const updated = [...prev];
      updated[i][key] = value;
      return updated;
    });
  };

  const handleFileUpload = (i, file) => {
    handleChange(i, 'resume', file?.name || '');
  };

  const addCandidate = () => {
    const empty = {};
    columns.forEach(col => {
      empty[col.key] = '';
    });
    setCandidates(prev => [...prev, empty]);
  };

  const removeCandidate = (i) => {
    if (!window.confirm('Remove this candidate?')) return;
    setCandidates(prev => prev.filter((_, idx) => idx !== i));
  };

  const saveCandidates = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'candidates', decodedRole);
      await setDoc(docRef, {
        candidates: candidates.map((c) => ({
          ...c,
          resume: typeof c.resume === 'string' ? c.resume : c.resume?.name || '',
        })),
      });
      setSaving(false);
      alert('Candidates saved!');
    } catch (err) {
      console.error('Save error:', err);
      setSaving(false);
      alert('Failed to save candidates.');
    }
  };

  const filteredCandidates = candidates.filter((c) =>
    Object.values(c).join(' ').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidates for: {decodedRole}</h1>
          <button
            onClick={saveCandidates}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search candidates..."
            className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
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
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="border px-3 py-2 bg-gray-100 text-left font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="border px-3 py-2 bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="border px-3 py-2">
                      {col.key === 'status' ? (
                        <select
                          value={candidate[col.key] || ''}
                          onChange={(e) => handleChange(i, col.key, e.target.value)}
                          className="border p-1 rounded w-full"
                        >
                          <option value="">Select...</option>
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : col.key === 'resume' ? (
                        <>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(i, e.target.files[0])}
                            className="text-sm"
                          />
                          {candidate.resume && (
                            <div className="text-xs mt-1 text-blue-600">{candidate.resume}</div>
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={candidate[col.key] || ''}
                          onChange={(e) => handleChange(i, col.key, e.target.value)}
                          className="w-full border p-1 rounded"
                        />
                      )}
                    </td>
                  ))}
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
      </main>
    </div>
  );
}
