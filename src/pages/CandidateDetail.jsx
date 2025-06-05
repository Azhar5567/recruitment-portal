// src/pages/CandidateDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, addDoc, collection
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from 'firebase/storage';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get('role');

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Applied',
    role: roleFromQuery || '',
    notes: '',
    resumeUrl: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isNew = candidateId === 'new';
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (!isNew) {
          const snap = await getDoc(doc(db, 'users', currentUser.uid, 'candidates', candidateId));
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async () => {
    if (!resumeFile || !user) return null;
    setUploading(true);

    const storage = getStorage();
    const fileRef = ref(storage, `users/${user.uid}/resumes/${Date.now()}_${resumeFile.name}`);
    await uploadBytes(fileRef, resumeFile);
    const url = await getDownloadURL(fileRef);

    setUploading(false);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      let resumeUrl = formData.resumeUrl;

      if (resumeFile) {
        resumeUrl = await handleResumeUpload();
      }

      const dataToSave = {
        ...formData,
        resumeUrl,
        createdAt: Date.now()
      };

      if (isNew) {
        await addDoc(collection(db, 'users', user.uid, 'candidates'), dataToSave);
      } else {
        await updateDoc(doc(db, 'users', user.uid, 'candidates', candidateId), dataToSave);
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

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
              rows="3"
              placeholder="Internal comments, feedback, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mt-1 block w-full"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            {formData.resumeUrl && (
              <a
                href={formData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 underline mt-2 inline-block"
              >
                View current resume
              </a>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium"
            disabled={uploading}
          >
            {isNew ? 'Add Candidate' : 'Update Candidate'}
          </button>
        </form>
      </main>
    </div>
  );
}
