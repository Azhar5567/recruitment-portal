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
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-6">
          Welcome to <span className="text-black">RecruitHub</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Simplify your hiring process — manage roles, track candidates, and collaborate effortlessly.
        </p>

        <div className="grid gap-4 text-sm text-left max-w-md mx-auto mb-10">
          <div>✅ Customizable candidate pipeline</div>
          <div>✅ Drag-and-drop resume management</div>
          <div>✅ Role-based candidate tracking</div>
        </div>

        <Link
          to="/roles"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Go to Roles
        </Link>
      </main>
    </div>
  );
}
