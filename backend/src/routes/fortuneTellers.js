const express = require('express');
const FortuneTeller = require('../models/FortuneTeller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 获取所有命理师列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialty, minPrice, maxPrice } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }
    
    if (minPrice || maxPrice) {
      query.pricePerSession = {};
      if (minPrice) query.pricePerSession.$gte = Number(minPrice);
      if (maxPrice) query.pricePerSession.$lte = Number(maxPrice);
    }
    
    query.isAvailable = true;

    const fortuneTellers = await FortuneTeller.find(query)
      .populate('userId', 'username email avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await FortuneTeller.countDocuments(query);

    res.json({
      success: true,
      data: fortuneTellers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取命理师列表失败',
      error: error.message
    });
  }
});

// 获取当前登录用户的命理师资料
router.get('/me', protect, async (req, res) => {
  try {
    const fortuneTeller = await FortuneTeller.findOne({ userId: req.user._id })
      .populate('userId', 'username email avatar');

    if (!fortuneTeller) {
      return res.status(404).json({
        success: false,
        message: '未找到命理师资料'
      });
    }

    res.json({
      success: true,
      data: fortuneTeller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取资料失败',
      error: error.message
    });
  }
});

// 获取单个命理师详情
router.get('/:id', async (req, res) => {
  try {
    const fortuneTeller = await FortuneTeller.findById(req.params.id)
      .populate('userId', 'username email avatar');

    if (!fortuneTeller) {
      return res.status(404).json({
        success: false,
        message: '命理师不存在'
      });
    }

    res.json({
      success: true,
      data: fortuneTeller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取命理师详情失败',
      error: error.message
    });
  }
});

// 创建命理师资料（需要认证）
router.post('/', protect, async (req, res) => {
  try {
    // 检查是否已经是命理师
    const existing = await FortuneTeller.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: '您已经是命理师了'
      });
    }

    const fortuneTeller = await FortuneTeller.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: fortuneTeller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建命理师资料失败',
      error: error.message
    });
  }
});

// 更新命理师资料
router.put('/:id', protect, async (req, res) => {
  try {
    const fortuneTeller = await FortuneTeller.findById(req.params.id);
    
    if (!fortuneTeller) {
      return res.status(404).json({
        success: false,
        message: '命理师不存在'
      });
    }

    // 检查权限
    if (fortuneTeller.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此资料'
      });
    }

    const updated = await FortuneTeller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新命理师资料失败',
      error: error.message
    });
  }
});

module.exports = router;



