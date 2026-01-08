import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.model';
import { generateToken } from '../utils/jwt.util';
import { authenticate } from '../middleware/auth.middleware';
import { validateSignup, validateLogin, validate } from '../utils/validation.util';

const router = express.Router();

// Signup
router.post('/signup', validateSignup, validate, async (req, res) => {
  try {
    const { email, password, name, role = 'user', phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      phone,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user',
    });
  }
});

// Login
router.post('/login', validateLogin, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhoto: user.profilePhoto,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user',
    });
  }
});

export default router;
