import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies) {
        token = req.cookies.admin_token;
    }

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authenticateToken = authenticate;

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies) {
        token = req.cookies.admin_token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyToken(token);
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        // Continue even if token is invalid, but don't set user
        next();
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    next();
};

export const optionalAuth = optionalAuthenticate;
