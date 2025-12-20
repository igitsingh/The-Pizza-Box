const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.post('/apply-coupon', applyCoupon);
router.delete('/coupon', removeCoupon);
router.post('/clear', clearCart);

module.exports = router;
