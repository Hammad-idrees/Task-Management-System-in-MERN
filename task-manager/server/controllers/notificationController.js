const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('task')
      .sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { read: true },
      { new: true },
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ notification });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true },
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Trying to delete notification:', id, 'for user:', req.user.id);

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!notification) {
      console.log('Notification not found or user mismatch');
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Error deleting all notifications' });
  }
};
