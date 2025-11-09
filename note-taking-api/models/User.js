import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true, // No two users can have the same username
      lowercase: true, // Store usernames as lowercase to avoid confusion
      trim: true, // Remove any extra spaces from the start or end
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'], // The only possible values
      default: 'user' // All new signups will be a 'user'
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;