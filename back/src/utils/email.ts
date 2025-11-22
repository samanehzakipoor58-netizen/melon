import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
  // تنظیمات واقعی SMTP خودتان را جایگزین کنید
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: "username",
      pass: "password",
    },
  });

  await transporter.sendMail({
    from: '"Melon App" <no-reply@melon.com>',
    to,
    subject,
    text,
  });
}
