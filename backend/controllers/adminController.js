const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });

    const projectGrowth = await Project.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const ticketStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalProjects,
      totalTickets,
      activeUsers,
      projectGrowth,
      ticketStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system telemetry (counts)
// @route   GET /api/admin/telemetry
// @access  Private (Admin)
const getTelemetry = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const projects = await Project.countDocuments();
    const tickets = await Ticket.countDocuments();

    res.json({
      users,
      projects,
      tickets
    });
  } catch (error) {
    console.error("Telemetry Error:", error);
    res.status(500).json({ message: "Telemetry fetch failed" });
  }
};

// @desc    Get all users for admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user (block/role)
const updateUserStatus = async (req, res) => {
  const { role, isBlocked } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = role || user.role;
      user.isBlocked = isBlocked !== undefined ? isBlocked : user.isBlocked;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update users (block/unblock)
// @route   POST /api/admin/users/bulk-update
const bulkUpdateUsers = async (req, res) => {
  const { ids, isBlocked } = req.body;
  try {
    await User.updateMany(
      { _id: { $in: ids }, role: { $ne: 'admin' } }, // Prevent blocking admins
      { $set: { isBlocked } }
    );
    res.json({ message: 'Users updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk delete users
// @route   POST /api/admin/users/bulk-delete
const bulkDeleteUsers = async (req, res) => {
  const { ids } = req.body;
  try {
    await User.deleteMany({ _id: { $in: ids }, role: { $ne: 'admin' } });
    res.json({ message: 'Users removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
      }
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('owner', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate('project', 'name').populate('assignee', 'name');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get advanced system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdvancedAnalytics = async (req, res) => {
  try {
    // 1. Busiest Users (Most tickets assigned)
    const busiestUsers = await Ticket.aggregate([
      { $match: { assignee: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$assignee",
          ticketCount: { $sum: 1 }
        }
      },
      { $sort: { ticketCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          name: "$userDetails.name",
          ticketCount: 1
        }
      }
    ]);

    // 2. Tickets Per Project
    const projectStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$project",
          ticketCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectDetails"
        }
      },
      { $unwind: "$projectDetails" },
      {
        $project: {
          name: "$projectDetails.name",
          ticketCount: 1
        }
      }
    ]);

    // 3. Ticket Status Distribution (Advanced)
    const statusDistribution = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Time based trends (Creation over time - last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const trends = await Ticket.aggregate([
      { $match: { createdAt: { $gt: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          created: { $sum: 1 },
          resolved: {
            $sum: { $cond: [ { $eq: ["$status", "Done"] }, 1, 0 ] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 5. Avg Resolution Time (ms to hours)
    const resolvedTickets = await Ticket.find({ status: 'Done', resolvedAt: { $exists: true } });
    let totalResolutionTime = 0;
    resolvedTickets.forEach(t => {
      const diff = t.resolvedAt - t.createdAt;
      totalResolutionTime += diff;
    });
    
    const avgResolutionTime = resolvedTickets.length > 0 
      ? (totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60)).toFixed(2) 
      : 0;

    res.json({
      busiestUsers,
      projectStats,
      statusDistribution,
      trends,
      avgResolutionTime,
      totalIssues: await Ticket.countDocuments(),
      completionRate: await Ticket.countDocuments() > 0 
        ? ((await Ticket.countDocuments({ status: 'Done' }) / await Ticket.countDocuments()) * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  bulkUpdateUsers,
  bulkDeleteUsers,
  deleteUser,
  getAllProjects,
  getAllTickets,
  getAdvancedAnalytics,
  getTelemetry
};
