import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'companion' | 'admin';
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  interests?: string[];
  location?: {
    city: string;
    state?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  profilePhoto?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  wallet?: {
    balance: number;
    currency: string;
  };
  blockedUsers?: mongoose.Types.ObjectId[];
  reportedBy?: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'companion', 'admin'],
      default: 'user',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    interests: [{
      type: String,
    }],
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    profilePhoto: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    blockedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    reportedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for search optimization
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'location.city': 1 });
UserSchema.index({ isActive: 1, isVerified: 1 });

export default mongoose.model<IUser>('User', UserSchema);
