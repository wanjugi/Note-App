import mongoose from 'mongoose';
const { Schema } = mongoose;

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Folders MUST have an owner
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;