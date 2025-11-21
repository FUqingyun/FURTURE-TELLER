# 快速启动指南

## ✅ 环境配置已完成

环境变量文件已成功创建！

## 🚀 快速开始

### 1. 安装依赖

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

### 2. 启动MongoDB

确保MongoDB服务正在运行：

**Windows:**
```bash
# 如果MongoDB已安装，直接启动服务
mongod

# 或者通过服务管理器启动
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3. 启动开发服务器

**方式一：同时启动前后端（推荐）**
```bash
npm run dev
```

**方式二：分别启动**
```bash
# 终端1：启动后端
npm run dev:backend
# 后端运行在 http://localhost:5000

# 终端2：启动前端
npm run dev:frontend
# 前端运行在 http://localhost:3000
```

### 4. 访问应用

- **前端**: http://localhost:3000
- **后端API**: http://localhost:5000/api
- **健康检查**: http://localhost:5000/api/health

## 🔧 环境检查

运行环境检查脚本：

**PowerShell:**
```bash
.\check-env.ps1
```

**Node.js:**
```bash
npm run check-env
```

## ⚙️ 配置说明

### 已配置的项目

- ✅ 服务器端口: 5000
- ✅ 前端端口: 3000
- ✅ MongoDB连接: mongodb://localhost:27017/future_teller
- ✅ JWT密钥: 已设置（开发环境）
- ✅ 上传目录: backend/uploads

### 需要配置的项目（可选）

#### Stripe支付配置

如果使用支付功能：

1. 注册Stripe账号: https://stripe.com
2. 获取测试密钥:
   - 登录Stripe Dashboard
   - 进入 "Developers" > "API keys"
   - 复制 "Publishable key" 和 "Secret key"
3. 更新环境变量:
   - 编辑 `backend/.env`，更新 `STRIPE_SECRET_KEY`
   - 编辑 `frontend/.env.local`，更新 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**注意**: 如果不使用支付功能，可以暂时跳过此配置。

## 📝 测试账号

注册账号时可以选择角色：
- **客户 (customer)**: 可以浏览算命师、下单、聊天
- **算命师 (fortune_teller)**: 可以管理资料、查看订单、聊天

## 🐛 常见问题

### 问题1: MongoDB连接失败

**错误**: `数据库连接失败`

**解决方案**:
1. 确保MongoDB服务正在运行
2. 检查MongoDB是否安装在默认路径
3. 检查 `backend/.env` 中的 `MONGODB_URI` 是否正确

### 问题2: 端口被占用

**错误**: `端口5000或3000已被占用`

**解决方案**:
1. 更改 `backend/.env` 中的 `PORT` 值
2. 更改前端端口: `npm run dev:frontend -- -p 3001`
3. 更新 `frontend/.env.local` 中的 `NEXT_PUBLIC_API_URL`

### 问题3: 依赖安装失败

**错误**: `npm install` 失败

**解决方案**:
1. 清除npm缓存: `npm cache clean --force`
2. 删除 `node_modules` 和 `package-lock.json`
3. 重新安装: `npm install`
4. 使用yarn: `yarn install`

### 问题4: 前端无法连接后端

**错误**: `无法连接到API服务器`

**解决方案**:
1. 确保后端服务正在运行
2. 检查 `frontend/.env.local` 中的 `NEXT_PUBLIC_API_URL` 是否正确
3. 检查后端CORS配置

### 问题5: TypeScript类型错误

**错误**: `找不到模块` 或 `类型错误`

**解决方案**:
1. 确保已安装所有依赖
2. 重启VS Code或IDE
3. 运行 `npm install` 重新安装依赖
4. 删除 `node_modules` 和 `package-lock.json`，重新安装

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [SETUP.md](./SETUP.md) - 详细设置指南
- [ENV_CONFIG.md](./ENV_CONFIG.md) - 环境配置说明

## 🎉 下一步

1. ✅ 环境配置完成
2. ⏳ 安装依赖: `npm run install:all`
3. ⏳ 启动MongoDB
4. ⏳ 启动开发服务器: `npm run dev`
5. ⏳ 访问应用: http://localhost:3000
6. ⏳ 注册账号并测试功能

## 💡 提示

- 使用 `npm run dev` 可以同时启动前后端
- 使用 `npm run check-env` 检查环境配置
- 查看 `ENV_CONFIG.md` 了解详细的配置说明
- 查看 `SETUP.md` 了解完整的设置步骤



