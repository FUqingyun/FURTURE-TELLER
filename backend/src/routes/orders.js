const express = require('express');
const Order = require('../models/Order');
const FortuneTeller = require('../models/FortuneTeller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 获取所有订单（需要认证）
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    
    // 根据角色过滤订单
    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'fortune_teller') {
      query.fortuneTellerId = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'username email avatar')
      .populate('fortuneTellerId', 'name avatar pricePerSession')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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
      message: '获取订单列表失败',
      error: error.message
    });
  }
});

// 获取单个订单详情
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'username email avatar')
      .populate('fortuneTellerId', 'name avatar pricePerSession');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    const isOwner = order.customerId._id.toString() === req.user._id.toString() ||
                    order.fortuneTellerId.userId?.toString() === req.user._id.toString();
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此订单'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取订单详情失败',
      error: error.message
    });
  }
});

// 创建订单
router.post('/', protect, async (req, res) => {
  try {
    const { fortuneTellerId, amount, sessionDuration, notes } = req.body;

    // 验证命理师是否存在
    const fortuneTeller = await FortuneTeller.findById(fortuneTellerId);
    if (!fortuneTeller) {
      return res.status(404).json({
        success: false,
        message: '命理师不存在'
      });
    }

    if (!fortuneTeller.isAvailable) {
      return res.status(400).json({
        success: false,
        message: '该命理师当前不可用'
      });
    }

    const order = await Order.create({
      customerId: req.user._id,
      fortuneTellerId,
      amount: amount || fortuneTeller.pricePerSession,
      sessionDuration: sessionDuration || 60,
      notes: notes || ''
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'username email avatar')
      .populate('fortuneTellerId', 'name avatar pricePerSession');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建订单失败',
      error: error.message
    });
  }
});

// 更新订单状态
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    const isOwner = order.customerId.toString() === req.user._id.toString() ||
                    order.fortuneTellerId.toString() === req.user._id.toString();
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此订单'
      });
    }

    order.status = status;
    if (status === 'paid') {
      order.startTime = new Date();
    }
    if (status === 'completed') {
      order.endTime = new Date();
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新订单状态失败',
      error: error.message
    });
  }
});

module.exports = router;



