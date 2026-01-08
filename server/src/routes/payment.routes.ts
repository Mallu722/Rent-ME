import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.model';
import Booking from '../models/Booking.model';
import User from '../models/User.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create payment intent for booking
router.post('/create-intent', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user?._id.toString() || '',
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment intent',
    });
  }
});

// Confirm payment
router.post('/confirm', authenticate, async (req: AuthRequest, res) => {
  try {
    const { paymentIntentId, bookingId, method = 'stripe' } = req.body;

    let paymentStatus = 'completed';
    let transactionId = paymentIntentId;

    // If Stripe, verify payment
    if (method === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        paymentStatus = 'failed';
      }
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user?._id,
      booking: bookingId,
      type: 'booking',
      amount: booking.pricing.total,
      currency: booking.pricing.currency,
      method,
      status: paymentStatus,
      stripePaymentIntentId: method === 'stripe' ? paymentIntentId : undefined,
      transactionId,
    });

    // Update booking payment status
    booking.payment.status = paymentStatus;
    booking.payment.transactionId = transactionId;
    booking.payment.paidAt = new Date();
    if (paymentStatus === 'completed') {
      booking.status = 'confirmed';
    }
    await booking.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: { payment },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming payment',
    });
  }
});

// Wallet top-up
router.post('/wallet/topup', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, paymentMethod, paymentIntentId } = req.body;

    let paymentStatus = 'completed';
    let transactionId = paymentIntentId;

    // If Stripe, verify payment
    if (paymentMethod === 'stripe' && paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        paymentStatus = 'failed';
      }
    }

    if (paymentStatus === 'completed') {
      // Update user wallet
      const user = await User.findById(req.user?._id);
      if (user) {
        user.wallet = user.wallet || { balance: 0, currency: 'USD' };
        user.wallet.balance += amount;
        await user.save();
      }
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user?._id,
      type: 'wallet_topup',
      amount,
      currency: 'USD',
      method: paymentMethod,
      status: paymentStatus,
      stripePaymentIntentId: paymentMethod === 'stripe' ? paymentIntentId : undefined,
      transactionId,
    });

    res.json({
      success: true,
      message: 'Wallet topped up successfully',
      data: { payment, wallet: user?.wallet },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error topping up wallet',
    });
  }
});

// Pay with wallet
router.post('/wallet/pay', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user || !user.wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    if (user.wallet.balance < booking.pricing.total) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
      });
    }

    // Deduct from wallet
    user.wallet.balance -= booking.pricing.total;
    await user.save();

    // Create payment record
    const payment = await Payment.create({
      user: req.user?._id,
      booking: bookingId,
      type: 'booking',
      amount: booking.pricing.total,
      currency: booking.pricing.currency,
      method: 'wallet',
      status: 'completed',
      transactionId: `WALLET-${Date.now()}`,
    });

    // Update booking
    booking.payment.status = 'completed';
    booking.payment.method = 'wallet';
    booking.payment.transactionId = payment.transactionId;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Payment successful',
      data: { payment, wallet: user.wallet },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing payment',
    });
  }
});

// Get payment history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const payments = await Payment.find({ user: req.user?._id })
      .populate('booking')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Payment.countDocuments({ user: req.user?._id });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching payment history',
    });
  }
});

// Get wallet balance
router.get('/wallet', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?._id).select('wallet');
    res.json({
      success: true,
      data: { wallet: user?.wallet || { balance: 0, currency: 'USD' } },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching wallet',
    });
  }
});

export default router;
