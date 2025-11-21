# 未来预言师平台

一个为客户和算命师提供沟通渠道的全栈Web应用平台。

## 功能特性

- 👥 **用户系统**: 支持客户和算命师注册登录
- 🔍 **算命师浏览**: 用户可以浏览和搜索算命师
- 💳 **支付系统**: 集成Stripe支付网关
- 💬 **实时聊天**: 基于Socket.io的实时消息通信
- 📦 **订单管理**: 完整的订单创建、支付、完成流程

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (实时通信)
- JWT (身份认证)
- Stripe (支付集成)

### 前端
- Next.js 14 (React框架)
- TypeScript
- Tailwind CSS
- Axios (HTTP客户端)
- Socket.io-client (实时通信)
- React Hot Toast (消息提示)

## 项目结构

```
future-teller-project/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API路由
│   │   ├── middleware/     # 中间件
│   │   └── server.js       # 服务器入口
│   └── package.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── app/           # Next.js页面
│   │   ├── components/    # React组件
│   │   ├── contexts/      # React Context
│   │   └── lib/           # 工具函数
│   └── package.json
└── package.json           # 根package.json
```

## 安装和运行

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 配置环境变量

#### 后端配置 (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/future_teller
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

#### 前端配置 (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. 启动MongoDB

确保MongoDB服务正在运行：
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run dev:backend  # 后端: http://localhost:5000
npm run dev:frontend # 前端: http://localhost:3000
```

## API接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 算命师
- `GET /api/fortune-tellers` - 获取算命师列表
- `GET /api/fortune-tellers/:id` - 获取算命师详情
- `POST /api/fortune-tellers` - 创建算命师资料
- `PUT /api/fortune-tellers/:id` - 更新算命师资料

### 订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PATCH /api/orders/:id/status` - 更新订单状态

### 支付
- `POST /api/payments/create-payment-intent` - 创建支付意图
- `POST /api/payments/confirm` - 确认支付
- `POST /api/payments/webhook` - Stripe Webhook

### 消息
- `GET /api/messages/order/:orderId` - 获取订单消息
- `POST /api/messages` - 发送消息
- `PATCH /api/messages/:messageId/read` - 标记消息已读

## 数据库模型

### User (用户)
- username, email, password
- role (customer, fortune_teller, admin)
- avatar, phone

### FortuneTeller (算命师)
- userId, name, bio
- specialties, experience
- rating, reviewCount
- pricePerSession, isAvailable

### Order (订单)
- orderNumber, customerId, fortuneTellerId
- amount, status
- paymentIntentId, paymentMethod
- sessionDuration, startTime, endTime

### Message (消息)
- orderId, senderId, receiverId
- content, messageType
- isRead, readAt

## 开发说明

1. **用户角色**:
   - `customer`: 客户，可以浏览算命师、下单、聊天
   - `fortune_teller`: 算命师，可以管理资料、查看订单、聊天
   - `admin`: 管理员

2. **订单流程**:
   - 客户选择算命师 → 创建订单 → 支付 → 开始聊天 → 完成订单

3. **实时聊天**:
   - 使用Socket.io实现实时消息传递
   - 消息按订单ID分组到不同房间
   - 只有已支付的订单才能发送消息

## 待完善功能

- [ ] 用户头像上传
- [ ] 评价和评分系统
- [ ] 消息通知
- [ ] 文件上传（图片、文档）
- [ ] 订单退款功能
- [ ] 管理员后台
- [ ] 数据统计和分析
- [ ] 多语言支持

## 许可证

MIT



