const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
    index: true // 邮箱或手机号
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  code: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5分钟后自动删除
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);

