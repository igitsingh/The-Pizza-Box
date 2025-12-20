const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
exports.createRazorpayOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide orderId'
            });
        }

        // Get order
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Check if order is already paid
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Order is already paid'
            });
        }

        // Check if payment method is razorpay
        if (order.paymentProvider !== 'razorpay') {
            return res.status(400).json({
                success: false,
                error: 'This order is not for online payment'
            });
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.grandTotal * 100), // Amount in paise
            currency: 'INR',
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                userId: req.user._id.toString()
            }
        });

        // Save Razorpay order ID
        order.paymentReferenceId = razorpayOrder.id;
        await order.save();

        res.json({
            success: true,
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: order._id
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        next(error);
    }
};

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                error: 'Missing payment verification parameters'
            });
        }

        // Get order
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Verify signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            // Payment verification failed
            order.paymentStatus = 'failed';
            order.addTimelineEntry('payment_failed', 'Payment verification failed');
            await order.save();

            return res.status(400).json({
                success: false,
                error: 'Payment verification failed'
            });
        }

        // Payment verified successfully
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;

        // Update order status if it's still in created state
        if (order.orderStatus === 'created') {
            order.orderStatus = 'accepted';
            order.addTimelineEntry('accepted', 'Payment received and order accepted');
        } else {
            order.addTimelineEntry('payment_completed', 'Payment completed successfully');
        }

        await order.save();

        // TODO: Send push notification to user
        // TODO: Notify admin/kitchen about new paid order

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        next(error);
    }
};

/**
 * @desc    Handle payment failure
 * @route   POST /api/payments/failure
 * @access  Private
 */
exports.handlePaymentFailure = async (req, res, next) => {
    try {
        const { orderId, error } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide orderId'
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        order.paymentStatus = 'failed';
        order.addTimelineEntry('payment_failed', error || 'Payment failed');
        await order.save();

        res.json({
            success: true,
            message: 'Payment failure recorded',
            data: {
                orderId: order._id,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get payment status
 * @route   GET /api/payments/status/:orderId
 * @access  Private
 */
exports.getPaymentStatus = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.user._id
        }).select('paymentStatus paymentProvider razorpayPaymentId grandTotal');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: {
                orderId: order._id,
                paymentStatus: order.paymentStatus,
                paymentProvider: order.paymentProvider,
                razorpayPaymentId: order.razorpayPaymentId,
                amount: order.grandTotal
            }
        });
    } catch (error) {
        next(error);
    }
};
