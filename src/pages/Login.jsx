import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  // Auth redirect
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
          // Now ask user to set username & password
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

  const handleEmailSignup = async () => {
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert('A confirmation link has been sent to your email.');
    } catch (err) {
      setError('Sign-up email failed: ' + err.message);
    }
  };

  const handleSetPasswordAndUsername = async () => {
    const user = auth.currentUser;
    try {
      await updatePassword(user, newPassword);
      // Optionally, save username in Firestore
      // await setDoc(doc(db, 'users', user.uid), { email: user.email, username });

      alert('Username and password set!');
      navigate('/');
    } catch (err) {
      setError('Error setting password: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {isLogin ? (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mb-3"
            >
              Login
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEmailSignup}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-3"
            >
              Send Signup Email
            </button>
          </>
        )}

        {!isLogin && isSignInWithEmailLink(auth, window.location.href) && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Set Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <button
              onClick={handleSetPasswordAndUsername}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3"
            >
              Set Password & Continue
            </button>
          </>
        )}

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-sm text-indigo-600 hover:underline mt-2"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
