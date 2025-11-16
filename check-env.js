const fs = require('fs');
const path = require('path');

console.log('🔍 检查环境配置...\n');

// 检查后端环境变量
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log('✅ 后端环境变量文件存在: backend/.env');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  if (backendEnv.includes('your_stripe_secret_key_here')) {
    console.log('⚠️  警告: 后端Stripe密钥需要配置');
  }
} else {
  console.log('❌ 后端环境变量文件不存在: backend/.env');
}

// 检查前端环境变量
const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
if (fs.existsSync(frontendEnvPath)) {
  console.log('✅ 前端环境变量文件存在: frontend/.env.local');
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  if (frontendEnv.includes('your_stripe_publishable_key_here')) {
    console.log('⚠️  警告: 前端Stripe公钥需要配置');
  }
} else {
  console.log('❌ 前端环境变量文件不存在: frontend/.env.local');
}

// 检查uploads目录
const uploadsPath = path.join(__dirname, 'backend', 'uploads');
if (fs.existsSync(uploadsPath)) {
  console.log('✅ 上传目录存在: backend/uploads');
} else {
  console.log('❌ 上传目录不存在: backend/uploads');
}

// 检查node_modules
const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
if (fs.existsSync(backendNodeModules)) {
  console.log('✅ 后端依赖已安装');
} else {
  console.log('❌ 后端依赖未安装，请运行: cd backend && npm install');
}

if (fs.existsSync(frontendNodeModules)) {
  console.log('✅ 前端依赖已安装');
} else {
  console.log('❌ 前端依赖未安装，请运行: cd frontend && npm install');
}

console.log('\n📝 环境配置检查完成！');
console.log('\n下一步:');
console.log('1. 配置Stripe密钥（如果使用支付功能）');
console.log('2. 确保MongoDB正在运行');
console.log('3. 安装依赖: npm run install:all');
console.log('4. 启动开发服务器: npm run dev');



