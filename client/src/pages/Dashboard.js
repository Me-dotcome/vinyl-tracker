import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecords, deleteRecord } from '../services/api';
import RecordCard from '../components/RecordCard';
import RecordModal from '../components/RecordModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // null = add mode

  // Filter state
  const [filterArtist, setFilterArtist] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (filterArtist) filters.artist = filterArtist;
      if (filterGenre) filters.genre = filterGenre;
      const res = await getRecords(filters);
      setRecords(res.data);
    } catch (err) {
      setError('Failed to load records. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [filterArtist, filterGenre]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record from your collection?')) return;
    try {
      await deleteRecord(id);
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete record.');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleModalSave = () => {
    handleModalClose();
    fetchRecords();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-icon">🎵</span>
          <h1>Vinyl Tracker</h1>
        </div>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-logout" onClick={logout}>Log Out</button>
        </div>
      </header>

      {/* Controls bar */}
      <div className="controls-bar">
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by artist..."
            value={filterArtist}
            onChange={e => setFilterArtist(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by genre..."
            value={filterGenre}
            onChange={e => setFilterGenre(e.target.value)}
            className="filter-input"
          />
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add Record
        </button>
      </div>

      {/* Collection stats */}
      <div className="stats-bar">
        <span>{records.length} record{records.length !== 1 ? 's' : ''} in your collection</span>
      </div>

      {/* Content */}
      {loading && <p className="status-msg">Loading your collection...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && records.length === 0 && (
        <div className="empty-state">
          <p>🎷 Your collection is empty.</p>
          <p>Click <strong>+ Add Record</strong> to get started.</p>
        </div>
      )}

      <div className="records-grid">
        {records.map(record => (
          <RecordCard
            key={record._id}
            record={record}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <RecordModal
          record={editingRecord}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
