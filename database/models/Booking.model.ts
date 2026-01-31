import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  companion: mongoose.Types.ObjectId;
  activity: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  location?: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  pricing: {
    rate: number;
    total: number;
    currency: string;
  };
  payment: {
    method: 'wallet' | 'card' | 'upi' | 'stripe';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  checkIn?: {
    time: Date;
    location?: {
      lat: number;
      lng: number;
    };
  };
  checkOut?: {
    time: Date;
    location?: {
      lat: number;
      lng: number;
    };
  };
  cancellation?: {
    reason?: string;
    cancelledBy: 'user' | 'companion' | 'admin';
    cancelledAt: Date;
    refundAmount?: number;
  };
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
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
    activity: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0.5,
    },
    location: {
      address: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    pricing: {
      rate: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    payment: {
      method: {
        type: String,
        enum: ['wallet', 'card', 'upi', 'stripe'],
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      paidAt: Date,
    },
    checkIn: {
      time: Date,
      location: {
        lat: Number,
        lng: Number,
      },
    },
    checkOut: {
      time: Date,
      location: {
        lat: Number,
        lng: Number,
      },
    },
    cancellation: {
      reason: String,
      cancelledBy: {
        type: String,
        enum: ['user', 'companion', 'admin'],
      },
      cancelledAt: Date,
      refundAmount: Number,
    },
    specialRequests: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ companion: 1, status: 1 });
BookingSchema.index({ date: 1, status: 1 });
BookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
