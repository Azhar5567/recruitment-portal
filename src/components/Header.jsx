// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Home, Briefcase, BarChart2, Settings, Users, HelpCircle, LogOut } from 'lucide-react';
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

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm"
    >
      {icon} {label}
    </Link>
  );

  return (
    <header className="w-full bg-white border-b shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-lg font-bold text-indigo-700">Recruitment Portal</h1>
        <nav className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {navLink('/', <Home size={16} />, 'Dashboard')}
          {navLink('/roles', <Briefcase size={16} />, 'Roles')}
          {navLink('/reports', <BarChart2 size={16} />, 'Reports')}
          {navLink('/team', <Users size={16} />, 'Team')}
          {navLink('/settings', <Settings size={16} />, 'Settings')}
          {navLink('/help', <HelpCircle size={16} />, 'Help')}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 rounded hover:bg-red-100 text-red-600 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
