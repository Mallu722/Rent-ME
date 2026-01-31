import express from 'express';
import User from '../../../database/models/User.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validateProfileUpdate, validate } from '../utils/validation.util';
import { upload } from '../utils/upload.util';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
    });
  }
});

// Update user profile
router.put('/profile', authenticate, validateProfileUpdate, validate, async (req: AuthRequest, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
});

// Upload profile photo
router.post('/profile/photo', authenticate, upload.single('photo'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { profilePhoto: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading photo',
    });
  }
});

// Block user
router.post('/block/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $addToSet: { blockedUsers: userId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error blocking user',
    });
  }
});

// Unblock user
router.post('/unblock/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $pull: { blockedUsers: userId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error unblocking user',
    });
  }
});

// Report user
router.post('/report/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { reportedBy: req.user?._id },
    });

    // TODO: Send notification to admin

    res.json({
      success: true,
      message: 'User reported successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reporting user',
    });
  }
});

export default router;
