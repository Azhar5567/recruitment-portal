// src/pages/Help.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Header from '../components/Header';

export default function Help() {
  const navigate = useNavigate();

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Help & Support</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">📌 Frequently Asked Questions</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium">💡 How many roles can I create?</p>
              <p>Free users can create up to 3 active roles. Upgrade to Pro for unlimited access.</p>
            </div>
            <div>
              <p className="font-medium">💳 How do I upgrade to Pro?</p>
              <p>A PayPal payment modal appears when you hit the role limit. Payment unlocks Pro.</p>
            </div>
            <div>
              <p className="font-medium">📄 Can I upload resumes?</p>
              <p>Yes, resumes can be added as links or text. File upload support is coming soon.</p>
            </div>
            <div>
              <p className="font-medium">🛡️ Is my data safe?</p>
              <p>All data is stored securely in Firebase and encrypted by Google infrastructure.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">📬 Need Help?</h2>
          <p className="text-sm text-gray-700 mb-2">
            We're here to support your hiring journey. Reach us at:
          </p>
          <ul className="text-sm text-gray-800 list-disc list-inside">
            <li>Email: <a href="mailto:support@recruithub.in" className="text-indigo-600 underline">support@recruithub.in</a></li>
            <li>Twitter: <a href="https://twitter.com/recruithub" className="text-indigo-600 underline" target="_blank" rel="noreferrer">@recruithub</a></li>
            <li>Live Chat: Coming soon inside the dashboard</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">💬 Feature Requests</h2>
          <p className="text-sm text-gray-700">
            Got an idea or a feature you'd love to see? Let us know via email or submit it through the dashboard's feedback section.
          </p>
        </section>
      </main>
    </div>
  );
}
