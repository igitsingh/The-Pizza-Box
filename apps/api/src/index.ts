import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

import { initSocket, getIO } from './socket';

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import adminAuthRoutes from './routes/admin/auth.routes';
import adminMenuRoutes from './routes/admin/menu.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminOrderRoutes from './routes/admin/order.routes';
import adminCouponRoutes from './routes/admin/coupon.routes';
import adminUserRoutes from './routes/admin/user.routes';
import adminSettingsRoutes from './routes/admin/settings.routes';
import locationRoutes from './routes/location.routes';
import paymentRoutes from './routes/payment.routes';
import settingsRoutes from './routes/settings.routes';
import couponRoutes from './routes/coupon.routes';
import feedbackRoutes from './routes/feedback.routes';
import adminFeedbackRoutes from './routes/admin/feedback.routes';
import enquiryRoutes from './routes/enquiry.routes';
import adminEnquiryRoutes from './routes/admin/enquiry.routes';
import referralRoutes from './routes/referral.routes';
import membershipRoutes from './routes/membership.routes';
import otpRoutes from './routes/otp.routes';
import adminReferralRoutes from './routes/admin/referral.routes';
import adminMembershipRoutes from './routes/admin/membership.routes';
import complaintRoutes from './routes/complaint.routes';

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        // @ts-ignore
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            // @ts-ignore
            req.rawBody = buf.toString();
        }
    }
}));
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow any origin
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

import adminDeliveryPartnerRoutes from './routes/admin/delivery-partner.routes';
import adminAnalyticsRoutes from './routes/admin/analytics.routes';
import adminStockRoutes from './routes/admin/stock.routes';
import adminPaymentRoutes from './routes/admin/payment.routes';
import adminComplaintRoutes from './routes/admin/complaint.routes';
import adminReportsRoutes from './routes/admin/reports.routes';
import adminLocationRoutes from './routes/admin/location.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin/delivery-partners', adminDeliveryPartnerRoutes);
app.use('/api/admin/metrics', adminAnalyticsRoutes);
app.use('/api/admin/stock', adminStockRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
app.use('/api/admin/feedbacks', adminFeedbackRoutes);
app.use('/api/admin/enquiries', adminEnquiryRoutes);
app.use('/api/admin/reports', adminReportsRoutes);
app.use('/api/admin/referrals', adminReferralRoutes);
app.use('/api/admin/memberships', adminMembershipRoutes);
app.use('/api/admin/locations', adminLocationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/complaints', complaintRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to The Pizza Box API' });
});

import { setupOrderSockets } from './sockets/order.socket';

// Socket.io connection
setupOrderSockets(io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Ready at http://localhost:${PORT}`);
});


