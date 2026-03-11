import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

dotenv.config();

import { initSocket } from './socket';
import { rateLimit } from 'express-rate-limit';

const app = express();

// --- RATE LIMITERS ---
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Limit each IP to 10 login attempts per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many login attempts, please try again after an hour' }
});

const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 OTP requests per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many OTP requests, please try again after an hour' }
});
const httpServer = createServer(app);
const io = initSocket(httpServer);

// Route Imports - Main
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import locationRoutes from './routes/location.routes';
import paymentRoutes from './routes/payment.routes';
import settingsRoutes from './routes/settings.routes';
import couponRoutes from './routes/coupon.routes';
import feedbackRoutes from './routes/feedback.routes';
import enquiryRoutes from './routes/enquiry.routes';
import referralRoutes from './routes/referral.routes';
import membershipRoutes from './routes/membership.routes';
import complaintRoutes from './routes/complaint.routes';
import adminRoutes from './routes/admin.routes';
import otpRoutes from './routes/otp.routes';

// Route Imports - Admin Modular
import { setupOrderSockets } from './sockets/order.socket';
import adminAuthRoutes from './routes/admin/auth.routes';
import adminMenuRoutes from './routes/admin/menu.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminOrderRoutes from './routes/admin/order.routes';
import adminKitchenRoutes from './routes/admin/kitchen.routes';
import adminCouponRoutes from './routes/admin/coupon.routes';
import adminUserRoutes from './routes/admin/user.routes';
import adminSettingsRoutes from './routes/admin/settings.routes';
import adminFeedbackRoutes from './routes/admin/feedback.routes';
import adminEnquiryRoutes from './routes/admin/enquiry.routes';
import adminReferralRoutes from './routes/admin/referral.routes';
import adminMembershipRoutes from './routes/admin/membership.routes';
import adminDeliveryPartnerRoutes from './routes/admin/delivery-partner.routes';
import adminAnalyticsRoutes from './routes/admin/analytics.routes';
import adminStockRoutes from './routes/admin/stock.routes';
import adminPaymentRoutes from './routes/admin/payment.routes';
import adminComplaintRoutes from './routes/admin/complaint.routes';
import adminReportsRoutes from './routes/admin/reports.routes';
import adminLocationRoutes from './routes/admin/location.routes';

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
const allowedOrigins = [
    'https://the-pizza-box-web.vercel.app',
    'https://the-pizza-box-admin.vercel.app',
    'http://localhost:3000', // Web Dev
    'http://localhost:3001', // Admin Dev
    'http://localhost:8081', // Mobile Bundler
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// --- API ROUTES ---
app.use('/api', generalLimiter);

// Auth & Core
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);

// Customer Facing
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/otp', otpLimiter, otpRoutes);

// Admin Modular (Secured)
app.use('/api/admin/auth', authLimiter, adminAuthRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/kitchen', adminKitchenRoutes);
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

// Legacy Admin Bridge
app.use('/api/admin', adminRoutes);

// Root
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to The Pizza Box API' });
});

// --- SOCKETS ---
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
