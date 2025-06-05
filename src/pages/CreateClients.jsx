// src/pages/CreateClient.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function CreateClient() {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) return navigate('/login');
      setUser(u);
    });
  }, [navigate]);

  const handleChange = e => setClient({ ...client, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client.name) return alert('Client name is required');
    await addDoc(collection(db, 'users', user.uid, 'clients'), {
      ...client,
      createdAt: Date.now()
    });
    navigate('/clients');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Company Name" value={client.name} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input name="contactPerson" placeholder="Contact Person" value={client.contactPerson} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="email" type="email" placeholder="Email" value={client.email} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="phone" placeholder="Phone Number" value={client.phone} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="website" placeholder="Website" value={client.website} onChange={handleChange} className="border p-2 w-full rounded" />
        <textarea name="notes" placeholder="Notes (optional)" value={client.notes} onChange={handleChange} className="border p-2 w-full rounded" rows="3" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Save Client</button>
      </form>
    </div>
  );
}
