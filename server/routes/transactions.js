const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(authenticateToken);

const txValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

router.get('/', getTransactions);
router.get('/export/csv', exportCSV);
router.post('/', txValidation, createTransaction);
router.put('/:id', txValidation, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
