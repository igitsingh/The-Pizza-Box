const admin = require('firebase-admin');

// Initialize Firebase Admin (will be initialized in server.js with credentials)
let firebaseInitialized = false;

const initializeFirebase = () => {
    if (firebaseInitialized) return;

    try {
        // Initialize with service account (in production, use actual credentials)
        if (process.env.FCM_PROJECT_ID) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FCM_PROJECT_ID,
                    clientEmail: process.env.FCM_CLIENT_EMAIL,
                    privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n')
                })
            });
            firebaseInitialized = true;
            console.log('✅ Firebase Admin initialized');
        } else {
            console.log('⚠️  Firebase credentials not configured');
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
    }
};

/**
 * Send push notification to a user
 * @param {string} userId - User ID
 * @param {object} notification - Notification data
 * @param {object} data - Additional data payload
 */
const sendNotificationToUser = async (userId, notification, data = {}) => {
    try {
        if (!firebaseInitialized) {
            console.log('Firebase not initialized, skipping notification');
            return null;
        }

        const NotificationToken = require('../models/NotificationToken');

        // Get user's device tokens
        const tokens = await NotificationToken.find({ userId }).select('token');

        if (!tokens || tokens.length === 0) {
            console.log(`No device tokens found for user ${userId}`);
            return null;
        }

        const deviceTokens = tokens.map(t => t.token);

        // Prepare message
        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.imageUrl || undefined
            },
            data: {
                ...data,
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
            },
            tokens: deviceTokens
        };

        // Send notification
        const response = await admin.messaging().sendMulticast(message);

        console.log(`✅ Sent ${response.successCount} notifications to user ${userId}`);

        // Remove invalid tokens
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(deviceTokens[idx]);
                }
            });

            // Remove failed tokens from database
            await NotificationToken.deleteMany({
                userId,
                token: { $in: failedTokens }
            });

            console.log(`🗑️  Removed ${failedTokens.length} invalid tokens`);
        }

        return response;
    } catch (error) {
        console.error('Push notification error:', error);
        return null;
    }
};

/**
 * Send order status notification
 * @param {string} userId - User ID
 * @param {object} order - Order object
 * @param {string} status - New status
 */
const sendOrderStatusNotification = async (userId, order, status) => {
    const statusMessages = {
        accepted: {
            title: '🎉 Order Confirmed!',
            body: `Your order #${order._id.toString().slice(-6)} has been confirmed and is being prepared.`
        },
        preparing: {
            title: '👨‍🍳 Preparing Your Order',
            body: `Your delicious pizza is being prepared with love!`
        },
        out_for_delivery: {
            title: '🛵 Out for Delivery',
            body: `Your order is on its way! It will arrive soon.`
        },
        delivered: {
            title: '✅ Order Delivered',
            body: `Your order has been delivered. Enjoy your meal!`
        },
        cancelled: {
            title: '❌ Order Cancelled',
            body: `Your order #${order._id.toString().slice(-6)} has been cancelled.`
        }
    };

    const notification = statusMessages[status] || {
        title: 'Order Update',
        body: `Your order status has been updated to ${status}`
    };

    const data = {
        type: 'order_status',
        orderId: order._id.toString(),
        status: status
    };

    return await sendNotificationToUser(userId, notification, data);
};

/**
 * Send payment success notification
 * @param {string} userId - User ID
 * @param {object} order - Order object
 */
const sendPaymentSuccessNotification = async (userId, order) => {
    const notification = {
        title: '💳 Payment Successful',
        body: `Payment of ₹${order.grandTotal} received. Your order is confirmed!`
    };

    const data = {
        type: 'payment_success',
        orderId: order._id.toString()
    };

    return await sendNotificationToUser(userId, notification, data);
};

module.exports = {
    initializeFirebase,
    sendNotificationToUser,
    sendOrderStatusNotification,
    sendPaymentSuccessNotification
};
