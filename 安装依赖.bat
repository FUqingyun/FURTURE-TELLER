@echo off
chcp 65001 >nul
echo ========================================
echo 安装项目依赖
echo ========================================
echo.

echo 检查 Node.js 安装...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    echo 安装后重新运行此脚本
    pause
    exit /b 1
)

echo [成功] Node.js 已安装
node --version
npm --version
echo.

echo ========================================
echo 开始安装依赖...
echo ========================================
echo.

echo [1/3] 安装根目录依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 根目录依赖安装失败
    pause
    exit /b 1
)
echo [成功] 根目录依赖安装完成
echo.

echo [2/3] 安装后端依赖...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [错误] 后端依赖安装失败
    cd ..
    pause
    exit /b 1
)
cd ..
echo [成功] 后端依赖安装完成
echo.

echo [3/3] 安装前端依赖...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [错误] 前端依赖安装失败
    cd ..
    pause
    exit /b 1
)
cd ..
echo [成功] 前端依赖安装完成
echo.

echo ========================================
echo 依赖安装完成！
echo ========================================
echo.
echo 下一步:
echo 1. 确保 MongoDB 正在运行
echo 2. 运行: npm run dev
echo 3. 访问: http://localhost:3000
echo.
pause


