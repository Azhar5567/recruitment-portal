// src/pages/CandidateDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const roleNameFromQuery = searchParams.get('role');

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Applied',
    role: roleNameFromQuery || ''
  });

  const isNew = candidateId === 'new';
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        if (!isNew) {
          const ref = doc(db, 'users', currentUser.uid, 'candidates', candidateId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setFormData(snap.data());
          }
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsub();
  }, [candidateId, isNew, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (isNew) {
        await addDoc(collection(db, 'users', user.uid, 'candidates'), {
          ...formData,
          createdAt: Date.now()
        });
      } else {
        const ref = doc(db, 'users', user.uid, 'candidates', candidateId);
        await updateDoc(ref, formData);
      }

      navigate('/roles');
    } catch (err) {
      console.error('Error saving candidate:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isNew ? 'Add New Candidate' : 'Edit Candidate'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offered</option>
              <option>Hired</option>
              <option>Rejected</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium"
          >
            {isNew ? 'Add Candidate' : 'Update Candidate'}
          </button>
        </form>
      </main>
    </div>
  );
}
