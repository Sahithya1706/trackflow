const express = require('express');
const {
  getTicketsGlobal,
  getTicketById,
  updateTicket,
  deleteTicket,
  bulkUpdateTickets,
  bulkDeleteTickets,
  addComment,
  getCommentsByTicket,
} = require('../controllers/ticketController');
const { protect, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getTicketsGlobal);
router.post('/bulk-update', protect, bulkUpdateTickets);
router.post('/bulk-delete', protect, adminMiddleware, bulkDeleteTickets);

router
  .route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

router
  .route('/:id/comments')
  .get(protect, getCommentsByTicket)
  .post(protect, addComment);

const upload = require('../middleware/uploadMiddleware');
const Ticket = require('../models/Ticket');

router.post('/:id/upload', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    ticket.screenshots.push(url);
    await ticket.save();

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
