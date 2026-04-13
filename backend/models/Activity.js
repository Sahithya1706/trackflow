const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  message: {
    type: String, // human readable text
  },
  metadata: {
    type: Object, // optional extra info
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', activitySchema);
