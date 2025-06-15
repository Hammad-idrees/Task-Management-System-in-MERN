const cron = require('node-cron');
const reminderJob = require('../jobs/reminderJob');
// Schedule jobs here or export a function to start them

exports.startJobs = () => {
  // Run reminder job every day at 8 AM
  cron.schedule('0 8 * * *', () => {
    reminderJob();
  });
};
