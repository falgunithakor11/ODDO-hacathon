const ApprovalRule = require('../models/approvalRule.js');

// Create approval rule
exports.createApprovalRule = async (req, res) => {
  try {
    const { name, description, manager, isManagerApprover, approvers, sequenceRequired, minApprovalPercentage } = req.body;

    const approvalRule = new ApprovalRule({
      company: req.user.company._id,
      name,
      description,
      manager,
      isManagerApprover,
      approvers,
      sequenceRequired,
      minApprovalPercentage
    });

    await approvalRule.save();
    await approvalRule.populate('manager', 'name email')
                     .populate('approvers', 'name email');

    res.status(201).json({
      message: 'Approval rule created successfully',
      approvalRule
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error creating approval rule', error: error.message });
  }
};

// Get all approval rules for company
exports.getApprovalRules = async (req, res) => {
  try {
    const approvalRules = await ApprovalRule.find({ company: req.user.company._id })
      .populate('manager', 'name email')
      .populate('approvers', 'name email')
      .sort({ createdAt: -1 });

    res.json({ approvalRules });

  } catch (error) {
    res.status(500).json({ message: 'Server error fetching approval rules', error: error.message });
  }
};

// Update approval rule
exports.updateApprovalRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const approvalRule = await ApprovalRule.findOneAndUpdate(
      { _id: id, company: req.user.company._id },
      updates,
      { new: true, runValidators: true }
    ).populate('manager', 'name email')
     .populate('approvers', 'name email');

    if (!approvalRule) {
      return res.status(404).json({ message: 'Approval rule not found' });
    }

    res.json({
      message: 'Approval rule updated successfully',
      approvalRule
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error updating approval rule', error: error.message });
  }
};

// Delete approval rule
exports.deleteApprovalRule = async (req, res) => {
  try {
    const { id } = req.params;

    const approvalRule = await ApprovalRule.findOneAndDelete({
      _id: id,
      company: req.user.company._id
    });

    if (!approvalRule) {
      return res.status(404).json({ message: 'Approval rule not found' });
    }

    res.json({ message: 'Approval rule deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error deleting approval rule', error: error.message });
  }
};