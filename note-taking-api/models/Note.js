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

    // This is the person who WROTE the note
    author: {
      type: Schema.Types.ObjectId, // This stores a MongoDB ID
      ref: 'User', // This tells Mongoose, "The ID stored here belongs to the 'User' collection"
      required: true, // A note MUST have an author
    },

    // The Link to the Folder
    folder: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null, // Default to no folder
    },


    // This is the person the note is ASSIGNED TO
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null // If null, it's just a personal note
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


const Note = mongoose.model('Note', noteSchema);

export default Note;