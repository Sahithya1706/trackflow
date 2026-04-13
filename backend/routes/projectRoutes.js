const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteToProject,
  acceptInvite,
  rejectInvite,
} = require('../controllers/projectController');
const { getTickets, createTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/invite', protect, inviteToProject);
router.post('/:id/accept', protect, acceptInvite);
router.post('/:id/reject', protect, rejectInvite);

// Tickets nested in projects
router
  .route('/:projectId/tickets')
  .get(protect, getTickets)
  .post(protect, createTicket);

module.exports = router;
