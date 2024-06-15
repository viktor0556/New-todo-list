const express = require("express");
const { Pool } = require("pg");

const router = express.Router();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
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

router.put("/guest-todos/:id", async (req, res) => {
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

router.delete("/guest-todos/:id", async (req, res) => {
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
