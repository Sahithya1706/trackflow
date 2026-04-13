const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['project_invite', 'general'],
    default: 'general',
  },
  message: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
