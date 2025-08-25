const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a document title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  documentType: {
    type: String,
    required: [true, 'Please specify document type'],
    enum: [
      'pan_card',
      'aadhaar_card', 
      'passport',
      'driving_license',
      'voter_id',
      'mark_sheet',
      'degree_certificate',
      'income_certificate',
      'caste_certificate',
      'birth_certificate',
      'other'
    ]
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    permissions: [{
      type: String,
      enum: ['view', 'download'],
      default: 'view'
    }],
    sharedAt: {
      type: Date,
      default: Date.now
    },
    sharedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  metadata: {
    documentNumber: String,
    issueDate: Date,
    expiryDate: Date,
    issuingAuthority: String
  }
}, {
  timestamps: true
});

// Index for faster searches
DocumentSchema.index({ owner: 1, documentType: 1 });
DocumentSchema.index({ 'sharedWith.user': 1 });

module.exports = mongoose.model('Document', DocumentSchema);