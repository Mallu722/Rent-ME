import express from 'express';
import Companion from '../../../database/models/Companion.model';
import User from '../../../database/models/User.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Get all companions with filters
router.get('/', async (req, res) => {
  try {
    const {
      activity,
      city,
      minRating,
      maxPrice,
      minPrice,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = { isAvailable: true };

    // Filter by activity
    if (activity) {
      query.activityCategories = activity;
    }

    // Filter by city
    if (city) {
      const users = await User.find({ 'location.city': new RegExp(city as string, 'i') }).select('_id');
      query.userId = { $in: users.map((u) => u._id) };
    }

    // Filter by rating
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating as string) };
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query['pricing.hourly'] = {};
      if (minPrice) query['pricing.hourly'].$gte = parseFloat(minPrice as string);
      if (maxPrice) query['pricing.hourly'].$lte = parseFloat(maxPrice as string);
    }

    // Search by name
    if (search) {
      const users = await User.find({
        name: new RegExp(search as string, 'i'),
        role: 'companion',
      }).select('_id');
      query.userId = { $in: users.map((u) => u._id) };
    }

    const companions = await Companion.find(query)
      .populate('userId', 'name age gender bio interests location profilePhoto isVerified')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Companion.countDocuments(query);

    res.json({
      success: true,
      data: {
        companions,
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
      message: error.message || 'Error fetching companions',
    });
  }
});

// Get companion by ID
router.get('/:id', async (req, res) => {
  try {
    const companion = await Companion.findById(req.params.id)
      .populate('userId', 'name age gender bio interests location profilePhoto isVerified');

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    res.json({
      success: true,
      data: { companion },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching companion',
    });
  }
});

// Create/Update companion profile
router.post('/', authenticate, authorize('companion'), async (req: AuthRequest, res) => {
  try {
    const companionData = {
      userId: req.user?._id,
      ...req.body,
    };

    let companion = await Companion.findOne({ userId: req.user?._id });

    if (companion) {
      companion = await Companion.findByIdAndUpdate(companion._id, companionData, {
        new: true,
        runValidators: true,
      });
    } else {
      companion = await Companion.create(companionData);
    }

    res.json({
      success: true,
      message: 'Companion profile updated successfully',
      data: { companion },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating companion profile',
    });
  }
});

// Update companion availability
router.put('/availability', authenticate, authorize('companion'), async (req: AuthRequest, res) => {
  try {
    const companion = await Companion.findOneAndUpdate(
      { userId: req.user?._id },
      { availability: req.body },
      { new: true }
    );

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion profile not found',
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { companion },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating availability',
    });
  }
});

// Update companion pricing
router.put('/pricing', authenticate, authorize('companion'), async (req: AuthRequest, res) => {
  try {
    const companion = await Companion.findOneAndUpdate(
      { userId: req.user?._id },
      { pricing: req.body },
      { new: true }
    );

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion profile not found',
      });
    }

    res.json({
      success: true,
      message: 'Pricing updated successfully',
      data: { companion },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating pricing',
    });
  }
});

export default router;
