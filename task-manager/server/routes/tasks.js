const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} = require('../controllers/taskController');
const {
  createTaskValidation,
  updateTaskValidation,
} = require('../validations/taskValidation');
const validate = require('../middleware/validate');

router.use(auth);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTaskValidation, validate, createTask);
router.put('/:id', updateTaskValidation, validate, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;
