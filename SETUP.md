# 项目设置指南

## 前置要求

1. **Node.js** (v18 或更高版本)
2. **MongoDB** (v5 或更高版本)
3. **Git**

## 安装步骤

### 1. 安装项目依赖

```bash
# 安装根目录依赖
npm install

# 安装所有依赖（包括前端和后端）
npm run install:all
```

### 2. 配置环境变量

#### 后端配置

创建 `backend/.env` 文件（参考 `backend/.env.example`）：

```env
# 服务器配置
PORT=5000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/future_teller

# JWT密钥（请更改为随机字符串）
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=7d

# Stripe支付配置（测试环境）
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS配置
FRONTEND_URL=http://localhost:3000
```

#### 前端配置

创建 `frontend/.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. 启动MongoDB

#### Windows
```bash
# 确保MongoDB服务正在运行
mongod
```

#### macOS
```bash
# 使用Homebrew安装MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
# Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod

# 检查状态
sudo systemctl status mongod
```

### 4. 启动开发服务器

#### 方式一：同时启动前后端
```bash
npm run dev
```

#### 方式二：分别启动
```bash
# 终端1：启动后端
npm run dev:backend
# 后端运行在 http://localhost:5000

# 终端2：启动前端
npm run dev:frontend
# 前端运行在 http://localhost:3000
```

## 测试账号

注册账号时可以选择角色：
- **客户 (customer)**: 可以浏览算命师、下单、聊天
- **算命师 (fortune_teller)**: 可以管理资料、查看订单、聊天

## 支付配置

### Stripe测试账号

1. 注册Stripe账号：https://stripe.com
2. 获取测试API密钥：
   - 登录Stripe Dashboard
   - 进入"Developers" > "API keys"
   - 复制"Publishable key"和"Secret key"
   - 更新 `.env` 文件中的Stripe配置

### 测试卡号

Stripe提供测试卡号用于测试支付：
- 成功支付：`4242 4242 4242 4242`
- 需要3D验证：`4000 0025 0000 3155`
- 拒绝支付：`4000 0000 0000 0002`

有效期：任意未来日期（如 12/34）
CVC：任意3位数字（如 123）

## 常见问题

### 1. MongoDB连接失败

**问题**: `数据库连接失败`

**解决方案**:
- 确保MongoDB服务正在运行
- 检查 `MONGODB_URI` 是否正确
- 确保MongoDB没有设置密码认证（开发环境）

### 2. 端口被占用

**问题**: `端口5000或3000已被占用`

**解决方案**:
- 更改 `backend/.env` 中的 `PORT` 值
- 更改前端端口：`npm run dev:frontend -- -p 3001`

### 3. 依赖安装失败

**问题**: `npm install` 失败

**解决方案**:
- 清除缓存：`npm cache clean --force`
- 删除 `node_modules` 和 `package-lock.json`，重新安装
- 使用yarn：`yarn install`

### 4. TypeScript类型错误

**问题**: TypeScript报错找不到模块

**解决方案**:
- 确保已安装所有依赖
- 重启VS Code或IDE
- 运行 `npm install` 重新安装依赖

## 项目结构

```
future-teller-project/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # API路由
│   │   ├── middleware/  # 中间件
│   │   └── server.js    # 服务器入口
│   └── package.json
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── app/         # Next.js页面
│   │   ├── components/  # React组件
│   │   ├── contexts/    # React Context
│   │   └── lib/         # 工具函数
│   └── package.json
└── package.json         # 根package.json
```

## 下一步

1. 创建测试账号
2. 创建算命师资料
3. 测试支付流程
4. 测试聊天功能

## 开发建议

1. **代码格式化**: 使用Prettier格式化代码
2. **代码检查**: 使用ESLint检查代码
3. **Git提交**: 使用有意义的提交信息
4. **环境变量**: 不要提交 `.env` 文件到Git
5. **数据库备份**: 定期备份MongoDB数据

## 技术支持

如遇问题，请检查：
1. Node.js和MongoDB版本是否符合要求
2. 环境变量是否正确配置
3. 端口是否被占用
4. 依赖是否正确安装



