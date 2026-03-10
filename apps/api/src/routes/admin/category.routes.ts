import { Router } from 'express';
import { createCategory, updateCategory, deleteCategory, getAllCategories } from '../../controllers/admin/category.controller';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken, authorizeAdmin);

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
