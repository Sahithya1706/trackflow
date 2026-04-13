const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', addComment);
router.get('/:ticketId', getComments);

module.exports = router;
