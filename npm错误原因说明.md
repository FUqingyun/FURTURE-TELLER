# npm run dev 报错原因分析

## 🔴 错误信息

```
npm : 无法加载文件 E:\npm.ps1，因为在此系统上禁止运行脚本。
```

## 🔍 问题根本原因

### 1. PowerShell 命令查找顺序

当你在 PowerShell 中运行 `npm` 时，PowerShell 会按照以下顺序查找命令：

1. **别名（Alias）**
2. **函数（Function）**
3. **命令（Cmdlet）**
4. **脚本文件（.ps1）**
5. **可执行文件（.exe, .cmd, .bat）**

### 2. 你的系统情况

检查发现：
- ✅ `E:\npm.ps1` 存在（PowerShell 脚本）
- ✅ `E:\npm.cmd` 存在（CMD 批处理文件）
- ✅ `E:\npm` 存在（可执行文件）
- ✅ PATH 环境变量中包含 `E:\`

### 3. 问题所在

**PowerShell 优先找到了 `E:\npm.ps1`**，而不是 `npm.cmd` 或真正的 npm 可执行文件。

当 PowerShell 尝试执行 `E:\npm.ps1` 时，由于执行策略（Execution Policy）的限制，被阻止了。

## 📋 详细分析

### PowerShell 执行策略

PowerShell 有一个安全机制叫"执行策略"（Execution Policy），用于控制脚本的执行：

- **Restricted**：禁止运行所有脚本（默认）
- **RemoteSigned**：可以运行本地脚本，远程脚本需要签名
- **Unrestricted**：可以运行所有脚本
- **Bypass**：不检查任何策略

你的系统执行策略可能是 `Restricted` 或 `RemoteSigned`，所以无法运行 `E:\npm.ps1`。

### 为什么会有 E:\npm.ps1？

`E:\npm.ps1` 是 Node.js 安装的一部分。Node.js 在 `E:\` 目录下安装了：
- `node.exe` - Node.js 可执行文件
- `npm.ps1` - npm 的 PowerShell 包装脚本
- `npm.cmd` - npm 的 CMD 批处理文件
- `npm` - npm 的 shell 脚本（Unix/Linux）

## ✅ 解决方案

### 方案一：使用 npm.cmd（推荐）

在 PowerShell 中，明确指定使用 `.cmd` 版本：

```powershell
npm.cmd run dev
```

### 方案二：使用完整路径

找到 Node.js 的正确安装目录（通常在 `C:\Program Files\nodejs\`），使用完整路径：

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### 方案三：临时更改执行策略

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm run dev
```

### 方案四：使用 CMD 而不是 PowerShell

打开命令提示符（CMD），而不是 PowerShell：
- CMD 不受 PowerShell 执行策略限制
- CMD 会优先使用 `npm.cmd`

## 🎯 推荐做法

**最简单的方法：使用 `npm.cmd`**

```powershell
npm.cmd run dev
```

或者修改 `package.json` 中的脚本，使用 `npm.cmd`：

```json
{
  "scripts": {
    "dev": "npm.cmd run dev:backend && npm.cmd run dev:frontend"
  }
}
```

但实际上，更好的方法是**使用 CMD 而不是 PowerShell**，因为：
- CMD 不受执行策略限制
- CMD 会正确使用 `npm.cmd`
- 更简单直接

## 📝 总结

**错误原因：**
1. PowerShell 优先找到了 `E:\npm.ps1`
2. PowerShell 的执行策略阻止了运行 `.ps1` 脚本
3. 应该使用 `npm.cmd` 或切换到 CMD

**解决方法：**
- 使用 `npm.cmd run dev` 而不是 `npm run dev`
- 或者使用 CMD 而不是 PowerShell


