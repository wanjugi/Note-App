import express from 'express';
import {
  createFolder,
  getAllMyFolders,
  updateFolder,
  deleteFolder
} from '../controllers/folderController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All folder routes are protected
router.post('/', protect, createFolder);
router.get('/', protect, getAllMyFolders);
router.put('/:id', protect, updateFolder);
router.delete('/:id', protect, deleteFolder);

export default router;