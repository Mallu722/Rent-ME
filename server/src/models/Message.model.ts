import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'system';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'system'],
      default: 'text',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ booking: 1 });
MessageSchema.index({ isRead: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
