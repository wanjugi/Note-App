import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load .env variables specifically for this file if needed
dotenv.config(); 

// 1. Create the "Transporter"
// This is the object that knows HOW to send mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Define the "Send Notification" function
export const sendNoteNotification = async (toEmail, fromUsername, noteTitle) => {
  try {
    // The actual email content
    const info = await transporter.sendMail({
      from: `"NoteApp Admin" <${process.env.SMTP_USER}>`, // Sender address
      to: toEmail, // Recipient address (from the user in DB)
      subject: `📝 New Note Assigned: "${noteTitle}"`, // Subject line
      // You can use plain text...
      text: `Hello! ${fromUsername} has assigned you a new note titled "${noteTitle}". Log in to view it.`,
      // ...or nice HTML
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0ea5e9;">You have a new note!</h2>
          <p><strong>${fromUsername}</strong> just assigned a note to you.</p>
          <hr>
          <p><strong>Title:</strong> ${noteTitle}</p>
          <hr>
          <p>Log in to your NoteApp to read it.</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};