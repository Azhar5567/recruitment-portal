// src/pages/Help.jsx
import Header from '../components/Header';

export default function Help() {
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
              <p>Free users can create up to 3 active roles. Upgrade to Pro for unlimited roles.</p>
            </div>
            <div>
              <p className="font-medium">💳 How do I upgrade to Pro?</p>
              <p>You can upgrade via PayPal from inside the app once you reach the role limit.</p>
            </div>
            <div>
              <p className="font-medium">📄 Can I upload resumes?</p>
              <p>Yes! Each candidate record supports a resume link or file upload (coming soon).</p>
            </div>
            <div>
              <p className="font-medium">🛡️ Is my data secure?</p>
              <p>Yes — your data is securely stored in Firebase and never shared with third parties.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">📬 Need More Help?</h2>
          <p className="text-sm text-gray-700">
            For account questions, billing, or technical issues, reach out to us directly:
          </p>
          <ul className="mt-2 text-sm text-gray-800 list-disc list-inside">
            <li>Email: <a href="mailto:support@recruithub.in" className="text-indigo-600 underline">support@recruithub.in</a></li>
            <li>Twitter: <a href="https://twitter.com/recruithub" className="text-indigo-600 underline" target="_blank" rel="noreferrer">@recruithub</a></li>
            <li>Live Chat: Coming soon inside the app</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🛠 Feature Requests</h2>
          <p className="text-sm text-gray-700">
            Have ideas or features you want? We’d love to hear them.
            <br />
            Submit them via email or use the feedback link in your dashboard.
          </p>
        </section>
      </main>
    </div>
  );
}
