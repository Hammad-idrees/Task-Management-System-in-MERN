const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile } = require('../controllers/userController');
const { updateProfileValidation } = require('../validations/userValidation');
const validate = require('../middleware/validate');

router.use(auth);
router.put('/profile', updateProfileValidation, validate, updateProfile);

module.exports = router;
