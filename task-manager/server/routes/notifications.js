const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  markNotificationRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require('../controllers/notificationController');

router.use(auth);
router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

module.exports = router;
