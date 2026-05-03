const express = require('express');
const { body } = require('express-validator');
const { getBudgets, upsertBudget, deleteBudget } = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getBudgets);

router.post(
  '/',
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('monthlyLimit').isFloat({ min: 1 }).withMessage('Monthly limit must be at least 1'),
  ],
  upsertBudget
);

router.delete('/:id', deleteBudget);

module.exports = router;
