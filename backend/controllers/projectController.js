const Project = require('../models/Project');
const { createLog } = require('./activityController');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // If Admin, show all. If others, show where they are owner or member
    let query = {};
    if (req.user.role !== 'admin') {
      // Correction: if user is member OR owner, show it.
      query = { $or: [{ owner: req.user._id }, { 'members.user': req.user._id }] };
    }

    const projects = await Project.find(query).populate('owner', 'name email').populate('members.user', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin / Manager)
const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: members || [],
    });

    const createdProject = await project.save();

    // Create Activity Log
    await createLog({
      user: req.user._id,
      action: 'created_project',
      project: createdProject._id,
      message: `New project '${createdProject.name}' created`,
      metadata: { projectId: createdProject._id }
    });

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin / Manager / Owner)
const updateProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Permission check - only owner or admin can update
      if (
        project.owner.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }

      project.name = name || project.name;
      project.description = description || project.description;
      project.members = members || project.members;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin / Owner)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (
        project.owner.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to delete this project' });
      }

      await Project.deleteOne({ _id: req.params.id });
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Invite user to project
// @route   POST /api/projects/:id/invite
// @access  Private (Owner/Admin)
const inviteToProject = async (req, res) => {
  const { email } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to invite users' });
    }

    const userToInvite = await User.findOne({ email });

    // Check if already in pending invites
    const existingInvite = project.pendingInvites?.find(inv => inv.email === email && inv.status === 'pending');
    if (existingInvite) {
      return res.status(400).json({ message: 'Invite already sent to this email' });
    }

    // Check if already a member
    if (userToInvite && project.members?.some(m => m.user.toString() === userToInvite._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add to pending invites
    project.pendingInvites.push({ email, status: 'pending' });
    await project.save();

    // Create notification if user exists
    if (userToInvite) {
      await Notification.create({
        user: userToInvite._id,
        type: 'project_invite',
        message: `You were invited to join ${project.name}`,
        project: project._id,
      });
      // Optionally emit socket event here if io is available
      if (req.io) {
        req.io.emit('notification', { message: `You were invited to join ${project.name}`, type: 'PROJECT_INVITE' });
      }
    }

    res.json({ message: 'Invite sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept invite
// @route   POST /api/projects/:id/accept
// @access  Private
const acceptInvite = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userEmail = req.user.email;
    const inviteIndex = project.pendingInvites?.findIndex(
      inv => inv.email === userEmail && inv.status === 'pending'
    );

    if (inviteIndex === -1 && project.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'No pending invite found' });
    }

    if (inviteIndex !== -1) {
      project.pendingInvites[inviteIndex].status = 'accepted';
      
      if (!project.members.some(m => m.user.toString() === req.user._id.toString())) {
        project.members.push({ user: req.user._id, role: 'member' });
      }
      
      await project.save();
    }

    // Update Notification status
    await Notification.findOneAndUpdate(
      { user: req.user._id, project: project._id, type: 'project_invite' },
      { status: 'read' }
    );

    res.json({ message: 'Invite accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject invite
// @route   POST /api/projects/:id/reject
// @access  Private
const rejectInvite = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userEmail = req.user.email;
    const inviteIndex = project.pendingInvites?.findIndex(
      inv => inv.email === userEmail && inv.status === 'pending'
    );

    if (inviteIndex !== -1) {
      project.pendingInvites[inviteIndex].status = 'rejected';
      await project.save();
    }

    // Update Notification status
    await Notification.findOneAndUpdate(
      { user: req.user._id, project: project._id, type: 'project_invite' },
      { status: 'read' }
    );

    res.json({ message: 'Invite rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteToProject,
  acceptInvite,
  rejectInvite,
};
