import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  companion: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  tags?: string[]; // e.g., ['punctual', 'friendly', 'professional']
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companion: {
      type: Schema.Types.ObjectId,
      ref: 'Companion',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
ReviewSchema.index({ companion: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ booking: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
