const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTags,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagController');
const { createTagValidation, updateTagValidation } = require('../validations/tagValidation');
const validate = require('../middleware/validate');

router.use(auth);
router.get('/', getTags);
router.post('/', createTagValidation, validate, createTag);
router.put('/:id', updateTagValidation, validate, updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
