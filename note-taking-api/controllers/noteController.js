import Note from '../models/Note.js';

// Create a New Note
export const createNote = async (req, res) => {
  try {
    // 1. Get title, content, and the optional folderId from the body
    const { title, content, folderId } = req.body;

    const newNote = new Note({
      title,
      content,
      user: req.user.id,
      // 2. If a folderId was provided, add it.
      // If not, it will default to 'null' (based on our model)
      folder: folderId || null,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);

  } catch (error) {
    res.status(500).json({ message: 'Server error creating note', error: error.message });
  }
};

// Get All My Notes (UPDATED to be "Inbox")
export const getAllMyNotes = async (req, res) => {
  try {
    // This now only finds notes where the 'folder' field is 'null'
    // It's your main "Inbox".
    const notes = await Note.find({
      user: req.user.id,
      folder: null
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notes', error: error.message });
  }
};

// Get Notes for a Specific Folder
export const getNotesByFolder = async (req, res) => {
  try {
    // 1. Get the folder's ID from the URL parameters
    const { folderId } = req.params;

    // 2. Find all notes that belong to this user AND this folder
    const notes = await Note.find({
      user: req.user.id,
      folder: folderId,
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching folder notes', error: error.message });
  }
};


// Update a Note
export const updateNote = async (req, res) => {
  try {
    // 1. Get title, content, AND the new folderId from the body
    const { title, content, folderId } = req.body;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // 2. Update the note with the new data
    // We use '$set' to explicitly update the fields provided.
    // This also allows moving a note to a new folder or back to the "Inbox" (by sending folderId: null)
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        $set: {
          title,
          content,
          folder: folderId || null
        }
      },
      { new: true } // This option sends back the updated document
    );

    res.status(200).json(updatedNote);

  } catch (error) {
    res.status(500).json({ message: 'Server error updating note', error: error.message });
  }
};

// Delete a Note
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: 'Note deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error deleting note', error: error.message });
  }
};