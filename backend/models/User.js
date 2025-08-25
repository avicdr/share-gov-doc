const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Please add Aadhaar number'],
    unique: true,
    match: [/^\d{12}$/, 'Please add a valid 12-digit Aadhaar number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please add a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please add a valid 6-digit pincode']
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    permissions: [{
      type: String,
      enum: ['view', 'download'],
      default: 'view'
    }],
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP
UserSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + parseInt(process.env.OTP_EXPIRY))
  };
  return otp;
};

// Verify OTP
UserSchema.methods.verifyOTP = function(enteredOTP) {
  if (!this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  if (Date.now() > this.otp.expiresAt) {
    return false;
  }
  
  return this.otp.code === enteredOTP;
};

module.exports = mongoose.model('User', UserSchema);