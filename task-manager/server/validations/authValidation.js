const { body } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').exists().withMessage('Password is required')
];