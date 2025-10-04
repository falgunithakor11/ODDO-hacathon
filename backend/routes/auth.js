const express = require('express');
const { adminSignup, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/admin-signup', adminSignup);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;