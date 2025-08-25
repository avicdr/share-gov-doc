const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'login',
      'logout', 
      'register',
      'upload_document',
      'update_document',
      'delete_document',
      'share_document',
      'view_document',
      'download_document',
      'profile_update',
      'otp_generated',
      'otp_verified'
    ]
  },
  resourceType: {
    type: String,
    enum: ['user', 'document', 'auth']
  },
  resourceId: {
    type: mongoose.Schema.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster log queries
LogSchema.index({ userId: 1, timestamp: -1 });
LogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('Log', LogSchema);