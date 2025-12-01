const express = require('express');
const Message = require('../models/Message');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 获取订单的所有消息
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // 验证订单权限
    const order = await Order.findById(orderId).populate('fortuneTellerId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    const isOwner = order.customerId.toString() === req.user._id.toString() ||
                    (order.fortuneTellerId && order.fortuneTellerId.userId.toString() === req.user._id.toString());
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此订单的消息'
      });
    }

    // 检查订单是否已支付
    if (order.status !== 'paid' && order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '订单未支付，无法查看消息'
      });
    }

    const messages = await Message.find({ orderId })
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ orderId });

    res.json({
      success: true,
      data: messages.reverse(), // 反转以按时间正序显示
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
      message: '获取消息失败',
      error: error.message
    });
  }
});

// 发送消息
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, content, messageType = 'text' } = req.body;

    // 验证订单
    const order = await Order.findById(orderId).populate('fortuneTellerId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    const isOwner = order.customerId.toString() === req.user._id.toString() ||
                    (order.fortuneTellerId && order.fortuneTellerId.userId.toString() === req.user._id.toString());
    
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: '无权在此订单中发送消息'
      });
    }

    // 检查订单状态
    if (order.status !== 'paid' && order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '订单未支付，无法发送消息'
      });
    }

    // 确定接收者
    const receiverId = order.customerId.toString() === req.user._id.toString() 
      ? order.fortuneTellerId.userId // 使用 populated 的 userId
      : order.customerId;

    const message = await Message.create({
      orderId,
      senderId: req.user._id,
      receiverId,
      content,
      messageType
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '发送消息失败',
      error: error.message
    });
  }
});

// 标记消息为已读
router.patch('/:messageId/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      });
    }

    // 检查是否是接收者
    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权标记此消息'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '标记消息失败',
      error: error.message
    });
  }
});

// 撤回消息
router.post('/:messageId/recall', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      });
    }

    // 检查是否是发送者
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权撤回此消息'
      });
    }

    // 检查时间限制 (2分钟)
    const now = new Date();
    const messageTime = new Date(message.createdAt);
    const diffMinutes = (now - messageTime) / 1000 / 60;

    if (diffMinutes > 2) {
      return res.status(400).json({
        success: false,
        message: '超过2分钟无法撤回'
      });
    }

    // 更新消息状态
    message.messageType = 'recall';
    message.content = '此消息已撤回';
    await message.save();

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '撤回消息失败',
      error: error.message
    });
  }
});

module.exports = router;



