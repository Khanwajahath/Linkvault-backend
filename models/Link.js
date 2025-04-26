import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    url: {
      type: String,
      required: [true, 'Please provide a URL'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    tags: {
      type: [String],
      default: []
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Create compound index on userId and URL to ensure uniqueness per user
LinkSchema.index({ userId: 1, url: 1 }, { unique: true });

export default mongoose.model('Link', LinkSchema);