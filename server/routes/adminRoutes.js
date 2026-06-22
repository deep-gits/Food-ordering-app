const express = require('express');
const router = express.Router();
const {
  adminGetMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  adminGetOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Stats
router.get('/stats', getDashboardStats);

// Menu items
router.get('/menu', adminGetMenuItems);
router.post('/menu', upload.single('image'), createMenuItem);
router.put('/menu/:id', upload.single('image'), updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Categories
router.post('/categories', createCategory);

// Orders
router.get('/orders', adminGetOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
