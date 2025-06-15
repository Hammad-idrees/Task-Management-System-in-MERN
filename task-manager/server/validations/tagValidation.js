const { body } = require('express-validator');

exports.createTagValidation = [
  body('name').notEmpty().withMessage('Tag name is required')
];

exports.updateTagValidation = [
  body('name').optional().notEmpty().withMessage('Tag name cannot be empty')
];
