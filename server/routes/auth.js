const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Lowercase + trim only — deliberately NOT normalizeEmail(), whose defaults
// strip dots from Gmail addresses (a.b@gmail.com -> ab@gmail.com) and would
// store/display a different email than the user typed.
const sanitizeEmail = () =>
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .customSanitizer((v) => String(v).trim().toLowerCase());

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    sanitizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    sanitizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', authenticateToken, getMe);

module.exports = router;
