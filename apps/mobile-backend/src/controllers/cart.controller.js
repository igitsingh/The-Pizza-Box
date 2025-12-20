const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Coupon = require('../models/Coupon');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }

        // Recalculate totals
        await cart.calculateTotals();
        await cart.save();

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
exports.addToCart = async (req, res, next) => {
    try {
        const { menuItemId, quantity, selectedOptions } = req.body;

        if (!menuItemId || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'Please provide menuItemId and quantity'
            });
        }

        // Get menu item
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                success: false,
                error: 'This item is currently unavailable'
            });
        }

        // Calculate price with options
        let itemPrice = menuItem.basePrice;
        const processedOptions = [];

        if (selectedOptions && selectedOptions.length > 0) {
            for (const selected of selectedOptions) {
                const option = menuItem.options.find(opt => opt.name === selected.optionName);
                if (option) {
                    const choice = option.choices.find(ch => ch.label === selected.choiceLabel);
                    if (choice) {
                        itemPrice += choice.priceDelta;
                        processedOptions.push({
                            optionName: selected.optionName,
                            choiceLabel: selected.choiceLabel,
                            priceDelta: choice.priceDelta
                        });
                    }
                }
            }
        }

        const lineTotal = itemPrice * quantity;

        // Get or create cart
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }

        // Check if same item with same options exists
        const existingItemIndex = cart.items.findIndex(item => {
            if (item.menuItemId.toString() !== menuItemId) return false;
            if (item.selectedOptions.length !== processedOptions.length) return false;

            return item.selectedOptions.every((opt, idx) => {
                const procOpt = processedOptions[idx];
                return opt.optionName === procOpt.optionName &&
                    opt.choiceLabel === procOpt.choiceLabel;
            });
        });

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].lineTotal =
                cart.items[existingItemIndex].priceSnapshot * cart.items[existingItemIndex].quantity;
        } else {
            // Add new item
            cart.items.push({
                menuItemId,
                nameSnapshot: menuItem.name,
                priceSnapshot: itemPrice,
                quantity,
                selectedOptions: processedOptions,
                lineTotal
            });
        }

        // Recalculate totals
        await cart.calculateTotals();
        await cart.save();

        await cart.populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update cart item
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity, selectedOptions } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        // Update quantity
        if (quantity !== undefined) {
            if (quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Quantity must be greater than 0'
                });
            }
            item.quantity = quantity;
            item.lineTotal = item.priceSnapshot * quantity;
        }

        // Update options (recalculate price)
        if (selectedOptions) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            let itemPrice = menuItem.basePrice;
            const processedOptions = [];

            for (const selected of selectedOptions) {
                const option = menuItem.options.find(opt => opt.name === selected.optionName);
                if (option) {
                    const choice = option.choices.find(ch => ch.label === selected.choiceLabel);
                    if (choice) {
                        itemPrice += choice.priceDelta;
                        processedOptions.push({
                            optionName: selected.optionName,
                            choiceLabel: selected.choiceLabel,
                            priceDelta: choice.priceDelta
                        });
                    }
                }
            }

            item.priceSnapshot = itemPrice;
            item.selectedOptions = processedOptions;
            item.lineTotal = itemPrice * item.quantity;
        }

        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        cart.items.pull(req.params.itemId);

        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/apply-coupon
 * @access  Private
 */
exports.applyCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'Please provide coupon code'
            });
        }

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        // Find coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                error: 'Invalid coupon code'
            });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({
                success: false,
                error: 'This coupon is expired or inactive'
            });
        }

        // Calculate subtotal first
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.lineTotal, 0);

        if (cart.subtotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                error: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
            });
        }

        // Apply coupon
        cart.couponCode = coupon.code;
        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/coupon
 * @access  Private
 */
exports.removeCoupon = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        cart.couponCode = null;
        cart.discountAmount = 0;

        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.menuItemId', 'name imageUrl basePrice isAvailable');

        res.json({
            success: true,
            message: 'Coupon removed',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Clear cart
 * @route   POST /api/cart/clear
 * @access  Private
 */
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        cart.items = [];
        cart.couponCode = null;
        cart.discountAmount = 0;
        cart.subtotal = 0;
        cart.taxAmount = 0;
        cart.grandTotal = 0;

        await cart.save();

        res.json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};
