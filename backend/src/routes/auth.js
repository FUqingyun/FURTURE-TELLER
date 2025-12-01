const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { sendEmail, sendSMS } = require('../utils/sendCode');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 生成JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// 发送验证码
router.post('/send-code', [
  body('target').notEmpty().withMessage('请输入邮箱或手机号'),
  body('type').isIn(['email', 'phone']).withMessage('类型无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { target, type } = req.body;

    // 检查目标格式
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      return res.status(400).json({ success: false, message: '邮箱格式不正确' });
    }
    // 简单检查手机号（需根据实际需求调整正则）
    if (type === 'phone' && !/^\d{11}$/.test(target)) {
      return res.status(400).json({ success: false, message: '手机号格式不正确' });
    }

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存到数据库 (会自动覆盖旧的，或者创建新的)
    // 先删除旧的
    await VerificationCode.deleteMany({ target, type });
    await VerificationCode.create({ target, type, code });

    // 发送
    if (type === 'email') {
      await sendEmail(target, code);
    } else {
      await sendSMS(target, code);
    }

    res.json({
      success: true,
      message: '验证码已发送'
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error.message
    });
  }
});

// 用户注册
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3个字符'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('code').notEmpty().withMessage('请输入验证码'),
  body('role').optional().isIn(['customer', 'fortune_teller']).withMessage('角色无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, phone, password, role, code } = req.body;

    // 确定注册类型
    const type = email ? 'email' : 'phone';
    const target = email || phone;

    if (!target) {
      return res.status(400).json({ success: false, message: '必须提供邮箱或手机号' });
    }

    // 验证验证码
    const validCode = await VerificationCode.findOne({ target, type, code });
    if (!validCode) {
      return res.status(400).json({ success: false, message: '验证码无效或已过期' });
    }

    // 检查用户是否已存在
    const query = { $or: [{ username }] };
    if (email) query.$or.push({ email });
    if (phone) query.$or.push({ phone });

    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱或手机号已存在'
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role: role || 'customer'
    });

    // 验证成功后删除验证码
    await VerificationCode.deleteMany({ target, type });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
});

// 用户登录
router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱'),
  body('password').notEmpty().withMessage('请输入密码')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
});

// 获取当前用户信息
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

module.exports = router;



