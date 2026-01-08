import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanion extends Document {
  userId: mongoose.Types.ObjectId;
  activityCategories: string[];
  availability: {
    days: string[];
    timeSlots: {
      start: string;
      end: string;
    }[];
    timezone: string;
  };
  pricing: {
    hourly: number;
    activityBased?: {
      [key: string]: number;
    };
    currency: string;
  };
  verification: {
    idDocument?: string;
    idVerified: boolean;
    verifiedAt?: Date;
  };
  rating: {
    average: number;
    count: number;
  };
  totalBookings: number;
  completedBookings: number;
  cancellationRate: number;
  responseTime?: number; // in minutes
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanionSchema = new Schema<ICompanion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    activityCategories: [{
      type: String,
      enum: ['walking', 'party', 'travel', 'hangout', 'talk', 'sports', 'dining', 'shopping'],
    }],
    availability: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }],
      timeSlots: [{
        start: String, // HH:mm format
        end: String,   // HH:mm format
      }],
      timezone: {
        type: String,
        default: 'UTC',
      },
    },
    pricing: {
      hourly: {
        type: Number,
        required: true,
        min: 0,
      },
      activityBased: {
        type: Map,
        of: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    verification: {
      idDocument: String,
      idVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },
    cancellationRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    responseTime: Number,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanionSchema.index({ userId: 1 });
CompanionSchema.index({ 'rating.average': -1 });
CompanionSchema.index({ activityCategories: 1 });
CompanionSchema.index({ 'location.city': 1 });
CompanionSchema.index({ isAvailable: 1, 'verification.idVerified': 1 });

export default mongoose.model<ICompanion>('Companion', CompanionSchema);
