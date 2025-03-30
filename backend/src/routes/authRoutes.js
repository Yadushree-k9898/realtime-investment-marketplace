const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout); // User must be logged in to log out

module.exports = router;
