const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    updateOrderStatus,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Order routes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Category routes
router.route('/menu/categories')
    .get(getCategories)
    .post(createCategory);

router.route('/menu/categories/:id')
    .put(updateCategory)
    .delete(deleteCategory);

// Menu item routes
router.route('/menu/items')
    .get(getMenuItems)
    .post(createMenuItem);

router.route('/menu/items/:id')
    .put(updateMenuItem)
    .delete(deleteMenuItem);

module.exports = router;
