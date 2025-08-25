const User = require('../models/User');
const { sendOTP: sendOTPEmail } = require('../utils/email');
const { logUserAction } = require('../utils/logger.service');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, aadhaarNumber, password, phone, dateOfBirth, address } = req.body;

    const user = await User.create({
      name,
      email,
      aadhaarNumber,
      password,
      phone,
      dateOfBirth,
      address
    });

    await logUserAction(user._id, 'register', {
      resourceType: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          aadhaarNumber: user.aadhaarNumber,
          phone: user.phone,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await logUserAction(user._id, 'login', {
      resourceType: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          aadhaarNumber: user.aadhaarNumber,
          phone: user.phone,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Private
const sendOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail(user.email, user.name, otp);

    await logUserAction(user._id, 'otp_generated', {
      resourceType: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Private
const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    await logUserAction(user._id, 'otp_verified', {
      resourceType: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          aadhaarNumber: user.aadhaarNumber,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  // Implementation for forgot password
  res.status(200).json({
    success: true,
    message: 'Forgot password functionality will be implemented'
  });
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  // Implementation for reset password
  res.status(200).json({
    success: true,
    message: 'Reset password functionality will be implemented'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          aadhaarNumber: user.aadhaarNumber,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe
};