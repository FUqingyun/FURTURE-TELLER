# 🔧 PowerShell 执行策略错误详细解决方案

## ❌ 错误信息

```
npm : 无法加载文件 E:\npm.ps1，因为在此系统上禁止运行脚本。
有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1
+ npm run dev
+ ~~~
    + CategoryInfo          : SecurityError: (:) []，PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

---

## 🔍 问题原因

Windows PowerShell 默认的执行策略（Execution Policy）限制了脚本的运行，这是 Windows 的安全机制。当执行策略设置为 `Restricted`（默认值）时，PowerShell 无法运行任何脚本，包括 npm 的 PowerShell 脚本。

### 执行策略类型说明

| 策略类型 | 说明 |
|---------|------|
| **Restricted** | 默认策略，不允许运行任何脚本 |
| **AllSigned** | 只允许运行经过数字签名的脚本 |
| **RemoteSigned** | 本地脚本可以运行，远程脚本需要签名（推荐） |
| **Unrestricted** | 允许运行所有脚本（不安全） |
| **Bypass** | 绕过所有策略（不安全） |

---

## ✅ 解决方案（按推荐顺序）

### 方案1: 临时修改当前会话执行策略（推荐）⭐

**优点**: 
- ✅ 安全，只影响当前会话
- ✅ 关闭窗口后自动恢复
- ✅ 不需要管理员权限（使用 CurrentUser 作用域）

**步骤**:

1. **打开 PowerShell**（不需要管理员权限）

2. **查看当前执行策略**:
   ```powershell
   Get-ExecutionPolicy
   ```
   通常会显示: `Restricted`

3. **临时设置执行策略**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```
   
   **参数说明**:
   - `-ExecutionPolicy RemoteSigned`: 设置策略为 RemoteSigned
   - `-Scope Process`: 只影响当前 PowerShell 进程

4. **验证设置**:
   ```powershell
   Get-ExecutionPolicy
   ```
   应该显示: `RemoteSigned`

5. **运行 npm 命令**:
   ```powershell
   npm run dev
   ```

**注意**: 
- 关闭 PowerShell 窗口后，设置会恢复为默认值
- 每次打开新的 PowerShell 窗口都需要重新设置

---

### 方案2: 永久修改当前用户执行策略（推荐用于开发）⭐

**优点**: 
- ✅ 永久生效，不需要每次设置
- ✅ 只影响当前用户，不影响系统
- ✅ 不需要管理员权限
- ✅ 相对安全

**步骤**:

1. **打开 PowerShell**（不需要管理员权限）

2. **查看当前执行策略**:
   ```powershell
   Get-ExecutionPolicy -List
   ```
   这会显示所有作用域的执行策略

3. **设置当前用户的执行策略**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **确认更改**:
   ```powershell
   # PowerShell 会询问是否确认，输入 Y 确认
   # 或使用 -Force 参数跳过确认
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
   ```

5. **验证设置**:
   ```powershell
   Get-ExecutionPolicy
   ```
   应该显示: `RemoteSigned`

6. **运行 npm 命令**:
   ```powershell
   npm run dev
   ```

**说明**:
- 这个设置会永久保存
- 只影响当前 Windows 用户
- 其他用户不受影响
- 系统级别的策略不受影响

---

### 方案3: 使用管理员权限修改系统执行策略（不推荐）

**⚠️ 警告**: 此方法会影响整个系统，建议仅在必要时使用

**步骤**:

1. **以管理员身份打开 PowerShell**:
   - 右键点击 PowerShell 图标
   - 选择 "以管理员身份运行"

2. **设置系统级执行策略**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
   ```

3. **确认更改**:
   ```powershell
   # 输入 Y 确认
   ```

4. **验证设置**:
   ```powershell
   Get-ExecutionPolicy -List
   ```

**缺点**:
- ⚠️ 需要管理员权限
- ⚠️ 影响整个系统
- ⚠️ 可能影响系统安全性

---

### 方案4: 绕过执行策略运行单个命令（临时方案）

**适用场景**: 只想运行一次命令，不想修改设置

**方法1: 使用 -ExecutionPolicy 参数**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

**方法2: 使用 -Command 参数**
```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev"
```

**缺点**:
- 每次都需要输入完整命令
- 不够方便

---

### 方案5: 使用 CMD（命令提示符）替代

如果不想修改 PowerShell 设置，可以使用 Windows CMD：

**步骤**:

1. **打开 CMD**:
   - 按 `Win + R`
   - 输入 `cmd`
   - 回车

2. **导航到项目目录**:
   ```cmd
   cd /d "E:\Future teller Project"
   ```

3. **运行 npm 命令**:
   ```cmd
   npm run dev
   ```

**优点**:
- ✅ 不需要修改任何设置
- ✅ CMD 不受执行策略限制

**缺点**:
- ❌ CMD 功能不如 PowerShell 强大
- ❌ 语法不同

---

### 方案6: 使用 Git Bash（最佳替代方案）⭐

**优点**:
- ✅ 完全不受 PowerShell 执行策略影响
- ✅ 跨平台兼容性好
- ✅ 功能强大
- ✅ 符合开发习惯

**步骤**:

1. **打开 Git Bash**:
   - 在项目文件夹中右键点击
   - 选择 "Git Bash Here"

2. **导航到项目目录**（如果需要）:
   ```bash
   cd "/e/Future teller Project"
   ```

3. **运行 npm 命令**:
   ```bash
   npm run dev
   ```

---

## 🔍 详细操作步骤（方案1示例）

### 完整操作流程

```powershell
# 步骤1: 打开 PowerShell
# 按 Win + X，选择 "Windows PowerShell" 或 "终端"

