import express from 'express';
import { createNote, getAllMyNotes, updateNote, deleteNote, getNotesByFolder,getNoteById,getAssignedNotes } from '../controllers/noteController.js';

// import 'protect' middleware
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We add 'protect' as the "security guard" on both routes.
// This means a user MUST be logged in (and provide a valid token)
// to access either of these routes.


// Route to get all notes for a user
router.get('/', protect, getAllMyNotes);

// GET /api/notes/assigned (Notes "Assigned to Me")
// We put this before '/:id' to avoid 'assigned' being read as an ID
router.get('/assigned', protect, getAssignedNotes);

// Route to create a new note
router.post('/', protect, createNote);

// Update a note (PUT)
router.put('/:id', protect, updateNote);

// Delete a note
router.delete('/:id', protect, deleteNote);

// GET all notes for a specific folder
// e.g., /api/notes/folder/60f89abc...
router.get('/folder/:folderId', protect, getNotesByFolder);

// GET /api/notes/:id (Get a single note)
router.get('/:id', protect, getNoteById);

export default router;