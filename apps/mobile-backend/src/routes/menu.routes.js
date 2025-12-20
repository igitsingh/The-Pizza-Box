const express = require('express');
const router = express.Router();
const {
    getCategories,
    getMenuItems,
    getMenuItem,
    getMenuItemBySlug,
    getBestsellers
} = require('../controllers/menu.controller');

// Public routes
router.get('/categories', getCategories);
router.get('/items', getMenuItems);
router.get('/items/slug/:slug', getMenuItemBySlug);
router.get('/items/:id', getMenuItem);
router.get('/bestsellers', getBestsellers);

module.exports = router;
