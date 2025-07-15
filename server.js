const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const msg = {
    to: email,
    from: "your_verified_sender@example.com",
    subject: "Canvas Form Submission",
    text: `You entered: ${email}`,
  };

  try {
    await sgMail.send(msg);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

