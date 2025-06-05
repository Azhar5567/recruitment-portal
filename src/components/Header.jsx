// src/components/Header.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { Home, LogOut, Briefcase, BarChart2, Users, Settings as SettingsIcon, HelpCircle } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-bold text-indigo-600">Recruitment Portal</h1>
      
      {isLoggedIn && (
        <nav className="space-x-4 text-sm flex items-center">
          <a href="/dashboard" className="hover:underline flex items-center gap-1 text-gray-700">
            <Home size={16} /> Dashboard
          </a>
          <a href="/roles" className="hover:underline flex items-center gap-1 text-gray-700">
            <Briefcase size={16} /> Roles
          </a>
          <a href="/reports" className="hover:underline flex items-center gap-1 text-gray-700">
            <BarChart2 size={16} /> Reports
          </a>
          <a href="/team" className="hover:underline flex items-center gap-1 text-gray-700">
            <Users size={16} /> Team
          </a>
          <a href="/settings" className="hover:underline flex items-center gap-1 text-gray-700">
            <SettingsIcon size={16} /> Settings
          </a>
          <a href="/help" className="hover:underline flex items-center gap-1 text-gray-700">
            <HelpCircle size={16} /> Help
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:underline"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      )}
    </header>
  );
}
