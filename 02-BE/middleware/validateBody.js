import { body, validationResult } from 'express-validator';


export const validateAuth = [
  body('email')
    .notEmpty()
    .isEmail()
    .withMessage('Email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date (YYYY-MM-DD)'),

  body('completed')
    .notEmpty()
    .withMessage('Completed status is required')
    .isBoolean()
    .withMessage('Completed must be true or false'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];