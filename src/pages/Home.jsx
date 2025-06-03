// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to the <span className="text-indigo-600">Recruitment Portal</span>
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-gray-600 mb-8">
          Add roles, manage candidates, and streamline your hiring process with ease.
        </p>

        <Link
          to="/roles"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-base font-medium transition"
        >
          Go to Roles
        </Link>
      </main>
    </div>
  );
}
