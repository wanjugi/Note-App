// routes/userRoutes.js
import express from 'express';

// 1. Import all three of our new controller functions
import { 
  getUsersList, 
  getAdminUserList, 
  updateUserRole,
  deleteUser
} from '../controllers/userController.js';

// 2. Import our middleware
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js'; // <-- Our new role guard

const router = express.Router();

// --- For the "Assign Note" Dropdown ---
// GET /api/users/list
// Accessible by *any* logged-in user
router.get('/list', protect, getUsersList);

// --- For the "Admin Panel" ---
// GET /api/users/admin
// Accessible by *admins only*
// A user must be: 1. Logged in (protect), AND 2. An admin (isAdmin)

router.get('/admin', protect, isAdmin, getAdminUserList);

// PUT /api/users/admin/:id/role
// Accessible by *admins only*
router.put('/admin/:id/role', protect, isAdmin, updateUserRole);

// DELETE user route
router.delete('/admin/:id', protect, isAdmin, deleteUser);
export default router;