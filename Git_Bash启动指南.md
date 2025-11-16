# 🐚 Git Bash 启动服务指南

## 📋 快速开始

### 1. 打开 Git Bash

- 在项目文件夹中右键点击，选择 **"Git Bash Here"**
- 或打开 Git Bash，然后导航到项目目录

### 2. 导航到项目目录

```bash
# 方式1：如果 Git Bash 在项目目录打开，直接使用
# 无需切换目录

# 方式2：从其他位置导航到项目
cd "/e/Future teller Project"

# 注意：Git Bash 使用正斜杠 / 和引号处理包含空格的路径
```

### 3. 检查当前目录

```bash
pwd
# 应该显示: /e/Future teller Project
```

---

## 🚀 启动服务

### 方式一：同时启动前后端（推荐）⭐

```bash
npm run dev
```

**说明**:
- 后端服务: `http://localhost:5000`
- 前端服务: `http://localhost:3000`
- 按 `Ctrl + C` 停止服务

---

### 方式二：分别启动前后端

#### 启动后端服务

**终端1（Git Bash）**:
```bash
npm run dev:backend
```

**或**:
```bash
cd backend
npm run dev
```

**成功标志**:
```
数据库连接成功
服务器运行在端口 5000
```

---

#### 启动前端服务

**终端2（Git Bash）**:
```bash
npm run dev:frontend
```

**或**:
```bash
cd frontend
npm run dev
```

**成功标志**:
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

---

## 📝 Git Bash 常用命令

### 目录操作

```bash
# 查看当前目录
pwd

# 列出文件和文件夹
ls
ls -la          # 显示隐藏文件

# 切换目录
cd backend      # 进入 backend 目录
cd ..           # 返回上一级目录
cd ~            # 返回用户主目录
cd "/e/Future teller Project"  # 切换到项目目录（包含空格需加引号）
```

### 项目相关命令

```bash
# 安装所有依赖
npm run install:all

# 检查环境配置
npm run check-env

# 查看 Node.js 版本
node -v

# 查看 npm 版本
npm -v
```

### 进程管理

```bash
# 查找占用端口的进程
lsof -i :5000
lsof -i :3000

# 结束进程（替换 PID 为实际进程ID）
kill -9 <PID>

# 查看所有 Node.js 进程
ps aux | grep node
```

---

## 🔍 验证服务

### 检查后端服务

在 Git Bash 中执行：

```bash
# 使用 curl 测试健康检查
curl http://localhost:5000/api/health
```

**预期响应**:
```json
{"status":"OK","message":"服务器运行正常"}
```

### 检查前端服务

- 打开浏览器访问: `http://localhost:3000`
- 应该能看到应用首页

---

## 🛑 停止服务

### 停止当前运行的服务

在运行服务的 Git Bash 终端中：

```bash
# 按 Ctrl + C 停止服务
Ctrl + C
```

### 强制停止占用端口的进程

```bash
# 查找进程
lsof -i :5000
lsof -i :3000

# 结束进程（替换 PID）
kill -9 <PID>

# 或者使用 pkill（如果知道进程名）
pkill -f "node.*server.js"
pkill -f "next dev"
```

---

## ⚠️ 常见问题

### 问题1: 路径包含空格

**错误**: Git Bash 无法识别包含空格的路径

**解决方案**: 使用引号包裹路径

```bash
# ✅ 正确
cd "/e/Future teller Project"

# ❌ 错误
cd /e/Future teller Project
```

---

### 问题2: npm 命令找不到

**错误**: `bash: npm: command not found`

**解决方案**:

1. 检查 Node.js 是否安装：
   ```bash
   node -v
   ```

2. 如果 Node.js 已安装但 npm 找不到，可能需要重启 Git Bash

3. 检查 PATH 环境变量：
   ```bash
   echo $PATH
   ```

4. 手动添加 Node.js 到 PATH（如果需要）：
   ```bash
   export PATH=$PATH:/c/Program\ Files/nodejs
   ```

---

### 问题3: MongoDB 连接失败

**错误**: `数据库连接失败`

**解决方案**:

1. 确认 MongoDB 服务正在运行：
   ```bash
   # Windows 检查服务
   net start MongoDB
   ```

2. 检查 MongoDB 是否在默认端口运行：
   ```bash
   # 测试 MongoDB 连接
   mongosh mongodb://localhost:27017
   ```

---

### 问题4: 端口被占用

**错误**: `Error: listen EADDRINUSE`

**解决方案**:

```bash
# 查找占用端口的进程
lsof -i :5000
lsof -i :3000

# 结束进程（替换 PID）
kill -9 <PID>
```

---

## 💡 Git Bash 使用技巧

### 1. 多标签页

Git Bash 支持多标签页：
- 右键点击 Git Bash 标题栏
- 选择 "New Tab" 或按 `Ctrl + Shift + T`

### 2. 复制粘贴

- **复制**: 选中文本后按 `Insert` 键，或右键选择
- **粘贴**: 按 `Shift + Insert`，或右键选择

### 3. 命令历史

- 使用 `↑` 和 `↓` 键浏览历史命令
- 使用 `Ctrl + R` 搜索历史命令

### 4. 自动补全

- 按 `Tab` 键自动补全文件名和命令
- 按两次 `Tab` 显示所有可能的补全选项

### 5. 清屏

```bash
clear
# 或按 Ctrl + L
```

---

## 📚 完整启动流程示例

### 第一次启动

```bash
# 1. 打开 Git Bash，导航到项目目录
cd "/e/Future teller Project"

# 2. 检查环境
node -v
npm -v

# 3. 安装依赖（如果还没安装）
npm run install:all

# 4. 检查环境变量配置
npm run check-env

# 5. 启动 MongoDB（如果还没启动）
# 在另一个终端或 CMD 中运行: mongod

# 6. 启动前后端服务
npm run dev
```

### 日常启动

```bash
# 1. 打开 Git Bash，导航到项目目录
cd "/e/Future teller Project"

# 2. 启动服务
npm run dev
```

---

## 🎯 快速参考

| 操作 | Git Bash 命令 |
|------|--------------|
| 进入项目目录 | `cd "/e/Future teller Project"` |
| 启动前后端 | `npm run dev` |
| 启动后端 | `npm run dev:backend` |
| 启动前端 | `npm run dev:frontend` |
| 安装依赖 | `npm run install:all` |
| 检查环境 | `npm run check-env` |
| 停止服务 | `Ctrl + C` |
| 查看端口占用 | `lsof -i :5000` |
| 结束进程 | `kill -9 <PID>` |

---

## ✅ 启动检查清单

启动前确认：

- [ ] Git Bash 已打开
- [ ] 当前目录正确（`pwd` 显示项目路径）
- [ ] Node.js 已安装（`node -v`）
- [ ] npm 可用（`npm -v`）
- [ ] 依赖已安装（`ls node_modules`）
- [ ] MongoDB 服务正在运行
- [ ] 端口 5000 和 3000 未被占用

启动后验证：

- [ ] 后端日志显示"数据库连接成功"
- [ ] 后端日志显示"服务器运行在端口 5000"
- [ ] 前端日志显示"ready started server"
- [ ] 浏览器可以访问 `http://localhost:3000`
- [ ] 健康检查正常（`curl http://localhost:5000/api/health`）

---

## 🎉 成功启动标志

### 后端成功
```
✅ 数据库连接成功
✅ 服务器运行在端口 5000
```

### 前端成功
```
✅ ready started server on 0.0.0.0:3000
✅ Local:        http://localhost:3000
```

---

祝您使用愉快！🚀

