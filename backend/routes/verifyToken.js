const express = require("express");
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = express.Router();

require("dotenv").config();

// Secret key — make sure it's the same one used when generating the token
const SECRET_KEY = process.env.JWT_SECRET;

router.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  //   console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get token after 'Bearer'

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Optionally, return some user info from the token
    res.json({ success: true, user: decoded });
  });
});

module.exports = router;
