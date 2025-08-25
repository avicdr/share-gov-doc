const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/search')
  .get(searchUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;