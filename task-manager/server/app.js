const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const Notification = require('./models/Notification');

// Clean up old notifications
async function cleanupOldNotifications() {
  try {
    // Delete notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    console.log('Old notifications cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
  }
}

// Run cleanup on startup
cleanupOldNotifications();

// Run cleanup every 24 hours
setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
