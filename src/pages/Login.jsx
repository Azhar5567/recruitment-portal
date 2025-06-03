import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        company,
      });

      await sendEmailVerification(user);
      alert('Signup successful! Please verify your email.');
      navigate('/');
    } catch (err) {
      setError('Signup failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* Left panel with info */}
      <div className="hidden md:flex flex-col justify-center bg-indigo-700 text-white px-10 py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to RecruitHub</h1>
        <p className="text-lg mb-6">
          Streamline your hiring with a smart recruitment CRM built for modern teams.
        </p>
        <ul className="space-y-3 text-base">
          <li>🚀 Add and manage job roles</li>
          <li>🧠 Track candidates through custom stages</li>
          <li>🤝 Collaborate with your hiring team in real time</li>
          <li>📂 Upload resumes, review, and shortlist easily</li>
        </ul>
      </div>

      {/* Right panel with form */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? 'Login to RecruitHub' : 'Sign Up for Free'}
          </h2>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border px-3 py-2 rounded mb-3"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </>
          )}

          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className={`w-full ${
              isLogin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
            } text-white py-2 rounded mb-3`}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-center text-sm text-indigo-600 hover:underline cursor-pointer"
          >
            {isLogin ? "Don't have an account? Sign up here." : 'Already have an account? Login here.'}
          </p>
        </div>
      </div>
    </div>
  );
}
