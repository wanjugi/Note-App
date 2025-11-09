import Note from '../models/Note.js';
import User from '../models/User.js';
import { sendNoteNotification } from '../utils/emailService.js';

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
    // If this note is assigned to someone (and it's NOT assigned to yourself)
    // 2. The sender is an 'admin'
    if (assigneeId && assigneeId !== req.user.id && req.user.role === 'admin') {
      // We don't 'await' this. We let it run in the background
      // so the user doesn't have to wait for the email to send.
      User.findById(assigneeId).then(assignee => {
        if (assignee && assignee.email) {
          sendNoteNotification(
            assignee.email,    // Send to this email
            req.user.username, // From the current logged-in user
            savedNote.title    // with this note title
          );
        }
      });
    }
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


// --- Update a Note (STRICTER PERMISSIONS) ---
export const updateNote = async (req, res) => {
  try {
    const { title, content, folderId, assigneeId } = req.body;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // --- STRICTER PERMISSION CHECK ---
    // Only the AUTHOR (or an admin/mod) can edit a note.
    // The assignee CANNOT edit it.
    const isAuthor = note.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Only the author can edit this note.' });
    }
    // --------------------------------

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

// --- Delete a Note (UNIFIED LOGIC) ---
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const userId = req.user.id;
    // We use .toString() to ensure we are comparing strings
    const isAuthor = note.author.toString() === userId;
    const isAssignee = note.assignee && note.assignee.toString() === userId;

    // CASE 1: It's a personal note (Hard Delete)
    // If it wasn't sent to anyone, just delete it for real.
    if (!note.assignee) {
      if (!isAuthor) return res.status(401).json({ message: 'Not authorized' });
      await Note.findByIdAndDelete(noteId);
      return res.status(200).json({ message: 'Personal note deleted' });
    }

    // CASE 2: It's a shared note (Soft Delete)
    let wasHidden = false;

    if (isAuthor) {
      note.visibleToAuthor = false;
      wasHidden = true;
    }
    // We use a separate 'if' so if you assigned it to yourself,
    // it hides it from BOTH your lists instantly.
    if (isAssignee) {
      note.visibleToAssignee = false;
      wasHidden = true;
    }

    // If the user is NEITHER the author nor the assignee, they can't delete it.
    // (This now applies to admins too, as requested)
    if (!wasHidden) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    // CASE 3: Cleanup (Hard Delete if both have hidden it)
    if (note.visibleToAuthor === false && note.visibleToAssignee === false) {
      await Note.findByIdAndDelete(noteId);
      return res.status(200).json({ message: 'Shared note fully deleted' });
    }

    // Otherwise, just save the new visibility state
    await note.save();
    res.status(200).json({ message: 'Note removed from your list' });

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
    const notes = await Note.find({ assignee: req.user.id, visibleToAssignee: true }).populate('author', 'username _id');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assigned notes' });
  }
};

// --- Get All Notes I Have SENT (NEW) ---
export const getSentNotes = async (req, res) => {
  try {
    // Find notes where I am the AUTHOR, but there IS an assignee.
    // We '$ne' (not equal) null to find ones that HAVE an assignee.
    const notes = await Note.find({
      author: req.user.id,
      assignee: { $ne: null },
      visibleToAuthor: true
    })
      .populate('assignee', 'username _id'); // Populate so we can show "To: [Name]"

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching sent notes' });
  }
};