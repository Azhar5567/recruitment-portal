import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent! Check your inbox.');
    } catch (err) {
      setError('Unable to send reset link. Check your email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">Reset Password</h1>

        {message && <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-sm">{message}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-sm">{error}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
