const nodemailer = require('nodemailer');

// 邮件发送配置
const createTransporter = async () => {
  // 如果没有配置真实 SMTP，使用 Ethereal 测试账号
  if (!process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    console.log('📧 使用测试邮件账号:', testAccount.user);
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (email, code) => {
  const transporter = await createTransporter();

  // 使用环境变量中的发件人地址，如果没有则使用默认值
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@futureteller.com';

  // 生成邮件 HTML 内容（仿照 Google 验证邮件样式）
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>验证码</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Google Sans', Roboto, Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #202124;">
                您好，
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #202124;">
                您正在注册 易玄宏 账号。请使用以下验证码完成注册：
              </p>
              
              <!-- Verification Code Box -->
              <table role="presentation" style="width: 100%; margin: 32px 0; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 24px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dadce0;">
                    <div style="font-size: 32px; font-weight: 500; letter-spacing: 8px; color: #1a73e8; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                <strong>此验证码将在 5 分钟后过期。</strong>
              </p>
              
              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #5f6368;">
                如果您没有请求此验证码，请忽略此邮件。
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 16px; color: #5f6368;">
                此邮件由 易玄宏 自动发送，请勿回复。
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 16px; color: #5f6368;">
                为了保护您的账号安全，请不要将验证码分享给他人。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // 纯文本版本（用于不支持 HTML 的邮件客户端）
  const textContent = `
易玄宏 验证码

您好，

您正在注册 易玄宏 账号。请使用以下验证码完成注册：

验证码：${code}

此验证码将在 5 分钟后过期。

如果您没有请求此验证码，请忽略此邮件。

---
此邮件由 易玄宏 自动发送，请勿回复。
为了保护您的账号安全，请不要将验证码分享给他人。
  `.trim();

  const info = await transporter.sendMail({
    from: `"易玄宏" <${fromEmail}>`,
    to: email,
    subject: "易玄宏 - 您的注册验证码",
    text: textContent,
    html: htmlContent,
    // 添加邮件头信息，减少被标记为垃圾邮件的可能性
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'List-Unsubscribe': '<mailto:unsubscribe@futureteller.com>',
    },
  });

  console.log("📧 邮件已发送: %s", info.messageId);
  // 如果是测试账号，打印预览链接
  if (!process.env.SMTP_HOST) {
    console.log("🔗 预览 URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

const sendSMS = async (phone, code) => {
  // 模拟发送短信
  console.log(`📱 [模拟短信] 发送给 ${phone}: 您的验证码是 ${code}`);
  return Promise.resolve();
};

module.exports = { sendEmail, sendSMS };

