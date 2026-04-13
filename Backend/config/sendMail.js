import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Send an email using async/await
const sendMail = async (to,otp) => {
  const info = await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Reset Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>.
    It expires in 5 minutes.</p>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

export default sendMail;