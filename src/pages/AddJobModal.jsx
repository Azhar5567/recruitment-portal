import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddJobModal({ onClose, userId }) {
  const [form, setForm] = useState({
    title: '',
    client: '',
    location: '',
    salary: '',
    description: '',
    tags: '',
    status: 'Open',
    jobType: 'Full-Time'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users', userId, 'jobs'), {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
        createdAt: Date.now(),
        owner: userId
      });
      onClose(); // close modal on success
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Job Title" className="border p-2 rounded" />
          <input name="client" value={form.client} onChange={handleChange} required placeholder="Client (Company Name)" className="border p-2 rounded" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" />
          <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (e.g. ₹8LPA)" className="border p-2 rounded" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" rows="4" className="border p-2 rounded" />

          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="border p-2 rounded" />

          <div className="flex gap-4">
            <select name="jobType" value={form.jobType} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="Open">Open</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
