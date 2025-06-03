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
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Welcome to <span className="text-indigo-600">RecruitHub</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          A streamlined hiring tool to help you manage job roles, track candidates, and collaborate with your team — all in one place.
        </p>

        <ul className="text-left text-gray-700 mb-12 space-y-2 text-base">
          <li>• Clean, customizable candidate pipeline</li>
          <li>• Smart resume tracking with role context</li>
          <li>• Real-time collaboration with your team</li>
        </ul>

        <Link
          to="/roles"
          className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium transition"
        >
          Go to Roles
        </Link>
      </main>
    </div>
  );
}
