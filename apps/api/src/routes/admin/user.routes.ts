import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, getStaff } from '../../controllers/admin/user.controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken, authorizeAdmin);

router.get('/staff', getStaff);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
