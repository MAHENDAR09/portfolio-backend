const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); // ✅ Required for parsing JSON
app.use(express.urlencoded({ extended: true }));

app.post('/send-mail', async (req, res) => {
    console.log(req.body);
  const { name, mail, msg } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,      // Your Gmail (receiver login)
        pass: process.env.GMAIL_PASS       // Gmail App Password
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,               // Receiver Gmail
      to: process.env.GMAIL_USER,                 // Send to yourself
      replyTo: mail,                              // So you can reply to sender
      subject: `Message from ${name}`,
      text: `Sender Email: ${mail}\n\nMessage:\n${msg}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
}); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
