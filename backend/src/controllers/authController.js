// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const redisClient = require('../config/redis'); // Redis connection
// const generateToken = require("../utils/generateToken");

// // Register User
// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const user = await User.create({ name, email, password, role });
//         res.status(201).json({
//             message: 'User registered successfully',
//             user: { id: user._id, name: user.name, email: user.email, role: user.role },
//             token: generateToken(user)
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// // Login User
// exports.login = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       if (!email || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//       }
  
//       const user = await User.findOne({ email });
//       const isPasswordValid = user && (await user.comparePassword(password));
  
//       if (!user || !isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       const token = generateToken(user);
  
//       res.json({
//         message: 'Login successful',
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };
  

// // Logout User (Blacklist Token)
// exports.logout = async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(400).json({ message: 'No token provided' });
//         }

//         await redisClient.set(token, 'blacklisted', { EX: 7 * 24 * 60 * 60 }); // 7 days
//         res.json({ message: 'Logged out successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // ✅ Get current logged-in user
// exports.getMe = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const { _id, name, email, role } = req.user;
//         res.json({ user: { id: _id, name, email, role } });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redis');
const generateToken = require("../utils/generateToken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, bio, location, industry, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      bio,
      location,
      industry,
      profileImage
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        industry: user.industry,
        profileImage: user.profileImage
      },
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    const isPasswordValid = user && (await user.comparePassword(password));

    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        industry: user.industry,
        profileImage: user.profileImage
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout User (Blacklist Token)
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    await redisClient.set(token, 'blacklisted', { EX: 7 * 24 * 60 * 60 }); // 7 days
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { _id, name, email, role, bio, location, industry, profileImage } = req.user;
    res.json({
      user: { id: _id, name, email, role, bio, location, industry, profileImage }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // 🆕 Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const updates = req.body;
//     const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

//     res.json({
//       message: 'Profile updated successfully',
//       user
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'location', 'industry', 'bio'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

