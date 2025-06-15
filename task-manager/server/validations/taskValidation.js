const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('dueDate must be a valid date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
];

exports.updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('dueDate must be a valid date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
];