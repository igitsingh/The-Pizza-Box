const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');

/**
 * @desc    Get all menu categories
 * @route   GET /api/menu/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await MenuCategory.find({ isActive: true })
            .sort({ sortOrder: 1, name: 1 });

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
 * @desc    Get all menu items with filters
 * @route   GET /api/menu/items
 * @access  Public
 * @query   categorySlug, isVeg, isBestseller, search
 */
exports.getMenuItems = async (req, res, next) => {
    try {
        const { categorySlug, isVeg, isBestseller, search } = req.query;

        // Build query
        let query = { isAvailable: true };

        // Filter by category
        if (categorySlug) {
            const category = await MenuCategory.findOne({ slug: categorySlug });
            if (category) {
                query.categoryId = category._id;
            }
        }

        // Filter by veg
        if (isVeg !== undefined) {
            query.isVeg = isVeg === 'true';
        }

        // Filter by bestseller
        if (isBestseller !== undefined) {
            query.isBestseller = isBestseller === 'true';
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const items = await MenuItem.find(query)
            .populate('categoryId', 'name slug')
            .sort({ isBestseller: -1, name: 1 });

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
 * @desc    Get single menu item by ID
 * @route   GET /api/menu/items/:id
 * @access  Public
 */
exports.getMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id)
            .populate('categoryId', 'name slug');

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        if (!item.isAvailable) {
            return res.status(404).json({
                success: false,
                error: 'This item is currently unavailable'
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
 * @desc    Get menu item by slug
 * @route   GET /api/menu/items/slug/:slug
 * @access  Public
 */
exports.getMenuItemBySlug = async (req, res, next) => {
    try {
        const item = await MenuItem.findOne({
            slug: req.params.slug,
            isAvailable: true
        }).populate('categoryId', 'name slug');

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
 * @desc    Get bestsellers
 * @route   GET /api/menu/bestsellers
 * @access  Public
 */
exports.getBestsellers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const items = await MenuItem.find({
            isBestseller: true,
            isAvailable: true
        })
            .populate('categoryId', 'name slug')
            .limit(limit)
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
