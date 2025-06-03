// src/pages/RequirementDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from '../components/Header';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ItemTypes = { COLUMN: 'column', ROW: 'row' };

function DraggableColumn({ column, index, moveColumn, removeColumn }) {
  const [, drag] = useDrag({ type: ItemTypes.COLUMN, item: { index } });
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    }
  });
  return (
    <th ref={(node) => drag(drop(node))} className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700 bg-gray-50">
      <div className="flex justify-between items-center">
        {column.label}
        {column.key !== 'resume' && (
          <button
            onClick={() => removeColumn(column.key)}
            className="text-red-500 text-xs ml-2"
            title={`Remove ${column.label}`}
          >
            ✕
          </button>
        )}
      </div>
    </th>
  );
}

function DraggableRow({ row, index, columns, updateRow, moveRow, handleFileChange, statusOptions, removeRow }) {
  const [, drag] = useDrag({ type: ItemTypes.ROW, item: { index } });
  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover: (item) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    }
  });
  return (
    <tr ref={(node) => drag(drop(node))} className="hover:bg-gray-50">
      {columns.map((col) => (
        <td key={col.key} className="border px-3 py-2 text-sm">
          {col.key === 'resume' ? (
            <>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
              />
              {row[col.key] && (
                <div className="text-xs mt-1 text-blue-600">
                  <span>{typeof row[col.key] === 'string' ? row[col.key] : row[col.key]?.name}</span>
                </div>
              )}
            </>
          ) : col.key === 'status' ? (
            <select
              value={row[col.key] || ''}
              onChange={(e) => updateRow(index, col.key, e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="">--Select--</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              value={row[col.key] || ''}
              onChange={(e) => updateRow(index, col.key, e.target.value)}
              className="w-full p-1 border rounded"
              placeholder={col.label}
            />
          )}
        </td>
      ))}
      <td className="text-center border px-3 py-2">
        <button onClick={() => removeRow(index)} className="text-red-500 text-xs" title="Remove">
          ✕
        </button>
      </td>
    </tr>
  );
}

export default function RequirementDetail() {
  const { roleName } = useParams();
  const decodedRole = roleName ? decodeURIComponent(roleName) : 'Unknown';

  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    { key: 'resume', label: 'Resume' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Contact' },
    { key: 'currentCompany', label: 'Current Company' },
    { key: 'pastCompany', label: 'Past Company' },
    { key: 'currentCTC', label: 'Current CTC' },
    { key: 'expectedCTC', label: 'Expected CTC' },
    { key: 'noticePeriod', label: 'Notice Period' },
    { key: 'status', label: 'Status' }
  ]);

  const [statusOptions, setStatusOptions] = useState([
    'Sourced', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected',
    'Rejected', 'Sent to Client', 'Rejected by Client', 'Offered', 'Offer Accepted',
    'Offer Declined', 'Joined', 'Did Not Join'
  ]);
  const [newCol, setNewCol] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid, 'candidates', decodedRole);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.candidates)) {
            setRows(data.candidates);
          }
        }
      } catch (error) {
        console.error('Error loading candidates:', error);
      }
    };

    fetchCandidates();
  }, [user, decodedRole]);

  const addRow = () => {
    const newRow = {};
    columns.forEach(col => newRow[col.key] = col.key === 'resume' ? null : '');
    setRows(prev => [...prev, newRow]);
  };

  const updateRow = (i, field, val) => {
    setRows(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  };

  const moveColumn = (from, to) => {
    setColumns(prev => {
      const cols = [...prev];
      const [moved] = cols.splice(from, 1);
      cols.splice(to, 0, moved);
      return cols;
    });
  };

  const moveRow = (from, to) => {
    setRows(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleFileChange = (i, file) => updateRow(i, 'resume', file);

  const addColumn = () => {
    if (!newCol.trim()) return;
    const key = newCol.replace(/\s+/g, '').toLowerCase();
    if (!columns.find(col => col.key === key)) {
      setColumns(prev => [...prev, { key, label: newCol }]);
      setRows(prev => prev.map(r => ({ ...r, [key]: '' })));
    }
    setNewCol('');
  };

  const addStatus = () => {
    if (newStatus.trim() && !statusOptions.includes(newStatus)) {
      setStatusOptions(prev => [...prev, newStatus]);
      setNewStatus('');
    }
  };

  const removeColumn = (key) => {
    if (!window.confirm(`Remove column '${key}'?`)) return;
    setColumns(prev => prev.filter(col => col.key !== key));
    setRows(prev => prev.map(r => {
      const copy = { ...r };
      delete copy[key];
      return copy;
    }));
  };

  const removeRow = (index) => {
    if (!window.confirm(`Remove candidate row ${index + 1}?`)) return;
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const saveCandidates = async () => {
    if (!user) return;
    const roleDocRef = doc(db, 'users', user.uid, 'candidates', decodedRole);
    try {
      const cleanedRows = rows.map(row => {
        const cleaned = { ...row };
        if (cleaned.resume instanceof File) {
          cleaned.resume = cleaned.resume.name;
        }
        return cleaned;
      });

      await setDoc(roleDocRef, { candidates: cleanedRows });
      alert('Candidates saved successfully!');
    } catch (error) {
      console.error('Error saving candidates:', error);
      alert('Failed to save candidates');
    }
  };

  const filteredRows = rows.filter(r => {
    const values = Object.values(r).map(val => val?.name || val).join(' ').toLowerCase();
    return values.includes(filter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <DndProvider backend={HTML5Backend}>
        <main className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">Candidates for: {decodedRole}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button onClick={addRow} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
              Add Candidate
            </button>

            <input
              value={newCol}
              onChange={(e) => setNewCol(e.target.value)}
              placeholder="New Column"
              className="border px-3 py-2 rounded text-sm"
            />
            <button onClick={addColumn} className="bg-gray-100 px-4 py-2 rounded text-sm">
              Add Column
            </button>

            <input
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="New Status"
              className="border px-3 py-2 rounded text-sm"
            />
            <button onClick={addStatus} className="bg-gray-100 px-4 py-2 rounded text-sm">
              Add Status
            </button>

            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter Candidates"
              className="flex-1 border px-3 py-2 rounded text-sm"
            />

            <button onClick={saveCandidates} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
              Save Candidates
            </button>
          </div>

          <div className="overflow-x-auto border rounded bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <DraggableColumn
                      key={col.key}
                      column={col}
                      index={i}
                      moveColumn={moveColumn}
                      removeColumn={removeColumn}
                    />
                  ))}
                  <th className="px-3 py-2 border-b bg-gray-50 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, i) => (
                  <DraggableRow
                    key={i}
                    row={row}
                    index={i}
                    columns={columns}
                    updateRow={updateRow}
                    moveRow={moveRow}
                    handleFileChange={handleFileChange}
                    statusOptions={statusOptions}
                    removeRow={removeRow}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </DndProvider>
    </div>
  );
}
