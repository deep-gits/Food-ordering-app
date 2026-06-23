const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');

// ─── Menu Item CRUD ───────────────────────────────────────────────────────────

// @desc    Admin: Get all menu items
// @route   GET /api/admin/menu
// @access  Admin
const adminGetMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().populate('category', 'name icon').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Create menu item
// @route   POST /api/admin/menu
// @access  Admin
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, isFeatured, preparationTime, tags, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : (imageUrl || '');

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      preparationTime: preparationTime || 20,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    });

    const populated = await item.populate('category', 'name icon');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Update menu item
// @route   PUT /api/admin/menu/:id
// @access  Admin
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    const { name, description, price, category, isAvailable, isFeatured, preparationTime, tags, imageUrl } = req.body;

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price !== undefined ? price : item.price;
    item.category = category || item.category;
    item.isAvailable = isAvailable !== undefined ? isAvailable : item.isAvailable;
    item.isFeatured = isFeatured !== undefined ? isFeatured : item.isFeatured;
    item.preparationTime = preparationTime || item.preparationTime;
    item.tags = tags ? tags.split(',').map((t) => t.trim()) : item.tags;
    if (req.file) item.image = `/uploads/${req.file.filename}`;
    else if (imageUrl) item.image = imageUrl;

    const updated = await item.save();
    await updated.populate('category', 'name icon');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete menu item
// @route   DELETE /api/admin/menu/:id
// @access  Admin
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Category CRUD ────────────────────────────────────────────────────────────

// @desc    Admin: Create category
// @route   POST /api/admin/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.create({ name, icon, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

// @desc    Admin: Get all orders
// @route   GET /api/admin/orders
// @access  Admin
const adminGetOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Update order status
// @route   PUT /api/admin/orders/:id
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.body.orderStatus)   order.orderStatus   = req.body.orderStatus;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

    if (req.body.orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMenuItems = await MenuItem.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          $or: [
            { paymentStatus: 'paid' },                                               // Stripe paid orders
            { paymentMethod: 'cash_on_delivery', orderStatus: 'delivered' },         // COD delivered orders
          ],
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalOrders, totalUsers, totalMenuItems, totalRevenue, recentOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminGetMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  adminGetOrders,
  updateOrderStatus,
  getDashboardStats,
};
