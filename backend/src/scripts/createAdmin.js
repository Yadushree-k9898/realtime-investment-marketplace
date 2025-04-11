const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed
require('dotenv').config(); // Load DB connection from .env

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('❗️Admin already exists.');
            process.exit();
        }

        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'Admin@123', // ⬅️ Plain text here, let Mongoose handle hashing
            role: 'admin',
        });

        await admin.save();
        console.log('✅ Admin created successfully.');
        process.exit();
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
