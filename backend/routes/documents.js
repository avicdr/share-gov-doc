const express = require('express');
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
  getSharedDocuments,
  downloadDocument
} = require('../controllers/documents');
const { protect, requireVerification } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();

router.use(protect);
router.use(requireVerification);

router.route('/')
  .get(getDocuments)
  .post(upload.single('document'), uploadDocument);

router.route('/shared')
  .get(getSharedDocuments);

router.route('/:id')
  .get(getDocument)
  .put(updateDocument)
  .delete(deleteDocument);

router.route('/:id/share')
  .post(shareDocument);

router.route('/:id/download')
  .get(downloadDocument);

module.exports = router;