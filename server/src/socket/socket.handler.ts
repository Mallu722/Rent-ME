import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import Message from '../models/Message.model';
import Booking from '../models/Booking.model';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketIO = (io: Server): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // Join user's personal room
    socket.join(`user:${userId}`);
    console.log(`User ${userId} connected`);

    // Handle sending messages
    socket.on('send_message', async (data: { receiverId: string; content: string; bookingId?: string }) => {
      try {
        const { receiverId, content, bookingId } = data;

        // Verify booking exists and users are part of it
        if (bookingId) {
          const booking = await Booking.findById(bookingId);
          if (!booking || booking.status !== 'confirmed') {
            socket.emit('error', { message: 'Invalid booking' });
            return;
          }

          const companion = await Booking.findById(bookingId).populate('companion');
          // Additional validation can be added here
        }

        // Create message
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          booking: bookingId,
          content,
          type: 'text',
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name profilePhoto')
          .populate('receiver', 'name profilePhoto');

        // Send to receiver
        io.to(`user:${receiverId}`).emit('new_message', populatedMessage);

        // Send confirmation to sender
        socket.emit('message_sent', populatedMessage);
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Error sending message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
      socket.to(`user:${data.receiverId}`).emit('typing', {
        userId,
        isTyping: data.isTyping,
      });
    });

    // Handle read receipt
    socket.on('mark_read', async (data: { messageIds: string[] }) => {
      try {
        await Message.updateMany(
          {
            _id: { $in: data.messageIds },
            receiver: userId,
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        );

        // Notify sender
        const messages = await Message.find({ _id: { $in: data.messageIds } });
        messages.forEach((msg) => {
          io.to(`user:${msg.sender.toString()}`).emit('messages_read', {
            messageIds: data.messageIds,
            readBy: userId,
          });
        });
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Error marking messages as read' });
      }
    });

    // Handle online status
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status', {
        userId,
        status: 'online',
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      socket.broadcast.emit('user_status', {
        userId,
        status: 'offline',
      });
    });
  });
};
