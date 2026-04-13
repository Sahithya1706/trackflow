const Comment = require('../models/Comment');

// @desc    Add comment to ticket
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  const { text, ticketId } = req.body;

  try {
    const comment = await Comment.create({
      text,
      ticketId,
      user: req.user._id
    });

    // Populate user details for immediate frontend use
    const populatedComment = await Comment.findById(comment._id).populate('user', 'name');

    // Emit real-time updates
    req.io.emit('commentAdded', populatedComment);
    req.io.emit('notification', {
      message: `New comment from ${populatedComment.user?.name}`,
      type: 'COMMENT_ADDED'
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a ticket
// @route   GET /api/comments/:ticketId
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId })
      .populate('user', 'name')
      .sort('createdAt');
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments };
