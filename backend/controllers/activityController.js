const Activity = require('../models/Activity');

// @desc    Get activity logs for a project
// @route   GET /api/activity/:projectId
// @access  Private
const getActivityLogs = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all activities for the logged in user
// @route   GET /api/activity
// @access  Private
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Internal utility function for logging (reusable across controllers)
const createLog = async ({ user, action, project, message, metadata }) => {
  try {
    await Activity.create({ user, action, project, message, metadata });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};

module.exports = { getActivityLogs, getAllActivities, createLog };
