import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: JWT_SECRET environment variable is not set in production!');
    }
    console.warn('WARNING: JWT_SECRET is not set, using default development key.');
}

const SECRET = JWT_SECRET || 'supersecretkey';

export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET);
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
