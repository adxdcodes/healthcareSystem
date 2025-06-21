const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user"); // Import User model

dotenv.config();
const router = express.Router();

// for Getting last PatientId and creating new
// Utility to generate next patientId like PAT001, PAT002
const generateNextPatientId = async () => {
  const lastUser = await User.findOne().sort({ _id: -1 }); // get latest user
  if (!lastUser || !lastUser.patientId) {
    return "PAT001";
  }

  const lastId = parseInt(lastUser.patientId.replace("PAT", ""), 10);
  const nextId = lastId + 1;
  return "PAT" + String(nextId).padStart(3, "0");
};

// Register API
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    // Check if user already exists
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const patientId = await generateNextPatientId();
    // if not, then hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      patientId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, patientId: user.patientId },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
