import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, StickyNote } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import TagFilter from '../components/TagFilter';
import Spinner from '../components/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const params = activeTag ? { tag: activeTag } : {};
      const { data } = await api.get('/notes', { params });
      setNotes(data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  const fetchTags = async () => {
    try {
      const { data } = await api.get('/notes/tags');
      setTags(data);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    fetchNotes();
    fetchTags();
  }, [fetchNotes]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editNote?._id) {
        await api.put(`/notes/${editNote._id}`, formData);
        toast.success('Note updated');
      } else {
        await api.post('/notes', formData);
        toast.success('Note created');
      }
      setShowModal(false);
      setEditNote(null);
      fetchNotes();
      fetchTags();
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/notes/${deleteId}`);
      toast.success('Note deleted');
      setDeleteId(null);
      fetchNotes();
      fetchTags();
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handlePin = async (note) => {
    try {
      await api.put(`/notes/${note._id}`, { isPinned: !note.isPinned });
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
      fetchNotes();
    } catch {
      toast.error('Failed to update note');
    }
  };

  const openCreate = () => { setEditNote(null); setShowModal(true); };
  const openEdit = (note) => { setEditNote(note); setShowModal(true); };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <div className="top-bar">
          <h2 className="page-title">My Notes</h2>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> New note
          </button>
        </div>

        <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />

        {loading ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <StickyNote size={40} strokeWidth={1.2} />
            <p>No notes here yet</p>
            <span>Click "New note" to create your first one</span>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <section className="notes-section">
                <h3 className="section-label">📌 Pinned</h3>
                <div className="notes-grid">
                  {pinnedNotes.map(note => (
                    <NoteCard key={note._id} note={note}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                      onPin={handlePin} />
                  ))}
                </div>
              </section>
            )}
            {unpinnedNotes.length > 0 && (
              <section className="notes-section">
                {pinnedNotes.length > 0 && <h3 className="section-label">All notes</h3>}
                <div className="notes-grid">
                  {unpinnedNotes.map(note => (
                    <NoteCard key={note._id} note={note}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                      onPin={handlePin} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {showModal && (
        <NoteModal
          note={editNote}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditNote(null); }}
          saving={saving}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this note? This cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}