const Log = require('../models/Log');
const logger = require('./logger');

const logUserAction = async (userId, action, details = {}) => {
  try {
    const logEntry = new Log({
      userId,
      action,
      resourceType: details.resourceType || 'user',
      resourceId: details.resourceId,
      details: details.details || {},
      ipAddress: details.ipAddress,
      userAgent: details.userAgent
    });

    await logEntry.save();
    logger.info(`User action logged: ${action} by user ${userId}`);
  } catch (error) {
    logger.error(`Failed to log user action: ${error.message}`);
  }
};

module.exports = { logUserAction };