// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Home, Briefcase, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <header className="w-full bg-white border-b shadow-sm px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-lg font-semibold text-gray-800">Recruitment Portal</h1>
        <nav className="flex flex-col sm:flex-row gap-2 text-sm">
          <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
            <Home size={16} /> Home
          </Link>
          <Link to="/roles" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
            <Briefcase size={16} /> Roles
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
