const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportTasksCSV, exportTasksPDF } = require('../controllers/exportController');

router.use(auth);
router.get('/csv', exportTasksCSV);
router.get('/pdf', exportTasksPDF);

module.exports = router;
