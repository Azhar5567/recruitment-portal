// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Header from '../components/Header';

export default function Home() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          Elevate Your Hiring Process
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          RecruitHub empowers modern hiring teams to organize roles, manage candidates, and drive decisions — all in one intuitive platform.
        </p>

        <div className="text-left text-sm text-gray-700 space-y-3 mb-12 max-w-md mx-auto">
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">▸</span>
            <span>Structured role and candidate pipelines</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">▸</span>
            <span>Collaborative workflow across your team</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">▸</span>
            <span>Centralized tracking, notes, and resumes</span>
          </div>
        </div>

        <Link
          to="/roles"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium shadow-sm transition"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
