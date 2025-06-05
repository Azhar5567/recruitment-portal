// src/pages/CreateJob.jsx
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function CreateJob() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: '', client: '', location: '', salary: '', description: '', tags: '', jobType: 'Full-Time', status: 'Open'
  });
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return navigate('/login');
      setUser(u);
      const snap = await getDocs(collection(db, 'users', u.uid, 'clients'));
      setClients(snap.docs.map(d => d.data().name));
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientName = newClient || form.client;
    if (!clientName) return alert('Client is required');

    await addDoc(collection(db, 'users', user.uid, 'jobs'), {
      ...form,
      client: clientName,
      tags: form.tags.split(',').map(t => t.trim()),
      createdAt: Date.now()
    });

    if (newClient) {
      await addDoc(collection(db, 'users', user.uid, 'clients'), { name: newClient, createdAt: Date.now() });
    }

    navigate('/roles');
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} className="border p-2 w-full rounded" required />
        <div className="flex gap-2">
          <select name="client" value={form.client} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Existing Client</option>
            {clients.map((c, i) => <option key={i}>{c}</option>)}
          </select>
          <input placeholder="Or enter new client" value={newClient} onChange={e => setNewClient(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className="border p-2 w-full rounded" />
        <textarea name="description" placeholder="Job Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded" rows="4" />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="border p-2 w-full rounded" />
        <div className="flex gap-2">
          <select name="jobType" value={form.jobType} onChange={handleChange} className="border p-2 rounded w-full">
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded w-full">
            <option>Open</option>
            <option>Paused</option>
            <option>Closed</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save Job</button>
      </form>
    </div>
  );
}
