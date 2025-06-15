const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// ⏰ Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

    // Check for overdue tasks
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      completed: false,
    });

    // Check for tasks due in 24 hours
    const upcomingTasks = await Task.find({
      dueDate: { $gte: now, $lte: oneDayFromNow },
      completed: false,
    });

    // Process overdue tasks
    for (let task of overdueTasks) {
      const existing = await Notification.findOne({
        user: task.user,
        task: task._id,
        type: 'overdue',
      });

      if (!existing) {
        await Notification.create({
          user: task.user,
          task: task._id,
          type: 'overdue',
          message: `⚠️ Task "${task.title}" is overdue! It was due on ${task.dueDate.toLocaleDateString()}. Please complete it as soon as possible.`,
        });
        console.log(
          `[+] Overdue notification created for task "${task.title}"`,
        );
      }
    }

    // Process upcoming tasks (due in 24 hours)
    for (let task of upcomingTasks) {
      const existing = await Notification.findOne({
        user: task.user,
        task: task._id,
        type: 'due_soon',
      });

      if (!existing) {
        const hoursUntilDue = Math.round(
          (task.dueDate - now) / (1000 * 60 * 60),
        );
        await Notification.create({
          user: task.user,
          task: task._id,
          type: 'due_soon',
          message: `⏰ Task "${task.title}" is due in ${hoursUntilDue} hours (${task.dueDate.toLocaleDateString()}). Make sure to complete it on time!`,
        });
        console.log(
          `[+] Upcoming notification created for task "${task.title}"`,
        );
      }
    }

    console.log(`[✔] Notification job ran at ${now}`);
  } catch (err) {
    console.error('[❌] Error running notification job:', err);
  }
});
