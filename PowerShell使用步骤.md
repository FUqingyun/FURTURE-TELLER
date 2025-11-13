# 💻 PowerShell 使用步骤指南

## ✅ 您看到的信息是正常的

当您打开 PowerShell 时，会看到：

```
Windows PowerShell
版权所有（C） Microsoft Corporation。保留所有权利。

安装最新的 PowerShell，了解新功能和改进！https://aka.ms/PSWindows
```

**这是正常的启动信息**，接下来会出现命令提示符。

---

## 📍 等待命令提示符出现

### 命令提示符的样子

命令提示符通常长这样：

```
PS C:\Users\您的用户名>
```

或者：

```
PS E:\Future teller Project>
```

**提示符说明**:
- `PS` = PowerShell 的标识
- `C:\Users\您的用户名>` = 当前目录路径
- `>` = 等待输入命令的提示符

---

## 🚀 完整操作步骤

### 步骤1: 等待命令提示符出现

看到版权信息后，**等待几秒钟**，会出现类似这样的提示符：

```
PS C:\Users\YourName>
```

### 步骤2: 导航到项目目录

如果提示符不在项目目录，需要先切换目录：

```powershell
# 切换到项目目录
cd "E:\Future teller Project"
```

**注意**: 
- 路径包含空格时需要用引号包裹
- 使用反斜杠 `\` 或正斜杠 `/` 都可以

### 步骤3: 设置执行策略（解决 npm 错误）

```powershell
# 临时设置执行策略（推荐）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

**如果提示确认，输入 `Y` 然后回车**

### 步骤4: 运行 npm 命令

```powershell
npm run dev
```

---

## 📝 完整示例（从打开到运行）

### 示例1: 在项目目录打开 PowerShell

```
Windows PowerShell
版权所有（C） Microsoft Corporation。保留所有权利。

安装最新的 PowerShell，了解新功能和改进！https://aka.ms/PSWindows

PS E:\Future teller Project> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

PS E:\Future teller Project> npm run dev
```

### 示例2: 在其他目录打开 PowerShell

```
Windows PowerShell
版权所有（C） Microsoft Corporation。保留所有权利。

安装最新的 PowerShell，了解新功能和改进！https://aka.ms/PSWindows

PS C:\Users\YourName> cd "E:\Future teller Project"

PS E:\Future teller Project> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

PS E:\Future teller Project> npm run dev
```

---

## 🔍 如何确认 PowerShell 已准备好

### 检查点1: 看到命令提示符

✅ 正确：`PS E:\Future teller Project>`
❌ 错误：只有版权信息，没有 `PS` 提示符

### 检查点2: 可以输入命令

- 光标应该在 `>` 后面闪烁
- 可以输入文字
- 按回车执行命令

### 检查点3: 当前目录正确

```powershell
# 查看当前目录
pwd
# 或
Get-Location
```

应该显示：`E:\Future teller Project`

---

## ⚠️ 常见问题

### 问题1: 没有看到命令提示符

**可能原因**:
- PowerShell 还在加载中
- 窗口被最小化了

**解决方案**:
- 等待几秒钟
- 检查窗口是否在后台
- 点击 PowerShell 窗口，确保它处于活动状态

### 问题2: 提示符在错误的目录

**解决方案**:
```powershell
# 切换到项目目录
cd "E:\Future teller Project"

# 验证是否切换成功
pwd
```

### 问题3: 输入命令没有反应

**可能原因**:
- PowerShell 还在加载
- 命令输入错误

**解决方案**:
- 等待提示符出现
- 检查命令拼写
- 确保在正确的目录

---

## 🎯 快速操作流程

### 方法1: 在项目目录打开 PowerShell

1. **打开 PowerShell**
   - 在项目文件夹中，按住 `Shift` + 右键
   - 选择 "在此处打开 PowerShell 窗口"

2. **等待提示符出现**
   ```
   PS E:\Future teller Project>
   ```

3. **设置执行策略**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```

4. **运行 npm 命令**
   ```powershell
   npm run dev
   ```

### 方法2: 从开始菜单打开

1. **打开 PowerShell**
   - 按 `Win` 键
   - 输入 `PowerShell`
   - 回车

2. **导航到项目目录**
   ```powershell
   cd "E:\Future teller Project"
   ```

3. **设置执行策略**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```

4. **运行 npm 命令**
   ```powershell
   npm run dev
   ```

---

## 💡 PowerShell 基本命令

### 目录操作

```powershell
# 查看当前目录
pwd
Get-Location

# 列出文件和文件夹
ls
dir
Get-ChildItem

# 切换目录
cd "E:\Future teller Project"
cd ..              # 返回上一级
cd ~               # 返回用户主目录
```

### 项目相关命令

```powershell
# 查看 Node.js 版本
node -v

# 查看 npm 版本
npm -v

# 运行 npm 命令
npm run dev
npm run dev:backend
npm run dev:frontend
```

---

## ✅ 成功标志

### 设置执行策略成功

```powershell
PS E:\Future teller Project> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

PS E:\Future teller Project> Get-ExecutionPolicy
RemoteSigned
```

### 启动服务成功

```powershell
PS E:\Future teller Project> npm run dev

> future-teller-platform@1.0.0 dev
> concurrently "npm run dev:backend" "npm run dev:frontend"

[0] 数据库连接成功
[0] 服务器运行在端口 5000
[1] - ready started server on 0.0.0.0:3000
```

---

## 🎓 提示

1. **等待提示符**: 看到版权信息后，等待 `PS` 提示符出现
2. **检查目录**: 使用 `pwd` 确认当前目录
3. **路径引号**: 路径包含空格时用引号包裹
4. **执行策略**: 每次新开 PowerShell 窗口都需要设置（如果使用 Process 作用域）

---

## 🚀 现在就开始

1. ✅ 看到版权信息（已完成）
2. ⏳ 等待命令提示符出现
3. ⏳ 输入: `cd "E:\Future teller Project"`
4. ⏳ 输入: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`
5. ⏳ 输入: `npm run dev`

祝您使用顺利！🎉

