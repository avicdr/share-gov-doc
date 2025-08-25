const express = require('express');
const { 
  register, 
  login, 
  logout, 
  sendOTP, 
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', protect, sendOTP);
router.post('/verify-otp', protect, verifyOTP);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;