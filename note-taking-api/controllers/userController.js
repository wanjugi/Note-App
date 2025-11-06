import User from '../models/User.js'; // Import the User model
import Note from '../models/Note.js';     // <-- ADD THIS
import Folder from '../models/Folder.js';

/**
 * [PUBLIC] Gets a simple list of all users (id, username).
 * This is for the "Assign Note" dropdown.
 */
export const getUsersList = async (req, res) => {
  try {
    // We only select the 'username' and '_id' fields
    // This is fast and secure.
    const users = await User.find({}).select('username _id');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users list', error: error.message });
  }
};

/**
 * [ADMIN ONLY] Gets the full list of all users (with roles, etc.).
 * This is for your new Admin Panel.
 */
export const getAdminUserList = async (req, res) => {
  try {
    // We select everything *except* the password
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin user list', error: error.message });
  }
};

/**
 * [ADMIN ONLY] Updates a specific user's role.
 * This is for your new Admin Panel.
 */
export const updateUserRole = async (req, res) => {
  try {
    // 1. Get the new role from the request body
    const { role } = req.body;
    // 2. Get the user ID from the URL parameters
    const userId = req.params.id;

    // 3. Safety check: Make sure the role is a valid one
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // 4. Find the user by ID and update their role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role }, // Set the new role
      { new: true } // This option sends back the updated user
    ).select('-password'); // Don't send the password back

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 5. Send the updated user object back
    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: 'Server error updating user role', error: error.message });
  }
};

/**
 * [ADMIN ONLY] Deletes a user and all their associated notes/folders.
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Find the user to be deleted
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. SAFETY CHECK: Prevent an admin from deleting themselves
    if (userToDelete._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Admin cannot delete their own account' });
    }

    // 3. Delete all notes and folders owned by this user
    // We use 'author' for notes and 'user' for folders
    
    await Note.deleteMany({ author: userId });
    await Folder.deleteMany({ user: userId });

    // 4. Finally, delete the user themselves
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and all associated data deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user', error: error.message });
  }
};

