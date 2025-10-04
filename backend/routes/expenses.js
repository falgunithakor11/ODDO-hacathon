const express = require('express');
const { createExpense, submitExpense, getUserExpenses, getExpensesForApproval, reviewExpense } = require('../controllers/expenseController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.use(auth); // All routes require authentication

router.post('/', upload.single('receipt'), createExpense);
router.get('/my-expenses', getUserExpenses);
router.get('/for-approval', authorize('admin', 'manager'), getExpensesForApproval);
router.put('/:id/submit', submitExpense);
router.put('/:id/review', authorize('admin', 'manager'), reviewExpense);

module.exports = router;