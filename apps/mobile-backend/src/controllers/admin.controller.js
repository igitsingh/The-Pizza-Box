const Order = require('../models/Order');
const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, from, to, limit = 50, page = 1 } = req.query;

        const query = {};

        // Filter by status
        if (status) {
            query.orderStatus = status;
        }

        // Filter by date range
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('userId', 'name phone email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update order status (Admin)
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;

        const validStatuses = ['created', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        order.orderStatus = status;
        order.addTimelineEntry(status, note || `Order status updated to ${status}`);
        await order.save();

        // TODO: Send push notification to user about status change

        res.json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all categories (Admin)
 * @route   GET /api/admin/menu/categories
 * @access  Private/Admin
 */
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await MenuCategory.find().sort({ sortOrder: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create category (Admin)
 * @route   POST /api/admin/menu/categories
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, slug, sortOrder, isActive } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name and slug'
            });
        }

        const category = await MenuCategory.create({
            name,
            slug: slug.toLowerCase(),
            sortOrder: sortOrder || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update category (Admin)
 * @route   PUT /api/admin/menu/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await MenuCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete category (Admin)
 * @route   DELETE /api/admin/menu/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await MenuCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Check if category has items
        const itemCount = await MenuItem.countDocuments({ categoryId: req.params.id });
        if (itemCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete category with ${itemCount} items`
            });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all menu items (Admin)
 * @route   GET /api/admin/menu/items
 * @access  Private/Admin
 */
exports.getMenuItems = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        const query = categoryId ? { categoryId } : {};

        const items = await MenuItem.find(query)
            .populate('categoryId', 'name slug')
            .sort({ name: 1 });

        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create menu item (Admin)
 * @route   POST /api/admin/menu/items
 * @access  Private/Admin
 */
exports.createMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.create(req.body);

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update menu item (Admin)
 * @route   PUT /api/admin/menu/items/:id
 * @access  Private/Admin
 */
exports.updateMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete menu item (Admin)
 * @route   DELETE /api/admin/menu/items/:id
 * @access  Private/Admin
 */
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        await item.deleteOne();

        res.json({
            success: true,
            message: 'Menu item deleted'
        });
    } catch (error) {
        next(error);
    }
};
