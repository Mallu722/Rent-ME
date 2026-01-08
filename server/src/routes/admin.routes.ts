import express from 'express';
import User from '../models/User.model';
import Companion from '../models/Companion.model';
import Booking from '../models/Booking.model';
import Review from '../models/Review.model';
import Payment from '../models/Payment.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanions,
      totalBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
      pendingReports,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'companion' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Booking.countDocuments({ status: 'completed' }),
      Payment.aggregate([
        { $match: { status: 'completed', type: 'booking' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      User.countDocuments({ reportedBy: { $exists: true, $ne: [] } }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCompanions,
          totalBookings,
          activeBookings,
          completedBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingReports,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching stats',
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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
      message: error.message || 'Error fetching users',
    });
  }
});

// Get reported users
router.get('/reported-users', async (req, res) => {
  try {
    const users = await User.find({ reportedBy: { $exists: true, $ne: [] } })
      .populate('reportedBy', 'name email')
      .select('-password');

    res.json({
      success: true,
      data: { users },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reported users',
    });
  }
});

// Verify companion
router.put('/companions/:id/verify', async (req, res) => {
  try {
    const companion = await Companion.findById(req.params.id);
    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    companion.verification.idVerified = true;
    companion.verification.verifiedAt = new Date();
    await companion.save();

    res.json({
      success: true,
      message: 'Companion verified successfully',
      data: { companion },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying companion',
    });
  }
});

// Activate/Deactivate user
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user status',
    });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'companion',
        populate: { path: 'userId', select: 'name email' },
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

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Payment.countDocuments(query);

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
      message: error.message || 'Error fetching payments',
    });
  }
});

export default router;
