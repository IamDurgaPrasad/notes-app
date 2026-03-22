const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/notes/tags — MUST be before /:id
router.get('/tags', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    const tags = [...new Set(notes.flatMap(n => n.tags))];
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = { user: req.user._id };
    if (tag) filter.tags = tag;
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags: tags || []
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    const { title, content, tags, isPinned } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;