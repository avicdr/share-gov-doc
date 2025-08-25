const express = require('express');
const {
  getLogs,
  getUserLogs,
  getLogStats
} = require('../controllers/logs');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getLogs);

router.route('/stats')
  .get(authorize('admin'), getLogStats);

router.route('/user/:userId')
  .get(getUserLogs);

module.exports = router;