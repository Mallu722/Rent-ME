import express from 'express';
import Message from '../models/Message.model';
import Booking from '../models/Booking.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get conversations (list of users you've chatted with)
router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;

    // Get distinct conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          'user.password': 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching conversations',
    });
  }
});

// Get messages with a specific user
router.get('/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    // Check if there's a booking between users
    const booking = await Booking.findOne({
      $or: [
        { user: currentUserId, companion: userId },
        { user: userId, companion: currentUserId },
      ],
      status: { $in: ['confirmed', 'completed'] },
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'Chat is only available after booking confirmation',
      });
    }

    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name profilePhoto')
      .populate('receiver', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      data: { messages: messages.reverse() },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching messages',
    });
  }
});

// Mark messages as read
router.put('/:userId/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user?._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking messages as read',
    });
  }
});

export default router;
