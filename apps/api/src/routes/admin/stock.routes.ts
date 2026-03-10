import { Router } from 'express';
import { updateItemStock, getLowStockItems } from '../../controllers/admin/stock.controller';

import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.put('/items/:id', updateItemStock);
router.get('/low-stock', getLowStockItems);

export default router;
