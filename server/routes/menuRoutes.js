const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  getCategories,
  getFeaturedItems,
} = require('../controllers/menuController');

router.get('/categories', getCategories);
router.get('/featured', getFeaturedItems);
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

module.exports = router;
