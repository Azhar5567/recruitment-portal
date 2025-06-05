// src/components/Header.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        setIsPaid(snap.data()?.isPaid || false);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate('/login');
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <h1
        onClick={() => navigate('/dashboard')}
        className="text-xl font-bold text-indigo-600 cursor-pointer"
      >
        Recruitment Portal
      </h1>

      {user && (
        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/roles" className="hover:underline">Roles</a>
          <a href="/reports" className="hover:underline">Reports</a>
          <a href="/team" className="hover:underline">Team</a>
          <a href="/settings" className="hover:underline">Settings</a>
          <a href="/help" className="hover:underline">Help</a>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="ml-4 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2"
            >
              <span>{user.email}</span>
              {isPaid && (
                <span className="ml-1 px-2 py-0.5 text-xs text-white bg-indigo-600 rounded-full">
                  PRO
                </span>
              )}
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  showMenu ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border shadow rounded text-sm">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
