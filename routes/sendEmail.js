const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/sendEmail'); 

router.post('/', sendEmail);

module.exports = router;
