const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  bulkUpdateUsers,
  bulkDeleteUsers,
  deleteUser,
  getAllProjects,
  getAllTickets,
  getAdvancedAnalytics
} = require('../controllers/adminController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect);
router.use(adminMiddleware);

router.get('/stats', getAdminStats);
router.get('/analytics', getAdvancedAnalytics);
router.get('/users', getAllUsers);
router.put('/user/:id', updateUserStatus);
router.post('/users/bulk-update', bulkUpdateUsers);
router.post('/users/bulk-delete', bulkDeleteUsers);
router.delete('/user/:id', deleteUser);
router.get('/projects', getAllProjects);
router.get('/tickets', getAllTickets);

module.exports = router;
