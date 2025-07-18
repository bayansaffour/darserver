const express = require('express');
const router = express.Router();
const { login, getDashboardStats, createInitialAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/setup', createInitialAdmin);

// Protected routes
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

module.exports = router; 