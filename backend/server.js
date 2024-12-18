const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const cors = require("cors");
const twilio = require("twilio");

require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Twilio Configuration
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// MongoDB Connection



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err));



// User Schema
const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: String,
  otpExpiry: Date,
});
const User = mongoose.model("User", userSchema);


const path = require('path');

// Serve React frontend
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// Route: Send OTP
app.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) return res.status(400).json({ message: "Mobile number is required" });
     
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    await User.findOneAndUpdate(
      { mobile },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    await client.messages.create({
      body: `Hello I'm Murugan Your OTP is ${otp}. It will expire in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Route: Validate OTP
app.post("/validate-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) return res.status(400).json({ message: "Mobile number and OTP are required" });

  try {
    const user = await User.findOne({ mobile });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

    res.status(200).json({ message: "OTP validated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to validate OTP" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
