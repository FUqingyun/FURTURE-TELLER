const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 创建支付意图
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate('customerId')
      .populate('fortuneTellerId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查订单是否属于当前用户
    if (order.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权支付此订单'
      });
    }

    // 创建Stripe支付意图
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100), // 转换为分
      currency: 'cny',
      metadata: {
        orderId: order._id.toString(),
        customerId: req.user._id.toString()
      }
    });

    // 更新订单
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建支付失败',
      error: error.message
    });
  }
});

// Stripe Webhook处理支付成功
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理支付成功事件
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'paid';
        order.paymentMethod = 'stripe';
        order.startTime = new Date();
        await order.save();
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
    }
  }

  res.json({ received: true });
});

// 确认支付成功
router.post('/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查支付状态
    if (order.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        order.status = 'paid';
        order.paymentMethod = 'stripe';
        order.startTime = new Date();
        await order.save();

        return res.json({
          success: true,
          message: '支付成功',
          data: order
        });
      }
    }

    res.status(400).json({
      success: false,
      message: '支付未完成'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '确认支付失败',
      error: error.message
    });
  }
});

module.exports = router;



