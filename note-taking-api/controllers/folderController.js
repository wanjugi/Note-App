import Folder from '../models/Folder.js';
import Note from '../models/Note.js';

// --- Create a Folder (No change needed) ---
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const newFolder = new Folder({
      name,
      user: req.user.id, // 'user' here is correct, it's the owner
    });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating folder', error: error.message });
  }
};

// --- Get All My Folders (No change needed) ---
// This is specific to the user, so no role logic is needed.
export const getAllMyFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching folders', error: error.message });
  }
};

// --- Update a Folder (UPDATED WITH ROLE LOGIC) ---
export const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folderId = req.params.id;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // --- PERMISSION CHECK UPDATED ---
    // Block the request IF:
    // 1. You are NOT the owner
    // 2. AND you are ONLY a 'user'
    if (folder.user.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(401).json({ message: 'User not authorized to update folder' });
    }
    // (If you are the owner, you pass. If you are 'moderator' or 'admin', you pass)

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { name },
      { new: true }
    );
    res.status(200).json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating folder', error: error.message });
  }
};

// --- Delete a Folder (UPDATED WITH ROLE LOGIC) ---
export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // --- PERMISSION CHECK UPDATED ---
    // Block the request IF:
    // 1. You are NOT the owner
    // 2. AND you are ONLY a 'user'
    if (folder.user.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(401).json({ message: 'User not authorized to delete folder' });
    }
    // (If you are the owner, you pass. If you are 'moderator' or 'admin', you pass)

    // 1. Delete the folder itself
    await Folder.findByIdAndDelete(folderId);

    // 2. IMPORTANT: Un-assign notes from this folder
    // Find all notes that belonged to this folder and set their 'folder' field to null

    await Note.updateMany(
      { folder: folderId },
      { $set: { folder: null } }
    );

    res.status(200).json({ message: 'Folder deleted and notes unassigned' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting folder', error: error.message });
  }
};