import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required.",
      });
    }

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   
  port: 587,               
  secure: false,           
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    res.json({ message: "Message sent successfully." });
  } catch (error) {
    console.log("Contact email error:", error);
    res.status(500).json({
      message: "Failed to send message.",
    });
  }
});

export default router;