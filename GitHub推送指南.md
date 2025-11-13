# 🚀 GitHub 推送指南

## 📋 前置准备

### 1. 检查 Git 是否已安装

```bash
git --version
```

如果未安装，请先安装 Git：https://git-scm.com/downloads

### 2. 配置 Git 用户信息（如果还没配置）

```bash
# 设置用户名
git config --global user.name "您的用户名"

# 设置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

---

## 🔧 步骤1: 初始化 Git 仓库

### 在项目根目录执行

```bash
# 导航到项目目录
cd "E:\Future teller Project"

# 初始化 Git 仓库
git init
```

---

## 📝 步骤2: 检查 .gitignore 文件

项目已包含 `.gitignore` 文件，确保以下内容被忽略：

✅ **已配置忽略**:
- `node_modules/` - 依赖包
- `.env` 和 `.env.local` - 环境变量文件
- `.next/` - Next.js 构建文件
- `backend/uploads/` - 上传文件
- 各种日志和临时文件

**重要**: 确保敏感信息（如 API 密钥、数据库密码）不会提交到 GitHub！

---

## 📦 步骤3: 添加文件到 Git

### 添加所有文件

```bash
# 查看将要添加的文件（预览）
git status

# 添加所有文件到暂存区
git add .

# 再次查看状态，确认文件已添加
git status
```

### 如果只想添加特定文件

```bash
# 添加单个文件
git add README.md

# 添加整个目录
git add frontend/
git add backend/
```

---

## 💾 步骤4: 提交代码

```bash
# 创建首次提交
git commit -m "Initial commit: Future Teller Platform"

# 或者使用更详细的提交信息
git commit -m "Initial commit

- 添加前端 Next.js 应用
- 添加后端 Express API 服务器
- 配置 MongoDB 数据库模型
- 集成 Socket.io 实时聊天
- 集成 Stripe 支付功能"
```

---

## 🌐 步骤5: 在 GitHub 创建仓库

### 方法1: 通过 GitHub 网站创建

1. **登录 GitHub**: https://github.com
2. **点击右上角 "+" 号** → 选择 "New repository"
3. **填写仓库信息**:
   - Repository name: `future-teller-platform` (或您喜欢的名称)
   - Description: `算命师与客户沟通平台`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了代码）
4. **点击 "Create repository"**

### 方法2: 使用 GitHub CLI（如果已安装）

```bash
gh repo create future-teller-platform --public --source=. --remote=origin --push
```

---

## 🔗 步骤6: 添加远程仓库

### 获取仓库 URL

创建仓库后，GitHub 会显示仓库 URL，格式如下：
- HTTPS: `https://github.com/您的用户名/future-teller-platform.git`
- SSH: `git@github.com:您的用户名/future-teller-platform.git`

### 添加远程仓库

```bash
# 使用 HTTPS（推荐，简单）
git remote add origin https://github.com/您的用户名/future-teller-platform.git

# 或使用 SSH（需要配置 SSH 密钥）
git remote add origin git@github.com:您的用户名/future-teller-platform.git

# 验证远程仓库已添加
git remote -v
```

---

## 🚀 步骤7: 推送到 GitHub

### 首次推送

```bash
# 推送主分支到 GitHub
git push -u origin main

# 如果您的默认分支是 master，使用：
git push -u origin master

# 如果遇到分支名称问题，可以重命名分支：
git branch -M main
git push -u origin main
```

### 如果遇到认证问题

**HTTPS 方式**:
- GitHub 已不再支持密码认证
- 需要使用 Personal Access Token (PAT)

**创建 Personal Access Token**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. 选择权限：至少勾选 `repo`
4. 生成后复制 token
5. 推送时使用 token 作为密码

**或使用 SSH**:
```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your.email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub: Settings → SSH and GPG keys → New SSH key
```

---

## 📋 完整操作流程示例

```bash
# 1. 导航到项目目录
cd "E:\Future teller Project"

# 2. 初始化 Git 仓库
git init

# 3. 检查状态
git status

# 4. 添加所有文件
git add .

# 5. 提交代码
git commit -m "Initial commit: Future Teller Platform"

# 6. 添加远程仓库（替换为您的仓库 URL）
git remote add origin https://github.com/您的用户名/future-teller-platform.git

# 7. 重命名分支为 main（如果需要）
git branch -M main

# 8. 推送到 GitHub
git push -u origin main
```

