const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { SECRET } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Hashing error" });

    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(query, [name, email, hash], function (dbErr) {
      if (dbErr) {
        console.error(dbErr);
        return res.status(400).json({ message: "Email already exists" });
      }
      const token = jwt.sign({ id: this.lastID, email }, SECRET, { expiresIn: "1d" });
      res.json({ token });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(401).json({ message: "Invalid credentials" });

    bcrypt.compare(password, user.password, (bcryptErr, match) => {
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1d" });
      res.json({ token });
    });
  });
});

module.exports = router;
