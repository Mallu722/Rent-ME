import express from 'express';
import Review from '../models/Review.model';
import Booking from '../models/Booking.model';
import Companion from '../models/Companion.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validateReview, validate } from '../utils/validation.util';

const router = express.Router();

// Create review
router.post('/', authenticate, validateReview, validate, async (req: AuthRequest, res) => {
  try {
    const { booking, rating, comment, tags } = req.body;

    // Check if booking exists and is completed
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc || bookingDoc.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking not found or not completed',
      });
    }

    // Check if user is the booking owner
    if (bookingDoc.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only booking owner can review',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking',
      });
    }

    // Create review
    const review = await Review.create({
      booking,
      user: req.user?._id,
      companion: bookingDoc.companion,
      rating,
      comment,
      tags,
    });

    // Update companion rating
    const companion = await Companion.findById(bookingDoc.companion);
    if (companion) {
      const reviews = await Review.find({ companion: companion._id });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      companion.rating.average = totalRating / reviews.length;
      companion.rating.count = reviews.length;
      await companion.save();
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating review',
    });
  }
});

// Get reviews for a companion
router.get('/companion/:companionId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find({ companion: req.params.companionId })
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Review.countDocuments({ companion: req.params.companionId });

    res.json({
      success: true,
      data: {
        reviews,
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
      message: error.message || 'Error fetching reviews',
    });
  }
});

// Get user's reviews
router.get('/my-reviews', authenticate, async (req: AuthRequest, res) => {
  try {
    const reviews = await Review.find({ user: req.user?._id })
      .populate('companion', 'userId')
      .populate({
        path: 'companion',
        populate: { path: 'userId', select: 'name profilePhoto' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews',
    });
  }
});

export default router;
