// src/pages/CreateCandidate.jsx
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function CreateCandidate() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: '', client: '', status: 'Applied'
  });
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newClient, setNewClient] = useState('');
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return navigate('/login');
      setUser(u);

      const clientSnap = await getDocs(collection(db, 'users', u.uid, 'clients'));
      setClients(clientSnap.docs.map(d => d.data().name));

      const roleSnap = await getDocs(collection(db, 'users', u.uid, 'jobs'));
      setRoles(roleSnap.docs.map(d => d.data().title));
    });
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalClient = newClient || form.client;
    const finalRole = newRole || form.role;

    if (!finalClient || !finalRole || !form.name) return alert('Client, Role and Name are required');

    await addDoc(collection(db, 'users', user.uid, 'candidates'), {
      ...form,
      client: finalClient,
      role: finalRole,
      createdAt: Date.now()
    });

    if (newClient) {
      await addDoc(collection(db, 'users', user.uid, 'clients'), { name: newClient, createdAt: Date.now() });
    }

    navigate('/roles');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border p-2 w-full rounded" />

        <div className="flex gap-2">
          <select name="client" value={form.client} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Client</option>
            {clients.map((c, i) => <option key={i}>{c}</option>)}
          </select>
          <input placeholder="Or add new client" value={newClient} onChange={e => setNewClient(e.target.value)} className="border p-2 rounded w-full" />
        </div>

        <div className="flex gap-2">
          <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Role</option>
            {roles.map((r, i) => <option key={i}>{r}</option>)}
          </select>
          <input placeholder="Or add new role" value={newRole} onChange={e => setNewRole(e.target.value)} className="border p-2 rounded w-full" />
        </div>

        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded w-full">
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offered</option>
          <option>Hired</option>
          <option>Rejected</option>
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Candidate</button>
      </form>
    </div>
  );
}
