import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Auth validation
export const validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('role').optional().isIn(['user', 'companion']),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Profile validation
export const validateProfileUpdate = [
  body('name').optional().trim().notEmpty(),
  body('age').optional().isInt({ min: 18, max: 100 }),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('bio').optional().isLength({ max: 500 }),
];

// Booking validation
export const validateBooking = [
  body('companion').isMongoId(),
  body('activity').notEmpty(),
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('duration').isFloat({ min: 0.5 }),
];

// Review validation
export const validateReview = [
  body('booking').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isLength({ max: 500 }),
];
