// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function Landing() {
  const navigate = useNavigate();

  // Optional: redirect logged-in users to dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-800">
      {/* Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Recruitment Portal</h1>
        <div className="space-x-4 text-sm">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Try Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">The Smartest Way to Hire</h2>
        <p className="text-lg text-gray-600 mb-8">
          Manage job roles, track candidates, collaborate with your team, and hire faster —
          all in one powerful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded text-lg"
          >
            Get Started Free
          </button>
          <button
            onClick={() => window.scrollTo(0, 9999)}
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded text-lg"
          >
            See Pricing
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="font-semibold text-lg mb-1">📋 Role Management</h3>
            <p className="text-sm text-gray-600">Track hiring for multiple roles with status control and search.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">👤 Candidate Pipeline</h3>
            <p className="text-sm text-gray-600">Store resumes, update interview status, and manage candidate flow.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">📊 Reports & Insights</h3>
            <p className="text-sm text-gray-600">View charts of role performance and candidate stats.</p>
          </div>
        </div>
      </main>

      {/* Pricing Section */}
      <footer className="bg-gray-100 py-10 text-center text-sm text-gray-500">
        <h4 className="text-lg font-semibold mb-3">Pricing Plans</h4>
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row justify-center gap-6 text-left">
          <div className="bg-white border rounded-lg p-6 shadow-sm w-full sm:w-1/2">
            <h5 className="text-xl font-bold mb-1">Free</h5>
            <p className="text-sm mb-4">Up to 3 job roles, team access, reports</p>
            <p className="text-indigo-600 font-semibold">₹0/month</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-6 shadow-sm w-full sm:w-1/2">
            <h5 className="text-xl font-bold mb-1">Pro</h5>
            <p className="text-sm mb-4">Unlimited roles, premium insights, resume uploads</p>
            <p className="text-indigo-600 font-semibold">₹499/month</p>
          </div>
        </div>
        <p className="mt-8">© 2025 RecruitHub · <a href="/help" className="underline">Help</a></p>
      </footer>
    </div>
  );
}
