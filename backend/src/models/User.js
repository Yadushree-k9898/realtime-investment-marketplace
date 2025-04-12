// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['founder', 'investor', 'admin'], default: 'investor' }
// }, { timestamps: true });

// // Pre-save hook for password hashing & single admin enforcement
// UserSchema.pre('save', async function (next) {
//     try {
//         // Enforce single admin rule
//         if (this.role === 'admin') {
//             const existingAdmin = await mongoose.model('User').findOne({ role: 'admin' });
//             if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
//                 throw new Error('An admin already exists. Only one admin is allowed.');
//             }
//         }

//         // Hash password before saving if modified
//         if (this.isModified('password')) {
//             this.password = await bcrypt.hash(this.password, 10);
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// // Compare password method
// UserSchema.methods.comparePassword = async function (password) {
//     return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['founder', 'investor', 'admin'], default: 'investor' },
  
  // 🆕 Extended profile fields
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  industry: { type: String, default: '' },
  profileImage: { type: String, default: '' }, // Optional profile image URL

}, { timestamps: true });

// 🔐 Pre-save hook for password hashing & single admin enforcement
UserSchema.pre('save', async function (next) {
  try {
    if (this.role === 'admin') {
      const existingAdmin = await mongoose.model('User').findOne({ role: 'admin' });
      if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
        throw new Error('An admin already exists. Only one admin is allowed.');
      }
    }

    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// 🔍 Compare password method
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
