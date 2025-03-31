const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redis'); // Redis connection
const generateToken = require("../utils/generateToken");

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate user input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
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

        // Validate user input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful', 
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user)
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

        // Store token in Redis with an expiration time matching JWT
        await redisClient.set(token, 'blacklisted', { EX: 7 * 24 * 60 * 60 }); // 7 days expiration

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
