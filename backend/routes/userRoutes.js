const express = require('express');
const { 
  getUsers, 
  updateUserRole, 
  deleteUser, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected profile update route
router.put('/profile', protect, updateUserProfile);

// Admin-only routes
router.get('/', protect, adminMiddleware, getUsers);
router.put('/:id/role', protect, adminMiddleware, updateUserRole);
router.delete('/:id', protect, adminMiddleware, deleteUser);

module.exports = router;
