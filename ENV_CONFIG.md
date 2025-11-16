# 环境配置说明

## ✅ 环境配置已完成

以下环境文件已创建：

### 后端环境变量 (`backend/.env`)
- ✅ 服务器配置（端口: 5000）
- ✅ 数据库配置（MongoDB）
- ✅ JWT密钥配置
- ⚠️  Stripe支付密钥（需要配置）
- ✅ 文件上传配置
- ✅ CORS配置

### 前端环境变量 (`frontend/.env.local`)
- ✅ API服务器地址
- ⚠️  Stripe支付公钥（需要配置）

### 目录结构
- ✅ 上传目录 (`backend/uploads`)

## 🔧 需要配置的项目

### 1. Stripe支付配置（可选）

如果您需要使用支付功能，需要：

1. **注册Stripe账号**
   - 访问 https://stripe.com
   - 注册并登录账号

2. **获取测试密钥**
   - 登录Stripe Dashboard
   - 进入 "Developers" > "API keys"
   - 复制 "Publishable key" 和 "Secret key"

3. **配置环境变量**
   - 编辑 `backend/.env`，更新 `STRIPE_SECRET_KEY`
   - 编辑 `frontend/.env.local`，更新 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - （可选）配置 `STRIPE_WEBHOOK_SECRET` 用于生产环境

### 2. MongoDB配置

确保MongoDB服务正在运行：

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

如果MongoDB运行在不同的端口或需要认证，请更新 `backend/.env` 中的 `MONGODB_URI`。

### 3. JWT密钥（生产环境）

在生产环境中，请更改 `backend/.env` 中的 `JWT_SECRET` 为更安全的随机字符串。

## 📦 安装依赖

运行以下命令安装所有依赖：

```bash
npm run install:all
```

或者分别安装：

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

## 🚀 启动开发服务器

### 方式一：同时启动前后端
```bash
npm run dev
```

### 方式二：分别启动
```bash
# 终端1：启动后端
npm run dev:backend

# 终端2：启动前端
npm run dev:frontend
```

## 🔍 检查环境配置

运行环境检查脚本：

```bash
npm run check-env
```

## 📝 环境变量说明

### 后端环境变量 (`backend/.env`)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 5000 |
| NODE_ENV | 环境模式 | development |
| MONGODB_URI | MongoDB连接字符串 | mongodb://localhost:27017/future_teller |
| JWT_SECRET | JWT密钥 | future_teller_jwt_secret_key_2024_change_in_production |
| JWT_EXPIRE | JWT过期时间 | 7d |
| STRIPE_SECRET_KEY | Stripe密钥 | 需要配置 |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook密钥 | 需要配置 |
| UPLOAD_DIR | 上传目录 | ./uploads |
| MAX_FILE_SIZE | 最大文件大小 | 5242880 (5MB) |
| FRONTEND_URL | 前端URL | http://localhost:3000 |

### 前端环境变量 (`frontend/.env.local`)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| NEXT_PUBLIC_API_URL | API服务器地址 | http://localhost:5000/api |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe公钥 | 需要配置 |

## ⚠️ 注意事项

1. **不要提交环境变量文件**
   - `.env` 和 `.env.local` 文件已在 `.gitignore` 中
   - 不要将这些文件提交到Git仓库

2. **生产环境配置**
   - 在生产环境中，请使用更安全的JWT密钥
   - 使用Stripe生产环境密钥
   - 配置适当的CORS策略

3. **MongoDB连接**
   - 确保MongoDB服务正在运行
   - 如果MongoDB需要认证，请在连接字符串中包含用户名和密码

## 🐛 常见问题

### 问题1: MongoDB连接失败
**解决方案**: 确保MongoDB服务正在运行，检查连接字符串是否正确

### 问题2: 端口被占用
**解决方案**: 更改 `backend/.env` 中的 `PORT` 值，或停止占用端口的进程

### 问题3: Stripe支付失败
**解决方案**: 确保已配置Stripe密钥，使用测试密钥进行测试

### 问题4: 前端无法连接后端
**解决方案**: 检查 `NEXT_PUBLIC_API_URL` 是否正确，确保后端服务正在运行

## 📚 相关文档

- [SETUP.md](./SETUP.md) - 详细设置指南
- [README.md](./README.md) - 项目说明文档



