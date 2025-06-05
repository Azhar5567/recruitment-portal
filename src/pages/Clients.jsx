// src/pages/Clients.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Clients() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [candidates, setCandidates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchRoles(currentUser);
        await fetchCandidates(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  const fetchRoles = async (currentUser) => {
    const snap = await getDocs(collection(db, 'users', currentUser.uid, 'roles'));
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRoles(list);
  };

  const fetchCandidates = async (currentUser) => {
    const snap = await getDocs(collection(db, 'users', currentUser.uid, 'candidates'));
    const countMap = {};

    snap.docs.forEach(doc => {
      const data = doc.data();
      const role = data.role;
      if (role) {
        countMap[role] = (countMap[role] || 0) + 1;
      }
    });

    setCandidates(countMap);
  };

  const companies = [...new Set(roles.map(r => r.company || 'Unknown'))];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Clients</h1>

        {companies.length === 0 ? (
          <p className="text-gray-500 text-sm">No companies found.</p>
        ) : (
          companies.map((company) => {
            const companyRoles = roles.filter(r => r.company === company);
            return (
              <div key={company} className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-indigo-700">{company}</h2>
                <div className="space-y-3">
                  {companyRoles.map(role => (
                    <div
                      key={role.id}
                      className="border rounded px-4 py-3 shadow-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/roles/${encodeURIComponent(role.name)}`)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-lg">{role.name}</p>
                          <p className="text-sm text-gray-600">Status: {role.status}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {candidates[role.name] || 0} candidate
                          {candidates[role.name] !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
