// const express = require('express');
// const { register, login, logout, getMe } = require('../controllers/authController');
// const { protect } = require('../middlewares/authMiddleware');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', protect, logout); 
// router.get('/me', protect, getMe);

// module.exports = router;



const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// 🆕 Profile update route
router.put('/profile', protect, updateProfile);

module.exports = router;
