const express = require('express');
const { createApprovalRule, getApprovalRules, updateApprovalRule, deleteApprovalRule } = require('../controllers/approvalRuleController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth); // All routes require authentication
router.use(authorize('admin')); // Only admin can manage approval rules

router.post('/', createApprovalRule);
router.get('/', getApprovalRules);
router.put('/:id', updateApprovalRule);
router.delete('/:id', deleteApprovalRule);

module.exports = router;