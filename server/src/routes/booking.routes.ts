import express from 'express';
import Booking from '../../../database/models/Booking.model';
import Companion from '../../../database/models/Companion.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validateBooking, validate } from '../utils/validation.util';

const router = express.Router();

// Create booking
router.post('/', authenticate, validateBooking, validate, async (req: AuthRequest, res) => {
  try {
    const { companion, activity, date, startTime, endTime, duration, location, specialRequests } = req.body;

    // Check if companion exists and is available
    const companionProfile = await Companion.findById(companion);
    if (!companionProfile || !companionProfile.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found or not available',
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      companion,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime },
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot already booked',
      });
    }

    // Calculate pricing
    const rate = companionProfile.pricing.activityBased?.[activity] || companionProfile.pricing.hourly;
    const total = rate * duration;

    // Create booking
    const booking = await Booking.create({
      user: req.user?._id,
      companion,
      activity,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      location,
      specialRequests,
      pricing: {
        rate,
        total,
        currency: companionProfile.pricing.currency,
      },
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating booking',
    });
  }
});

// Get user bookings
router.get('/my-bookings', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { user: req.user?._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('companion', 'userId')
      .populate({
        path: 'companion',
        populate: { path: 'userId', select: 'name profilePhoto' },
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
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
      message: error.message || 'Error fetching bookings',
    });
  }
});

// Get companion bookings
router.get('/companion-bookings', authenticate, async (req: AuthRequest, res) => {
  try {
    const companion = await Companion.findOne({ userId: req.user?._id });
    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion profile not found',
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { companion: companion._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
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
      message: error.message || 'Error fetching bookings',
    });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name profilePhoto')
      .populate({
        path: 'companion',
        populate: { path: 'userId', select: 'name profilePhoto' },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user has access
    if (
      booking.user.toString() !== req.user?._id.toString() &&
      booking.companion.toString() !== req.user?._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking',
    });
  }
});

// Update booking status (confirm/reject/cancel)
router.put('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    const companion = await Companion.findOne({ userId: req.user?._id });
    const canUpdate =
      booking.user.toString() === req.user?._id.toString() ||
      (companion && booking.companion.toString() === companion._id.toString());

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update status
    booking.status = status;

    if (status === 'cancelled') {
      booking.cancellation = {
        cancelledBy: booking.user.toString() === req.user?._id.toString() ? 'user' : 'companion',
        cancelledAt: new Date(),
      };
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking',
    });
  }
});

// Check-in
router.post('/:id/checkin', authenticate, async (req: AuthRequest, res) => {
  try {
    const { location } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking not found or not confirmed',
      });
    }

    booking.checkIn = {
      time: new Date(),
      location: location,
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: { booking },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking in',
    });
  }
});

// Check-out
router.post('/:id/checkout', authenticate, async (req: AuthRequest, res) => {
  try {
    const { location } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking not found or not confirmed',
      });
    }

    booking.checkOut = {
      time: new Date(),
      location: location,
    };
    booking.status = 'completed';

    // Update companion stats
    const companion = await Companion.findById(booking.companion);
    if (companion) {
      companion.completedBookings += 1;
      companion.totalBookings += 1;
      await companion.save();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: { booking },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking out',
    });
  }
});

export default router;
