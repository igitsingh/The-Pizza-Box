const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus
} = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/failure', handlePaymentFailure);
router.get('/status/:orderId', getPaymentStatus);

module.exports = router;
