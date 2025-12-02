const express = require('express');
const Order = require('../models/Order');
const FortuneTeller = require('../models/FortuneTeller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 获取订单统计数据 (必须放在 /:id 之前)
router.get('/stats', protect, async (req, res) => {
  try {
    const query = {};
    
    // 确定查询范围
    if (req.user.role === 'fortune_teller') {
      const ft = await FortuneTeller.findOne({ userId: req.user._id });
      if (ft) {
        query.fortuneTellerId = ft._id;
      } else {
        return res.json({ success: true, data: { pending: 0, earnings: 0, ongoing: 0, completed: 0 } });
      }
    } else {
      query.customerId = req.user._id;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 并行执行统计查询
    const [pending, ongoing, completed, todayEarningsResult] = await Promise.all([
      // 待处理: status 为 paid (已支付但未开始)
      Order.countDocuments({ ...query, status: 'paid' }),
      // 进行中: status 为 in_progress
      Order.countDocuments({ ...query, status: 'in_progress' }),
      // 已完成: status 为 completed
      Order.countDocuments({ ...query, status: 'completed' }),
      // 今日收入聚合查询
      Order.aggregate([
        {
          $match: {
            ...query,
            status: { $in: ['paid', 'in_progress', 'completed'] }, // 只要支付过的都算
            updatedAt: { $gte: today } // 假设以更新时间为准，或者使用 createdAt
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        pending,
        ongoing,
        completed,
        earnings: todayEarningsResult[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ success: false, message: '获取统计失败' });
  }
});

// 获取所有订单（需要认证）
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    
    // 根据角色过滤订单
    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'fortune_teller') {
      const ft = await FortuneTeller.findOne({ userId: req.user._id });
      if (ft) {
        query.fortuneTellerId = ft._id;
      } else {
        return res.json({
          success: true,
          data: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        });
      }
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'username email avatar')
      .populate({
        path: 'fortuneTellerId',
        select: 'name avatar pricePerSession userId', // 增加 userId
        populate: { path: 'userId', select: 'username' } // 如果需要关联的用户信息
      })
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
      .populate({
        path: 'fortuneTellerId',
        select: 'name avatar pricePerSession userId' // 增加 userId
      });

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

    // 生成订单号: ORD + 时间戳 + 4位随机数
    const orderNumber = `ORD${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
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
    console.error('创建订单失败:', error);
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
    let isFortuneTellerOwner = false;
    if (req.user.role === 'fortune_teller') {
      const ft = await FortuneTeller.findOne({ userId: req.user._id });
      if (ft && order.fortuneTellerId.toString() === ft._id.toString()) {
        isFortuneTellerOwner = true;
      }
    }

    const isOwner = order.customerId.toString() === req.user._id.toString() || isFortuneTellerOwner;
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此订单'
      });
    }

    order.status = status;
    if (status === 'paid') {
      // 支付完成时间
    }
    if (status === 'in_progress') {
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



