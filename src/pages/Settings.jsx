// src/pages/Settings.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', company: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
            name: data.name || '',
            company: data.company || '',
            email: data.email || currentUser.email,
          });
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: profile.name,
        company: profile.company,
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Failed to update profile.');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !user) return;
    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      setMessage('Password updated successfully!');
    } catch (err) {
      console.error('Password change error:', err);
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium">Email (read-only)</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            Save Profile
          </button>
        </div>

        <div className="border-t pt-6 mt-8">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
          >
            Update Password
          </button>
        </div>
      </main>
    </div>
  );
}
