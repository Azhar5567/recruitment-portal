// src/pages/Help.jsx
import Header from '../components/Header';

export default function Help() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Help & Onboarding</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">👋 Getting Started</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>First, go to <strong>Roles</strong> and create job roles.</li>
            <li>Click on a role to open its candidate tracker.</li>
            <li>Add candidates, upload resumes, and update their status.</li>
            <li>Use the <strong>Dashboard</strong> to track your progress across all roles.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">❓ Frequently Asked Questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">How do I invite my team?</p>
              <p>Go to the <strong>Team</strong> page and invite users by email. Assign them roles like Admin, Editor, or Viewer.</p>
            </div>
            <div>
              <p className="font-medium">Where are resumes stored?</p>
              <p>Currently, only resume filenames are saved. You can integrate Firebase Storage to upload and retrieve actual files.</p>
            </div>
            <div>
              <p className="font-medium">Can I export candidate data?</p>
              <p>Yes — visit the <strong>Reports</strong> page to view summaries and prepare for CSV export (coming soon).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📬 Need More Help?</h2>
          <p className="text-sm">
            Reach out to us at <a href="mailto:support@recruithub.com" className="text-indigo-600 underline">support@recruithub.com</a><br />
            or send feedback through the <strong>Settings</strong> page (feature coming soon).
          </p>
        </section>
      </main>
    </div>
  );
}
