# 安装项目依赖脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "安装项目依赖" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 安装
Write-Host "检查 Node.js 安装..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "[成功] Node.js 已安装" -ForegroundColor Green
    Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Green
    Write-Host "npm 版本: $npmVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] 未找到 Node.js" -ForegroundColor Red
    Write-Host "请先安装 Node.js: https://nodejs.org/" -ForegroundColor Red
    Write-Host "安装后重新运行此脚本" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 设置npm镜像（可选，加速下载）
Write-Host "是否使用国内镜像加速？(Y/N)" -ForegroundColor Yellow
$useMirror = Read-Host
if ($useMirror -eq "Y" -or $useMirror -eq "y") {
    Write-Host "设置 npm 镜像为淘宝镜像..." -ForegroundColor Yellow
    npm config set registry https://registry.npmmirror.com
    Write-Host "[成功] 镜像设置完成" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始安装依赖..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 安装根目录依赖
Write-Host "[1/3] 安装根目录依赖..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "安装失败"
    }
    Write-Host "[成功] 根目录依赖安装完成" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] 根目录依赖安装失败" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 安装后端依赖
Write-Host "[2/3] 安装后端依赖..." -ForegroundColor Yellow
try {
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "安装失败"
    }
    Set-Location ..
    Write-Host "[成功] 后端依赖安装完成" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] 后端依赖安装失败" -ForegroundColor Red
    Set-Location ..
    Read-Host "按 Enter 键退出"
    exit 1
}

# 安装前端依赖
Write-Host "[3/3] 安装前端依赖..." -ForegroundColor Yellow
try {
    Set-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "安装失败"
    }
    Set-Location ..
    Write-Host "[成功] 前端依赖安装完成" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] 前端依赖安装失败" -ForegroundColor Red
    Set-Location ..
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "依赖安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 确保 MongoDB 正在运行"
Write-Host "2. 运行: npm run dev"
Write-Host "3. 访问: http://localhost:3000"
Write-Host ""
Read-Host "按 Enter 键退出"


