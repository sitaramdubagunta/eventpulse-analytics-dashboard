const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/weekly-active-users', analyticsController.getWeeklyActiveUsers);
router.get('/events', analyticsController.getEventFrequency);
router.get('/devices', analyticsController.getDeviceUsage);
router.get('/session-duration', analyticsController.getSessionDuration);

module.exports = router;
