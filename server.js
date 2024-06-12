const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  post: process.env.PG_PORT
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Initial Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      'Select * FROM users WHERE username = $1',
      [username]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    
    const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Initial Server Error' });
  }
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
    const { description, selectedtime } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todos (description, selectedtime) VALUES($1, $2) RETURNING *',
      [description, selectedtime]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed, selectedtime } = req.body;
    await pool.query(
      'UPDATE todos SET description = $1, completed = $2, selectedtime = $3 WHERE id = $4',
      [description, completed, selectedtime, id]
    );
    res.json('Todo was updated!');
  } catch (err) {
    console.error(err.message);
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