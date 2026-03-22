import { Pencil, Trash2, Pin } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          className={`pin-btn ${note.isPinned ? 'pinned' : ''}`}
          onClick={() => onPin(note)}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={15} />
        </button>
      </div>
      <p className="note-content">{note.content}</p>
      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="note-tag">#{tag}</span>
          ))}
        </div>
      )}
      <div className="note-footer">
        <span className="note-date">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="note-actions">
          <button onClick={() => onEdit(note)} className="icon-btn" title="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(note._id)} className="icon-btn danger" title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}