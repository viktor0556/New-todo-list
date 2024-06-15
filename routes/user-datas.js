const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const router = express.Router();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("Token Verification Error:", err.message);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
};

router.get("/todos", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const allTodos = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/todos", authenticateToken, async (req, res) => {
  try {
    const { description, selectedtime } = req.body;
    const userId = req.user.id;
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime, user_id) VALUES($1, $2, $3) RETURNING *",
      [description, selectedtime, userId]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/guest-todos", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todos WHERE user_id IS NULL"
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/guest-todos", async (req, res) => {
  try {
    const { description, selectedtime } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime) VALUES($1, $2) RETURNING *",
      [description, selectedtime]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed, selectedtime } = req.body;
    await pool.query(
      "UPDATE todos SET description = $1, completed = $2, selectedtime = $3 WHERE id = $4",
      [description, completed, selectedtime, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
