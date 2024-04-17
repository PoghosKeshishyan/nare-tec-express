const express = require('express');
const router = express.Router();
const { coupon, paymentConfirm } = require('../controllers/sendEmail'); 

router.post('/coupon', coupon);
router.post('/payment-confirm', paymentConfirm);

module.exports = router;
