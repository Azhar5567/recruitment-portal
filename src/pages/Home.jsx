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
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-6 text-indigo-700">
            Streamline Your <span className="text-black">Hiring Workflow</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Manage roles, track candidates, and collaborate in one place.
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li>✅ Customizable pipelines</li>
            <li>✅ Drag-and-drop resumes</li>
            <li>✅ Role-based tracking</li>
          </ul>
          <Link
            to="/roles"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Roles
          </Link>
        </div>

        <div className="flex-1 max-w-md">
          <img
            src="/images/recruitment.svg"
            alt="Recruitment"
            className="w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
