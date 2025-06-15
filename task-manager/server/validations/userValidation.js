const { body } = require('express-validator');

exports.updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Enter a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').optional().isString().withMessage('Name must be a string')
];