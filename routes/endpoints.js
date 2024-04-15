const express = require('express');
const router = express.Router();
const { endpoints } = require('../controllers/endpoints');

router.get('/', endpoints);

module.exports = router;
