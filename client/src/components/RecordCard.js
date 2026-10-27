export default function RecordCard({ record, onEdit, onDelete }) {
  const placeholder = 'https://via.placeholder.com/200x200/1a1a2e/ffffff?text=No+Cover';

  return (
    <div className="record-card">
      <img
        src={record.coverUrl || placeholder}
        alt={`${record.title} cover`}
        className="record-cover"
        onError={e => { e.target.src = placeholder; }}
      />
      <div className="record-info">
        <h3 className="record-title">{record.title}</h3>
        <p className="record-artist">{record.artist}</p>
        <div className="record-meta">
          {record.year && <span className="meta-tag">{record.year}</span>}
          {record.genre && <span className="meta-tag">{record.genre}</span>}
          {record.condition && <span className="meta-tag condition">{record.condition}</span>}
        </div>
        {record.label && <p className="record-label">{record.label}</p>}
        {record.notes && <p className="record-notes">"{record.notes}"</p>}
      </div>
      <div className="record-actions">
        <button className="btn-edit" onClick={() => onEdit(record)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(record._id)}>Delete</button>
      </div>
    </div>
  );
}
