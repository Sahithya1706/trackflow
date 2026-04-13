const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const { createLog } = require('./activityController');

// @desc    Get tickets for a project
const getTickets = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tickets = await Ticket.find({ project: projectId })
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketsGlobal = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'admin') {
      tickets = await Ticket.find({}).populate('project', 'name').populate('assignee', 'name');
    } else {
      tickets = await Ticket.find({
        $or: [{ reporter: req.user._id }, { assignee: req.user._id }],
      }).populate('project', 'name').populate('assignee', 'name');
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .populate('project', 'name');
    if (ticket) res.json(ticket);
    else res.status(404).json({ message: 'Ticket not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  const { title, description, priority, status, assignee } = req.body;
  const { projectId } = req.params;
  try {
    const ticket = new Ticket({
      title, description, priority: priority || 'Medium', status: status || 'To Do',
      assignee: assignee || null, project: projectId, reporter: req.user._id,
    });
    const createdTicket = await ticket.save();
    req.io.to(projectId).emit('ticketCreated', createdTicket);
    await createLog({ 
      user: req.user._id, 
      action: 'created_ticket', 
      project: projectId, 
      message: `New ticket '${createdTicket.title}' created`,
      metadata: { ticketId: createdTicket._id }
    });
    if (assignee && assignee !== req.user._id.toString()) {
      await createLog({
        user: assignee,
        action: 'assigned_ticket',
        project: projectId,
        message: `You were assigned ticket: ${createdTicket.title}`,
        metadata: { ticketId: createdTicket._id }
      });
    }
    req.io.to(projectId).emit('notification', { message: `New ticket created: ${createdTicket.title}`, type: 'TICKET_CREATED' });
    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  const { title, description, priority, status, assignee } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      const prevStatus = ticket.status;
      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
      ticket.priority = priority || ticket.priority;
      ticket.status = status || ticket.status;
      ticket.assignee = assignee || ticket.assignee;
      ticket.attachments = req.body.attachments || ticket.attachments;
      const updatedTicket = await ticket.save();
      req.io.to(ticket.project.toString()).emit('ticketUpdated', updatedTicket);
      if (status && status !== prevStatus) {
        let action = 'moved_ticket';
        let message = `Ticket #${ticket._id.toString().slice(-4)} moved to ${status}`;
        if (status === 'Done') {
          action = 'resolved_ticket';
          message = `Bug #${ticket._id.toString().slice(-4)} marked as resolved`;
        }

        await createLog({ 
          user: req.user._id, 
          action, 
          project: ticket.project, 
          message,
          metadata: { ticketId: ticket._id }
        });
        req.io.to(ticket.project.toString()).emit('notification', { message: `Ticket "${ticket.title}" moved to ${status}`, type: 'STATUS_CHANGED' });
      }
      res.json(updatedTicket);
    } else res.status(404).json({ message: 'Ticket not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Bulk update tickets
// @route   POST /api/tickets/bulk-update
const bulkUpdateTickets = async (req, res) => {
  const { ids, status } = req.body;
  try {
    await Ticket.updateMany({ _id: { $in: ids } }, { $set: { status } });
    // Emit updates for each ticket (or a general bulkUpdate event)
    req.io.emit('bulkTicketsUpdated', { ids, status });
    res.json({ message: 'Tickets updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk delete tickets
// @route   POST /api/tickets/bulk-delete
const bulkDeleteTickets = async (req, res) => {
  const { ids } = req.body;
  try {
    await Ticket.deleteMany({ _id: { $in: ids } });
    req.io.emit('bulkTicketsDeleted', { ids });
    res.json({ message: 'Tickets removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      await Ticket.deleteOne({ _id: req.params.id });
      res.json({ message: 'Ticket removed' });
    } else res.status(404).json({ message: 'Ticket not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    const comment = await Comment.create({ text, user: req.user._id, ticketId: req.params.id });
    const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCommentsByTicket = async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.id }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTickets, getTicketsGlobal, getTicketById, createTicket, updateTicket, 
  deleteTicket, bulkUpdateTickets, bulkDeleteTickets, addComment, getCommentsByTicket,
};
