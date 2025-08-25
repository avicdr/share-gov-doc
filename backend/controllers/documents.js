const Document = require('../models/Document');
const User = require('../models/User');
const { logUserAction } = require('../utils/logger.service');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

// @desc    Get all documents for user
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10, documentType, search } = req.query;
    
    const query = { owner: req.user.id };
    
    if (documentType) {
      query.documentType = documentType;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const documents = await Document.find(query)
      .populate('owner', 'name email aadhaarNumber')
      .populate('sharedWith.user', 'name email aadhaarNumber')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      count: documents.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: documents
    });
  } catch (error) {
    logger.error(`Get documents error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'name email aadhaarNumber')
      .populate('sharedWith.user', 'name email aadhaarNumber');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user owns the document or has access to it
    const hasAccess = document.owner._id.toString() === req.user.id || 
      document.sharedWith.some(share => share.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    await logUserAction(req.user.id, 'view_document', {
      resourceType: 'document',
      resourceId: document._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    logger.error(`Get document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, description, documentType, metadata } = req.body;

    const document = await Document.create({
      title,
      description,
      documentType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      owner: req.user.id,
      metadata: metadata ? JSON.parse(metadata) : {}
    });

    await logUserAction(req.user.id, 'upload_document', {
      resourceType: 'document',
      resourceId: document._id,
      details: { fileName: req.file.originalname, fileSize: req.file.size },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    logger.error(`Upload document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check ownership
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this document'
      });
    }

    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await logUserAction(req.user.id, 'update_document', {
      resourceType: 'document',
      resourceId: document._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    logger.error(`Update document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check ownership
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    await logUserAction(req.user.id, 'delete_document', {
      resourceType: 'document',
      resourceId: document._id,
      details: { fileName: document.fileName },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error(`Delete document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Share document with user
// @route   POST /api/documents/:id/share
// @access  Private
const shareDocument = async (req, res) => {
  try {
    const { aadhaarNumber, permissions = ['view'] } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check ownership
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to share this document'
      });
    }

    // Find user by Aadhaar number
    const targetUser = await User.findOne({ aadhaarNumber });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this Aadhaar number'
      });
    }

    // Check if already shared
    const existingShare = document.sharedWith.find(
      share => share.user.toString() === targetUser._id.toString()
    );

    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: 'Document already shared with this user'
      });
    }

    // Add to shared list
    document.sharedWith.push({
      user: targetUser._id,
      permissions,
      sharedBy: req.user.id
    });

    await document.save();

    await logUserAction(req.user.id, 'share_document', {
      resourceType: 'document',
      resourceId: document._id,
      details: { sharedWith: targetUser.aadhaarNumber },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Document shared successfully',
      data: document
    });
  } catch (error) {
    logger.error(`Share document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get shared documents
// @route   GET /api/documents/shared
// @access  Private
const getSharedDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      'sharedWith.user': req.user.id
    })
    .populate('owner', 'name email aadhaarNumber')
    .populate('sharedWith.user', 'name email aadhaarNumber')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    logger.error(`Get shared documents error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check access
    const hasAccess = document.owner.toString() === req.user.id || 
      document.sharedWith.some(share => 
        share.user.toString() === req.user.id && 
        share.permissions.includes('download')
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this document'
      });
    }

    await logUserAction(req.user.id, 'download_document', {
      resourceType: 'document',
      resourceId: document._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.download(document.filePath, document.fileName);
  } catch (error) {
    logger.error(`Download document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
  getSharedDocuments,
  downloadDocument
};