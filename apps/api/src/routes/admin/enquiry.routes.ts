import { Router } from 'express';
import {
    getAllEnquiries,
    getEnquiry,
    updateStatus,
    assignEnquiry,
    updateNotes,
    deleteEnquiry,
    getEnquiryStats
} from '../../controllers/admin/enquiry.controller';

const router = Router();

router.get('/stats', getEnquiryStats);
router.get('/', getAllEnquiries);
router.get('/:id', getEnquiry);
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', assignEnquiry);
router.patch('/:id/notes', updateNotes);
router.delete('/:id', deleteEnquiry);

export default router;
