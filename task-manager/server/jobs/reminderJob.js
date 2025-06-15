const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

module.exports = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tasksDueSoon = await Task.find({
      dueDate: { $lte: tomorrow, $gte: new Date() },
      completed: false,
    }).populate('user');

    for (const task of tasksDueSoon) {
      // Check if notification already sent
      const exists = await Notification.findOne({
        task: task._id,
        type: 'due_soon',
        user: task.user._id,
      });
      if (!exists) {
        // Create notification record
        await Notification.create({
          user: task.user._id,
          task: task._id,
          type: 'due_soon',
        });
        // Send email
        const subject = `Task due soon: ${task.title}`;
        const html = `<p>Dear user,</p><p>Your task "${task.title}" is due on ${task.dueDate.toDateString()}.</p>`;
        await sendEmail(task.user.email, subject, html);
      }
    }
  } catch (err) {
    console.error('Error in reminderJob:', err);
  }
};
