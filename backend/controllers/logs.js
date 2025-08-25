const Log = require('../models/Log');
const logger = require('../utils/logger');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
    
    const query = {};
    
    if (action) query.action = action;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query)
      .populate('userId', 'name email aadhaarNumber')
      .sort('-timestamp')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (error) {
    logger.error(`Get logs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user logs
// @route   GET /api/logs/user/:userId
// @access  Private
const getUserLogs = async (req, res) => {
  try {
    // Users can only view their own logs, admins can view any
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these logs'
      });
    }

    const logs = await Log.find({ userId: req.params.userId })
      .populate('userId', 'name email aadhaarNumber')
      .sort('-timestamp')
      .limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    logger.error(`Get user logs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get log statistics
// @route   GET /api/logs/stats
// @access  Private/Admin
const getLogStats = async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastOccurred: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalLogs = await Log.countDocuments();
    const totalUsers = await Log.distinct('userId').length;

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        totalUsers,
        actionStats: stats
      }
    });
  } catch (error) {
    logger.error(`Get log stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getLogs,
  getUserLogs,
  getLogStats
};