const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    dueDate: {
      type: Date
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Task', TaskSchema);