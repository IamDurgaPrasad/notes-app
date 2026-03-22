import { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';

export default function NoteModal({ note, onSave, onClose, saving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || []);
    }
  }, [note]);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput('');
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), content, tags });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{note?._id ? 'Edit note' : 'New note'}</h2>
          <button onClick={onClose} className="icon-btn"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <input
            className="modal-title-input"
            placeholder="Note title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="modal-content-input"
            placeholder="Write your note here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
          />
          <div className="tag-input-row">
            <Tag size={15} />
            <input
              placeholder="Add a tag, press Enter"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={addTag} className="icon-btn"><Plus size={15} /></button>
          </div>
          {tags.length > 0 && (
            <div className="modal-tags">
              {tags.map(tag => (
                <span key={tag} className="note-tag removable" onClick={() => removeTag(tag)}>
                  #{tag} ×
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className="btn-primary" disabled={!title.trim() || saving}>
            {saving ? 'Saving...' : note?._id ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </div>
    </div>
  );
}