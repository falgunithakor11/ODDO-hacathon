const Expense = require('../models/Expense');

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const { description, category, amount, currency, receipt } = req.body;

    const expense = new Expense({
      employee: req.user.id,
      description,
      category,
      amount,
      currency,
      receipt,
      status: 'draft'
    });

    await expense.save();
    await expense.populate('employee', 'name email');

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error creating expense', error: error.message });
  }
};

// Submit expense for approval
exports.submitExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to submit this expense' });
    }

    expense.status = 'pending';
    await expense.save();
    await expense.populate('employee', 'name email');

    res.json({
      message: 'Expense submitted for approval',
      expense
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error submitting expense', error: error.message });
  }
};

// Get expenses for user
exports.getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ employee: req.user.id })
      .populate('employee', 'name email')
      .populate('approvers.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ expenses });

  } catch (error) {
    res.status(500).json({ message: 'Server error fetching expenses', error: error.message });
  }
};

// Get expenses for approval (Manager/Admin)
exports.getExpensesForApproval = async (req, res) => {
  try {
    const expenses = await Expense.find({ status: 'pending' })
      .populate('employee', 'name email')
      .populate('approvers.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ expenses });

  } catch (error) {
    res.status(500).json({ message: 'Server error fetching expenses for approval', error: error.message });
  }
};

// Approve/Reject expense
exports.reviewExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update approver status
    const approverIndex = expense.approvers.findIndex(
      approver => approver.user.toString() === req.user.id
    );

    if (approverIndex !== -1) {
      expense.approvers[approverIndex].status = status;
      expense.approvers[approverIndex].comments = comments;
      expense.approvers[approverIndex].timestamp = new Date();
    }

    // Check if all approvers have approved (simplified logic)
    const allApproved = expense.approvers.every(approver => approver.status === 'approved');
    if (allApproved) {
      expense.status = 'approved';
    } else if (status === 'rejected') {
      expense.status = 'rejected';
    }

    await expense.save();
    await expense.populate('employee', 'name email')
                 .populate('approvers.user', 'name email');

    res.json({
      message: `Expense ${status} successfully`,
      expense
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error reviewing expense', error: error.message });
  }
};
