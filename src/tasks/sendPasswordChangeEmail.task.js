import { transporter } from "#configs/nodeMailler.js";

export default async function sendPasswordChangedEmailTask({ email }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Mật khẩu của bạn đã được thay đổi",
    html: `
      <h2>Thông báo bảo mật</h2>

      <p>
        Mật khẩu cho tài khoản <b>${email}</b> vừa được thay đổi thành công.
      </p>

      <p>
        Nếu <b>chính bạn</b> thực hiện hành động này, bạn có thể bỏ qua email này.
      </p>

      <p style="color:#cf1322">
        ⚠️ Nếu bạn <b>KHÔNG</b> thực hiện thay đổi này, vui lòng:
      </p>

      <ul>
        <li>Đăng nhập ngay và đổi lại mật khẩu</li>
        <li>Liên hệ bộ phận hỗ trợ</li>
      </ul>

      <p style="margin-top:24px;font-size:12px;color:#888">
        Đây là email tự động, vui lòng không trả lời.
      </p>
    `,
  });
}
