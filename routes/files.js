const express = require('express');
const router = express.Router();
const { all, add } = require('../controllers/files');

router.get('/', all);
router.post('/add/file', add);

module.exports = router;