---

## ⚠️ 重要注意事项

### 1. 不要提交敏感信息

确保以下文件**不在** Git 仓库中：

- ❌ `backend/.env` - 包含数据库密码、JWT 密钥等
- ❌ `frontend/.env.local` - 包含 API URL、Stripe 密钥等
- ❌ `node_modules/` - 依赖包（太大）
- ❌ `backend/uploads/` - 用户上传的文件

**检查方法**:
```bash
# 查看将要提交的文件
git status

# 查看 .gitignore 是否生效
git check-ignore -v backend/.env
```

### 2. 创建示例环境变量文件

为了帮助其他开发者，可以创建示例文件：

**创建 `backend/.env.example`**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/future_teller
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
FRONTEND_URL=http://localhost:3000
```

**创建 `frontend/.env.local.example`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

这些 `.example` 文件可以提交到 Git，帮助其他开发者配置环境。

---

## 🔄 后续更新代码

### 日常推送流程

```bash
# 1. 查看修改的文件
git status

# 2. 添加修改的文件
git add .

# 或添加特定文件
git add frontend/src/components/Header.tsx

# 3. 提交更改
git commit -m "更新: 添加新功能描述"

# 4. 推送到 GitHub
git push
```

### 提交信息规范

推荐使用清晰的提交信息：

```bash
# 功能添加
git commit -m "feat: 添加用户登录功能"

# 修复 bug
git commit -m "fix: 修复支付流程错误"

# 文档更新
git commit -m "docs: 更新 README 文档"

# 代码重构
git commit -m "refactor: 重构 API 路由结构"
```

---

## 🐛 常见问题解决

### 问题1: 推送被拒绝

**错误**: `error: failed to push some refs`

**解决方案**:
```bash
# 先拉取远程更改
git pull origin main --rebase

# 然后再次推送
git push
```

### 问题2: 认证失败

**错误**: `Authentication failed`

**解决方案**:
- 使用 Personal Access Token 代替密码
- 或配置 SSH 密钥

### 问题3: 分支名称不匹配

**错误**: `error: src refspec main does not match any`

**解决方案**:
```bash
# 查看当前分支
git branch

# 重命名分支
git branch -M main

# 或使用现有分支名推送
git push -u origin master
```

### 问题4: 文件太大

**错误**: `remote: error: File is too large`

**解决方案**:
- 确保 `node_modules/` 在 `.gitignore` 中
- 使用 Git LFS 处理大文件
- 或删除大文件后重新提交

---

## 📚 推荐的 GitHub 仓库结构

### README.md 内容建议

创建或更新 `README.md`，包含：

```markdown
# Future Teller Platform

算命师与客户沟通平台

## 功能特性

- 用户认证系统
- 算命师浏览和搜索
- 实时聊天功能
- 订单管理
- Stripe 支付集成

## 技术栈

- 前端: Next.js 14 + React + TypeScript
- 后端: Node.js + Express + MongoDB
- 实时通信: Socket.io
- 支付: Stripe

## 快速开始

\`\`\`bash
# 安装依赖
npm run install:all

# 启动服务
npm run dev
\`\`\`

## 环境配置

参考 [ENV_CONFIG.md](./ENV_CONFIG.md)

## 许可证

MIT
```

---

## ✅ 推送前检查清单

推送前请确认：

- [ ] Git 已初始化 (`git init`)
- [ ] `.gitignore` 文件存在且配置正确
- [ ] 敏感文件（`.env`）不会被提交
- [ ] 所有文件已添加到暂存区 (`git add .`)
- [ ] 代码已提交 (`git commit`)
- [ ] GitHub 仓库已创建
- [ ] 远程仓库已添加 (`git remote add origin`)
- [ ] 准备推送 (`git push -u origin main`)

---

## 🎯 快速命令参考

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交代码
git commit -m "提交信息"

# 添加远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 推送到 GitHub
git push -u origin main

# 查看状态
git status

# 查看远程仓库
git remote -v

# 查看提交历史
git log
```

---

## 🎉 完成！

推送成功后，您可以在 GitHub 上看到您的代码了！

**下一步**:
- 添加项目描述和标签
- 创建 Issues 跟踪问题
- 设置分支保护规则
- 添加 CI/CD 配置（可选）

祝您使用愉快！🚀

