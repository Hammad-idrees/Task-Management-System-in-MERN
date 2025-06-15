const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
} = require('../validations/authValidation');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', auth, getProfile);

module.exports = router;
