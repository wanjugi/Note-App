import mongoose from 'mongoose';
const { Schema } = mongoose; // Destructure Schema for cleaner code

const noteSchema = new Schema(
  {
    // The Note's content
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },

    // 2. The Link to the User (The "Owner")
    user: {
      type: Schema.Types.ObjectId, // This stores a MongoDB ID
      ref: 'User', // This tells Mongoose, "The ID stored here belongs to the 'User' collection"
      required: true, // A note MUST have an owner
    },

    // 3. The Link to the Folder
    folder: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null, // Default to no folder
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;