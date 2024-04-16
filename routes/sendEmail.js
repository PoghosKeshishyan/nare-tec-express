const express = require('express');
const router = express.Router();
const { sendEmail, paymentConfirm } = require('../controllers/sendEmail'); 

router.post('/coupon', sendEmail);
router.post('/payment-confirm', paymentConfirm);

module.exports = router;
