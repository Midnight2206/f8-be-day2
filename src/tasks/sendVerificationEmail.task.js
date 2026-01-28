import { signMailToken } from "#utils/jwt.js";
import { transporter } from "#configs/nodeMailler.js";

export default async function sendVerificationEmailTask({ userId, email }) {
  const token = signMailToken({userId, email})

  const verifyUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Xác thực tài khoản",
    html: `
      <h2>Xác thực email</h2>
      <p>Vui lòng nhấn nút bên dưới để xác thực tài khoản của bạn:</p>

      <a href="${verifyUrl}"
         style="
           display:inline-block;
           padding:12px 20px;
           background:#1677ff;
           color:#fff;
           text-decoration:none;
           border-radius:6px;
         ">
        Xác thực email
      </a>

      <p>Link này sẽ hết hạn sau <b>2 giờ</b>.</p>
    `,
  });
}
