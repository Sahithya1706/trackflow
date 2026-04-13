const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a ticket title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a ticket description'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  assignee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
  },
  reporter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  attachments: [
    {
      type: String, // Store image URLs
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    required: false,
  },
});

ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.isModified('status') && this.status === 'Done') {
    this.resolvedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
