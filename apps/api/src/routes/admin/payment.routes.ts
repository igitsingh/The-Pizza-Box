import { Router } from 'express';
import { getAllTransactions, exportTransactions } from '../../controllers/admin/payment.controller';

import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', getAllTransactions);
router.get('/export', exportTransactions);

export default router;
