const express = require('express');
const { getActivityLogs, getAllActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllActivities);
router.get('/:projectId', getActivityLogs);

module.exports = router;
