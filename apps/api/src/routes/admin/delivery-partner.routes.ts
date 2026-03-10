import { Router } from 'express';
import { getAllPartners, createPartner, updatePartner, updatePartnerStatus, deletePartner } from '../../controllers/admin/delivery-partner.controller';

import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', getAllPartners);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.put('/:id/status', updatePartnerStatus);
router.delete('/:id', deletePartner);

export default router;
