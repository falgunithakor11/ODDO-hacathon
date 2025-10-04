const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth); // All routes require authentication

router.post('/', authorize('admin', 'manager'), createUser);
router.get('/', getUsers);
router.put('/:id', authorize('admin', 'manager'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;