// src/pages/CandidateDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [statusLog, setStatusLog] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user || !candidateId) return;
      const [role, idx] = candidateId.split('__'); // expected format: "Frontend Developer__2"
      setRoleName(role);
      const docRef = doc(db, 'users', user.uid, 'candidates', role);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const candidateObj = data.candidates?.[parseInt(idx)];
        if (candidateObj) {
          setCandidate(candidateObj);
          setComments(candidateObj.comments || []);
          setStatusLog(candidateObj.statusLog || []);
        } else {
          alert('Candidate not found');
          navigate('/roles');
        }
      }
    };
    fetchCandidate();
  }, [user, candidateId, navigate]);

  const addComment = async () => {
    if (!comment.trim()) return;
    const newComment = {
      text: comment,
      time: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];

    const [role, idx] = candidateId.split('__');
    const docRef = doc(db, 'users', user.uid, 'candidates', role);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    data.candidates[parseInt(idx)].comments = updatedComments;

    await updateDoc(docRef, { candidates: data.candidates });
    setComments(updatedComments);
    setComment('');
  };

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading candidate...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Candidate Detail</h1>
        <p className="text-sm text-gray-600 mb-6">Role: <strong>{roleName}</strong></p>

        <div className="bg-gray-50 border rounded p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">{candidate.name}</h2>
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Contact:</strong> {candidate.contact}</p>
          <p><strong>Company:</strong> {candidate.currentCompany}</p>
          <p><strong>Status:</strong> {candidate.status}</p>
          {candidate.resume && (
            <p className="mt-2 text-blue-600">
              📄 Resume: {candidate.resume}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Activity Log</h3>
          {statusLog.length === 0 ? (
            <p className="text-sm text-gray-500">No status changes logged.</p>
          ) : (
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {statusLog.map((log, i) => (
                <li key={i}>{log.status} – {new Date(log.time).toLocaleString()}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Comments</h3>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {comments.map((c, i) => (
                <li key={i} className="border rounded p-2 bg-white shadow-sm">
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(c.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border p-2 rounded mb-2"
            rows={3}
          />
          <button
            onClick={addComment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            Add Comment
          </button>
        </div>
      </main>
    </div>
  );
}
