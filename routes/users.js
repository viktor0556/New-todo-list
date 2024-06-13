const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const pool = new Pool ({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    res.json(newUser.rows[0]);
    console.log("Successful registration");
    console.log(`username: ${username}, password: ${password}`);
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Initial Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        username: user.rows[0].username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Initial Server Error" });
  }
});

module.exports = router;