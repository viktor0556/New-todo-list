const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  post: process.env.PG_PORT,
});

const usersRouter = require('./routes/users');
const todoRouter = require('./routes/todos');

app.use('/', usersRouter);
app.use('/', todoRouter);

app.get('/', (req, res) => {
  res.send('There is nothing to see!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
