import Note from '../models/Note.js';

// --- Create a New Note (No change needed) ---
export const createNote = async (req, res) => {
  try {
    const { title, content, folderId, assigneeId } = req.body;
    const newNote = new Note({
      title,
      content,
      author: req.user.id,
      folder: assigneeId ? null : (folderId || null),
      assignee: assigneeId || null
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating note', error: error.message });
  }
};

// --- Get All "My" Notes (Inbox) (No change needed) ---
export const getAllMyNotes = async (req, res) => {
  // This logic is correct, it's specific to the logged-in user.
  try {
    const notes = await Note.find({
      author: req.user.id,
      folder: null,
      assignee: null
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notes', error: error.message });
  }
};

// --- Get Notes for a Specific Folder (No change needed) ---
export const getNotesByFolder = async (req, res) => {
  // This logic is correct, it's specific to the logged-in user.
  try {
    const { folderId } = req.params;
    const notes = await Note.find({
      author: req.user.id,
      folder: folderId,
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching folder notes', error: error.message });
  }
};


// --- Update a Note (UPDATED WITH ROLE LOGIC) ---
export const updateNote = async (req, res) => {
  try {
    const { title, content, folderId, assigneeId } = req.body;
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // --- PERMISSION CHECK UPDATED ---
    // Block the request IF:
    // 1. You are NOT the author
    // 2. AND you are ONLY a 'user'

    if (note.author.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(401).json({ message: 'User not authorized to update' });
    }
    // (If you are the author, you pass. If you are 'moderator' or 'admin', you pass)

    // 2. Update the note with the new data
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: { title, content, folder: folderId || null, assignee: assigneeId || null } },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating note', error: error.message });
  }
};

// --- Delete a Note (UPDATED WITH ROLE LOGIC) ---
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // --- THIS IS THE NEW PERMISSION CHECK ---
    // Check if the user is the author
    const isAuthor = note.author.toString() === req.user.id;
    // Check if the user is the assignee (and if assignee exists)
    const isAssignee = note.assignee && note.assignee.toString() === req.user.id;
    // Check if the user is a mod/admin
    const isModerator = req.user.role === 'moderator' || req.user.role === 'admin';

    // Block the request IF:
    // You are NOT the author, AND
    // You are NOT the assignee, AND
    // You are NOT a moderator/admin
    if (!isAuthor && !isAssignee && !isModerator) {
      return res.status(401).json({ message: 'User not authorized to delete' });
    }
    // (If you are the author, assignee, or a mod/admin, you pass)

    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting note', error: error.message });
  }
};

// --- Get a Single Note by ID (UPDATED WITH ROLE LOGIC) ---
export const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // --- PERMISSION CHECK UPDATED ---
    // Block the request IF:
    // 1. You are NOT the author
    // 2. AND you are NOT the assignee
    // 3. AND you are ONLY a 'user'
    const isAuthor = note.author.toString() === req.user.id;
    const isAssignee = note.assignee && note.assignee.toString() === req.user.id;
    const isUserRole = req.user.role === 'user';

    if (!isAuthor && !isAssignee && isUserRole) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    // (If you are author, assignee, moderator, or admin, you pass)

    // 5. If all checks pass, send the note
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching note', error: error.message });
  }
};

// --- Get Assigned Notes (No change needed) ---
export const getAssignedNotes = async (req, res) => {
  // This logic is correct, it's specific to the logged-in user.
  try {
    const notes = await Note.find({ assignee: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assigned notes' });
  }
};