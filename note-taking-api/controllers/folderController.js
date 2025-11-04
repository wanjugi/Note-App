import Folder from '../models/Folder.js';
import Note from '../models/Note.js';

// Create a Folder
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const newFolder = new Folder({
      name,
      user: req.user.id,
    });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating folder', error: error.message });
  }
};

// Get All My Folders
export const getAllMyFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching folders', error: error.message });
  }
};

// Update a Folder
export const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folderId = req.params.id;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    // Check ownership
    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

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

//  Delete a Folder 
export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    // Check ownership
    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

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