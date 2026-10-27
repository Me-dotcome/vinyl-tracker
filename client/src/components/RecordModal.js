import { useState } from 'react';
import { addRecord, updateRecord, searchDiscogs } from '../services/api';

const EMPTY_FORM = {
  title: '', artist: '', year: '', label: '',
  genre: '', condition: '', notes: '', coverUrl: '', discogsId: '',
};

export default function RecordModal({ record, onClose, onSave }) {
  const isEditing = Boolean(record);
  const [form, setForm] = useState(record ? { ...record } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Discogs search state
  const [discogsQuery, setDiscogsQuery] = useState('');
  const [discogsResults, setDiscogsResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [discogsError, setDiscogsError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDiscogsSearch = async () => {
    if (!discogsQuery.trim()) return;
    setSearching(true);
    setDiscogsError('');
    setDiscogsResults([]);
    try {
      const res = await searchDiscogs(discogsQuery);
      if (res.data.length === 0) {
        setDiscogsError('No results found. Try a different search term.');
      } else {
        setDiscogsResults(res.data);
      }
    } catch {
      setDiscogsError('Search failed. Check your Discogs token in .env');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectDiscogs = (result) => {
    // Auto-fill the form fields from the selected Discogs result
    setForm(prev => ({
      ...prev,
      title: result.title || prev.title,
      year: result.year || prev.year,
      label: result.label || prev.label,
      genre: result.genre || prev.genre,
      coverUrl: result.coverUrl || prev.coverUrl,
      discogsId: result.discogsId || prev.discogsId,
    }));
    setDiscogsResults([]);
    setDiscogsQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateRecord(record._id, form);
      } else {
        await addRecord(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Record' : 'Add Record'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Discogs Search Panel */}
        <div className="discogs-panel">
          <p className="discogs-label">🔍 Search Discogs to auto-fill fields</p>
          <div className="discogs-search-row">
            <input
              type="text"
              value={discogsQuery}
              onChange={e => setDiscogsQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDiscogsSearch()}
              placeholder="e.g. Pink Floyd Dark Side"
            />
            <button onClick={handleDiscogsSearch} disabled={searching} className="btn-secondary">
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
          {discogsError && <p className="error-message">{discogsError}</p>}
          {discogsResults.length > 0 && (
            <ul className="discogs-results">
              {discogsResults.map(r => (
                <li key={r.discogsId} onClick={() => handleSelectDiscogs(r)} className="discogs-result-item">
                  {r.coverUrl && <img src={r.coverUrl} alt="" className="result-thumb" />}
                  <span>{r.title} {r.year ? `(${r.year})` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Record Form */}
        <form onSubmit={handleSubmit} className="record-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Artist *</label>
              <input name="artist" value={form.artist} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} min="1900" max="2099" />
            </div>
            <div className="form-group">
              <label>Label</label>
              <input name="label" value={form.label} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <input name="genre" value={form.genre} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange}>
                <option value="">— Select —</option>
                {['M','NM','VG+','VG','G+','G','F','P'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Cover Image URL</label>
            <input name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="Auto-filled from Discogs, or paste a URL" />
          </div>
          <div className="form-group">
            <label>Personal Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Bought at Record Store Day 2024..." />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
