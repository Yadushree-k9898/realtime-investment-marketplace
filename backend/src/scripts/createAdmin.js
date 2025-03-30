const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load DB connection from .env

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10); // Use a strong password
        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully.');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
