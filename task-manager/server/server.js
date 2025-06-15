require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const corsConfig = require('./middleware/corsConfig');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const tagRoutes = require('./routes/tags');
const exportRoutes = require('./routes/export');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

const app = express();

// Connect Database
connectDB().then(() => {
  // ✅ Only start scheduler AFTER DB is connected
  require('./schedulers/notificationScheduler');

  // Middleware
  app.use(helmet());
  app.use(express.json());
  app.use(corsConfig);
  app.use(morgan('dev'));

  // Rate limiter
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      message: 'Too many requests from this IP, please try again later.',
    },
  });
  app.use('/api/auth', authLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/tags', tagRoutes);
  app.use('/api/export', exportRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/users', userRoutes);

  app.get('/api/ping', (req, res) => res.json({ msg: 'pong' }));

  // 404 & error handlers
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
