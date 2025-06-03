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
      if (!user) {
        navigate('/login');
      }
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-12">
        {/* Text Content */}
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-indigo-700">
            Streamline Your <span className="text-black">Hiring Workflow</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            RecruitHub helps you manage job roles, track candidates, and collaborate with your hiring team — all in one place.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              ✅ <span>Customizable candidate pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              ✅ <span>Drag-and-drop resume management</span>
            </div>
            <div className="flex items-center gap-2">
              ✅ <span>Role-based candidate tracking</span>
            </div>
          </div>

          <Link
            to="/roles"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition"
          >
            Go to Roles
          </Link>
        </div>

        {/* Image/Illustration */}
        <div className="flex-1 w-full max-w-md">
          <img
            src="https://illustrations.popsy.co/gray/recruitment.svg"
            alt="Recruitment illustration"
            className="w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
