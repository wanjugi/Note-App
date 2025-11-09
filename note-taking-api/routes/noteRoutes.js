import express from 'express';
import { 
  createNote, 
  getAllMyNotes, 
  updateNote, 
  deleteNote, 
  getNotesByFolder,
  getNoteById,
  getAssignedNotes, 
  getSentNotes 
} from '../controllers/noteController.js';

// import 'protect' middleware
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We add 'protect' as the "security guard" on all routes.

// --- SPECIFIC ROUTES (MUST COME FIRST) ---

// Route to get all notes for a user (Inbox)
router.get('/', protect, getAllMyNotes);

// GET /api/notes/assigned (Notes "Assigned to Me")
// We put this before '/:id' to avoid 'assigned' being read as an ID
router.get('/assigned', protect, getAssignedNotes);

// GET /api/notes/sent
router.get('/sent', protect, getSentNotes);

// Route to create a new note
router.post('/', protect, createNote);

// GET all notes for a specific folder
router.get('/folder/:folderId', protect, getNotesByFolder);


// --- GENERIC ROUTES (MUST COME LAST) ---
// These match ANY id, so they must be at the bottom.

// GET /api/notes/:id (Get a single note)
router.get('/:id', protect, getNoteById);

// Update a note (PUT)
router.put('/:id', protect, updateNote);

// Delete a note
router.delete('/:id', protect, deleteNote);

export default router;