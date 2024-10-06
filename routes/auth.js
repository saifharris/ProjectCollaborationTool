const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register new users
router.post("/register", async (req, res) => {
  const { name, email, password, designation } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    user = new User({ name, email, password: hashedPassword, designation });
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login existing users
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
