const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

// @desc    Global search across projects and tickets
// @route   GET /api/search
// @access  Private
const globalSearch = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json({ projects: [], tickets: [] });
  }

  try {
    const searchRegex = new RegExp(q, 'i');

    // Search Projects
    // Note: Project ownership/membership should be respected
    const projects = await Project.find({
      $and: [
        {
          $or: [
            { owner: req.user._id },
            { members: req.user._id }
          ]
        },
        {
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        }
      ]
    }).limit(5);

    // Search Tickets
    // Note: Tickets belong to projects the user is part of. 
    // We first find projects the user belongs to.
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).select('_id');
    
    const projectIds = userProjects.map(p => p._id);

    const tickets = await Ticket.find({
      project: { $in: projectIds },
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    })
    .populate('project', 'name')
    .limit(10);

    res.json({ projects, tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { globalSearch };
