// src/pages/Reports.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function Reports() {
  const [user, setUser] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user) return;

      try {
        const candidatesRef = collection(db, 'users', user.uid, 'candidates');
        const snapshot = await getDocs(candidatesRef);

        const statusMap = {};
        const roleMap = {};

        snapshot.forEach(docSnap => {
          const role = docSnap.id;
          const data = docSnap.data();
          const candidates = data.candidates || [];

          roleMap[role] = (roleMap[role] || 0) + candidates.length;

          candidates.forEach(c => {
            const status = c.status || 'Unspecified';
            statusMap[status] = (statusMap[status] || 0) + 1;
          });
        });

        setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
        setRoleData(Object.entries(roleMap).map(([name, count]) => ({ name, count })));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load report data', err);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Reports & Insights</h1>

        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Pie Chart: Status Distribution */}
            <div className="bg-white border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-4">Candidates by Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart: Candidates per Role */}
            <div className="bg-white border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-4">Candidates by Role</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
