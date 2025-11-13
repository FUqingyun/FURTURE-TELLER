const mongoose = require('mongoose');

const fortuneTellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  specialties: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  pricePerSession: {
    type: Number,
    required: true,
    min: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  languages: [{
    type: String
  }],
  certification: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FortuneTeller', fortuneTellerSchema);



