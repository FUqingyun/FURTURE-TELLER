# 环境配置检查脚本
Write-Host "检查环境配置..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# 检查后端环境变量
$backendEnvPath = Join-Path $projectRoot "backend\.env"
if (Test-Path $backendEnvPath) {
    Write-Host "后端环境变量文件存在: backend/.env" -ForegroundColor Green
    $backendEnv = Get-Content $backendEnvPath -Raw
    if ($backendEnv -match "your_stripe_secret_key_here") {
        Write-Host "警告: 后端Stripe密钥需要配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "后端环境变量文件不存在: backend/.env" -ForegroundColor Red
}

# 检查前端环境变量
$frontendEnvPath = Join-Path $projectRoot "frontend\.env.local"
if (Test-Path $frontendEnvPath) {
    Write-Host "前端环境变量文件存在: frontend/.env.local" -ForegroundColor Green
    $frontendEnv = Get-Content $frontendEnvPath -Raw
    if ($frontendEnv -match "your_stripe_publishable_key_here") {
        Write-Host "警告: 前端Stripe公钥需要配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "前端环境变量文件不存在: frontend/.env.local" -ForegroundColor Red
}

# 检查uploads目录
$uploadsPath = Join-Path $projectRoot "backend\uploads"
if (Test-Path $uploadsPath) {
    Write-Host "上传目录存在: backend/uploads" -ForegroundColor Green
} else {
    Write-Host "上传目录不存在: backend/uploads" -ForegroundColor Red
}

# 检查node_modules
$backendNodeModules = Join-Path $projectRoot "backend\node_modules"
$frontendNodeModules = Join-Path $projectRoot "frontend\node_modules"
if (Test-Path $backendNodeModules) {
    Write-Host "后端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "后端依赖未安装，请运行: cd backend; npm install" -ForegroundColor Yellow
}

if (Test-Path $frontendNodeModules) {
    Write-Host "前端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "前端依赖未安装，请运行: cd frontend; npm install" -ForegroundColor Yellow
}

# 检查MongoDB
Write-Host ""
Write-Host "MongoDB状态检查..." -ForegroundColor Cyan
try {
    $mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "MongoDB服务正在运行" -ForegroundColor Green
    } else {
        Write-Host "MongoDB服务未运行，请启动MongoDB" -ForegroundColor Yellow
    }
} catch {
    Write-Host "无法检查MongoDB状态" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "环境配置检查完成！" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 配置Stripe密钥（如果使用支付功能）"
Write-Host "2. 确保MongoDB正在运行"
Write-Host "3. 安装依赖: npm run install:all"
Write-Host "4. 启动开发服务器: npm run dev"
