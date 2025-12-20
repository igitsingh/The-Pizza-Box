const NotificationToken = require('../models/NotificationToken');

/**
 * @desc    Register device token for push notifications
 * @route   POST /api/notifications/register-token
 * @access  Private
 */
exports.registerToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Please provide device token'
            });
        }

        // Check if token already exists for this user
        let notificationToken = await NotificationToken.findOne({
            userId: req.user._id,
            token
        });

        if (notificationToken) {
            return res.json({
                success: true,
                message: 'Token already registered',
                data: notificationToken
            });
        }

        // Create new token
        notificationToken = await NotificationToken.create({
            userId: req.user._id,
            token,
            platform: 'android'
        });

        res.status(201).json({
            success: true,
            message: 'Device token registered successfully',
            data: notificationToken
        });
    } catch (error) {
        // Handle duplicate token error
        if (error.code === 11000) {
            return res.json({
                success: true,
                message: 'Token already registered'
            });
        }
        next(error);
    }
};

/**
 * @desc    Unregister device token
 * @route   DELETE /api/notifications/unregister-token
 * @access  Private
 */
exports.unregisterToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Please provide device token'
            });
        }

        await NotificationToken.deleteOne({
            userId: req.user._id,
            token
        });

        res.json({
            success: true,
            message: 'Device token unregistered'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all registered tokens for current user
 * @route   GET /api/notifications/tokens
 * @access  Private
 */
exports.getMyTokens = async (req, res, next) => {
    try {
        const tokens = await NotificationToken.find({ userId: req.user._id });

        res.json({
            success: true,
            count: tokens.length,
            data: tokens
        });
    } catch (error) {
        next(error);
    }
};
