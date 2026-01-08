import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  type: 'booking' | 'wallet_topup' | 'refund';
  amount: number;
  currency: string;
  method: 'wallet' | 'card' | 'upi' | 'stripe';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  transactionId?: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    type: {
      type: String,
      enum: ['booking', 'wallet_topup', 'refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    method: {
      type: String,
      enum: ['wallet', 'card', 'upi', 'stripe'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: String,
    transactionId: String,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionId: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
