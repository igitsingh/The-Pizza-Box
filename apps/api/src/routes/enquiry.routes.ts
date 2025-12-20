import { Router } from 'express';
import { submitEnquiry, requestCallback, whatsappEnquiry } from '../controllers/enquiry.controller';

const router = Router();

// Public routes
router.post('/', submitEnquiry);
router.post('/callback', requestCallback);
router.post('/whatsapp', whatsappEnquiry);

export default router;