# 步骤2: 查看当前执行策略
PS E:\Future teller Project> Get-ExecutionPolicy
Restricted

# 步骤3: 设置临时执行策略
PS E:\Future teller Project> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 步骤4: 验证设置
PS E:\Future teller Project> Get-ExecutionPolicy
RemoteSigned

# 步骤5: 运行 npm 命令
PS E:\Future teller Project> npm run dev
```

---

## 📋 执行策略管理命令参考

### 查看执行策略

```powershell
# 查看当前作用域的执行策略
Get-ExecutionPolicy

# 查看所有作用域的执行策略
Get-ExecutionPolicy -List

# 输出示例:
#        Scope ExecutionPolicy
#        ----- ---------------
# MachinePolicy       Undefined
#    UserPolicy       Undefined
#       Process       RemoteSigned
#  CurrentUser       RemoteSigned
#  LocalMachine      Restricted
```

### 设置执行策略

```powershell
# 临时设置（当前进程）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 永久设置（当前用户）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 永久设置（系统级别，需要管理员）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

# 强制设置（跳过确认）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### 恢复默认设置

```powershell
# 恢复当前用户为默认值
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser

# 恢复系统级别为默认值（需要管理员）
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope LocalMachine
```

---

## 🛡️ 安全建议

### 推荐设置

**开发环境**:
- 使用 `RemoteSigned` 策略
- 作用域设置为 `CurrentUser`
- 这样既安全又方便

**生产环境**:
- 保持默认的 `Restricted` 策略
- 或使用 `AllSigned` 策略（需要签名所有脚本）

### 安全说明

- ✅ `RemoteSigned`: 
  - 本地脚本可以直接运行
  - 从互联网下载的脚本需要数字签名
  - 适合开发环境使用

- ⚠️ `Unrestricted`: 
  - 允许运行所有脚本
  - 存在安全风险
  - 不推荐使用

- ⚠️ `Bypass`: 
  - 完全绕过执行策略
  - 存在严重安全风险
  - 仅用于测试

---

## 🔧 故障排查

### 问题1: 设置后仍然报错

**可能原因**:
1. 设置的作用域不对
2. 系统策略覆盖了用户策略

**解决方案**:
```powershell
# 查看所有作用域的策略
Get-ExecutionPolicy -List

# 检查是否有更严格的策略覆盖
# 如果有 MachinePolicy 或 UserPolicy 设置为 Restricted，
# 需要联系系统管理员
```

### 问题2: 提示需要管理员权限

**解决方案**:
- 使用 `-Scope CurrentUser` 而不是 `-Scope LocalMachine`
- CurrentUser 作用域不需要管理员权限

### 问题3: 设置后无法保存

**可能原因**:
- 组策略限制了更改

**解决方案**:
```powershell
# 检查组策略
Get-ExecutionPolicy -List

# 如果 MachinePolicy 或 UserPolicy 不是 Undefined，
# 说明组策略限制了更改，需要联系系统管理员
```

---

## 📝 快速参考表

| 方案 | 命令 | 作用域 | 需要管理员 | 持久性 | 推荐度 |
|------|------|--------|-----------|--------|--------|
| 临时设置 | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` | 当前进程 | ❌ | 临时 | ⭐⭐⭐⭐⭐ |
| 用户永久 | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` | 当前用户 | ❌ | 永久 | ⭐⭐⭐⭐ |
| 系统永久 | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine` | 整个系统 | ✅ | 永久 | ⭐⭐ |
| 绕过执行 | `powershell -ExecutionPolicy Bypass -Command "npm run dev"` | 单次命令 | ❌ | 临时 | ⭐⭐⭐ |
| 使用 CMD | `cmd` 然后 `npm run dev` | - | ❌ | - | ⭐⭐⭐ |
| 使用 Git Bash | `npm run dev` | - | ❌ | - | ⭐⭐⭐⭐⭐ |

---

## ✅ 推荐操作流程

### 开发环境推荐设置

```powershell
# 1. 打开 PowerShell（不需要管理员）

# 2. 设置当前用户的执行策略为 RemoteSigned
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. 确认更改（输入 Y）

# 4. 验证设置
Get-ExecutionPolicy
# 应该显示: RemoteSigned

# 5. 现在可以正常使用 npm 命令了
npm run dev
```

---

## 🎯 总结

### 最佳实践

1. **开发环境**: 使用 `RemoteSigned` + `CurrentUser` 作用域
   - 安全且方便
   - 不需要管理员权限
   - 只影响当前用户

2. **临时使用**: 使用 `Process` 作用域
   - 最安全
   - 关闭窗口后自动恢复

3. **替代方案**: 使用 Git Bash
   - 完全不受执行策略影响
   - 跨平台兼容性好

### 快速解决

**最快的方法**（推荐）:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm run dev
```

**永久解决**（推荐）:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm run dev
```

**不修改设置**（推荐）:
使用 Git Bash 运行 `npm run dev`

---

## 📚 相关资源

- [Microsoft 官方文档 - about_Execution_Policies](https://go.microsoft.com/fwlink/?LinkID=135170)
- [PowerShell 执行策略详解](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies)

---

希望这份详细指南能帮助您解决问题！🚀

