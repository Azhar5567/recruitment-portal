// src/pages/RoleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import Header from '../components/Header';

export default function RoleDetail() {
  const { roleName } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchRoleAndCandidates(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsub();
  }, [navigate, roleName]);

  const fetchRoleAndCandidates = async (currentUser) => {
    // Fetch role by name
    const roleSnap = await getDocs(collection(db, 'users', currentUser.uid, 'roles'));
    const roleDoc = roleSnap.docs.find(doc => doc.data().name === roleName);
    if (!roleDoc) {
      alert('Role not found.');
      return;
    }

    const roleData = roleDoc.data();
    setRole({ id: roleDoc.id, ...roleData });

    // Fetch candidates with matching role
    const q = query(
      collection(db, 'users', currentUser.uid, 'candidates'),
      where('role', '==', roleName)
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCandidates(list);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {role ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{role.name}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Company: {role.company || 'Not specified'} • Status:{' '}
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {role.status}
              </span>
            </p>

            <button
              onClick={() =>
                navigate(`/candidates/new?role=${encodeURIComponent(role.name)}`)
              }
              className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
            >
              + Add Candidate
            </button>

            {candidates.length === 0 ? (
              <div className="text-gray-500">No candidates added yet for this role.</div>
            ) : (
              <div className="space-y-4">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="border px-4 py-3 rounded shadow-sm hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.email}</p>
                        <p className="text-sm text-gray-500">{c.phone}</p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">Loading role details...</p>
        )}
      </main>
    </div>
  );
}
