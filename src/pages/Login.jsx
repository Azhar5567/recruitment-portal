import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsub();
  }, [navigate]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError('Google login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">Login with Google</h1>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          onClick={loginWithGoogle}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
