import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const pool = new Pool ({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

interface User {
  id: number;
  username: string;
  password: string;
}

router.post("/register", async (req: Request, res: Response) => {
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
  } catch (err: any) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Initial Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const user: User = userResult.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err: any) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Initial Server Error" });
  }
});

export default router;