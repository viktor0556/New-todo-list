const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  post: process.env.PG_PORT
});

app.get('/', (req, res) => {
  res.send('Todo empty!');
});

app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todos');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todos (description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2',
      [completed, id]
    );
    res.json('Todo was updated!');
  } catch (err) {
    console.error(err.message)
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json('Todo was deleted!');
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});