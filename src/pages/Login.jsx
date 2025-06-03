import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword
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
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  // Handle redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsub();
  }, [navigate]);

  // Confirm email link flow
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem('emailForSignIn');
      if (!storedEmail) {
        storedEmail = window.prompt('Please provide your email for confirmation');
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleSignup = async () => {
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('signupName', name);
      window.localStorage.setItem('signupCompany', company);
      alert('Confirmation link sent to email');
    } catch (err) {
      setError('Signup failed: ' + err.message);
    }
  };

  const handleSetPassword = async () => {
    const user = auth.currentUser;
    const storedName = window.localStorage.getItem('signupName');
    const storedCompany = window.localStorage.getItem('signupCompany');

    try {
      await updatePassword(user, newPassword);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: storedName,
        company: storedCompany,
      });

      alert('Account setup complete!');
      navigate('/');
    } catch (err) {
      setError('Failed to set password: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* Left: Branding */}
      <div className="hidden md:flex flex-col justify-center items-start bg-indigo-600 text-white px-10 py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to RecruitHub</h1>
        <p className="text-lg mb-6">
          Streamline your hiring with an all-in-one recruitment CRM.
        </p>
        <ul className="space-y-2 text-base">
          <li>✅ Create & manage job roles</li>
          <li>✅ Track candidates from sourcing to onboarding</li>
          <li>✅ Collaborate with your team in real-time</li>
          <li>✅ Customize statuses and fields easily</li>
        </ul>
      </div>

      {/* Right: Auth Form */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? 'Login to RecruitHub' : 'Sign Up for Free'}
          </h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {isLogin ? (
            <>
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
              >
                Login
              </button>
            </>
          ) : (
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
              <button
                onClick={handleSignup}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Send Confirmation Link
              </button>
            </>
          )}

          {/* After email confirmation */}
          {!isLogin && isSignInWithEmailLink(auth, window.location.href) && (
            <>
              <input
                type="password"
                placeholder="Set a Password"
                className="w-full border px-3 py-2 rounded mt-4 mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handleSetPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Set Password & Complete Sign-Up
              </button>
            </>
          )}

          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-center mt-4 text-sm text-indigo-600 cursor-pointer hover:underline"
          >
            {isLogin ? 'Don’t have an account? Sign Up' : 'Already have an account? Login'}
          </p>
        </div>
      </div>
    </div>
  );
}
