import express, { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const router = express.Router();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

interface User {
  id: Number,
  username: string;
  password: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        console.error("Token Verification Error:", (err as Error).message);
        return res.sendStatus(403);
      }
      req.user = user as User;
      next();
    });
  }
};

router.get("/todos", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const allTodos = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/todos", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { description, selectedtime } = req.body;
    const userId = req.user?.id;
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime, user_id) VALUES($1, $2, $3) RETURNING *",
      [description, selectedtime, userId]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/guest-todos", async (req: Request, res: Response) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todos WHERE user_id IS NULL"
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/guest-todos", async (req: Request, res: Response) => {
  try {
    const { description, selectedtime } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime) VALUES($1, $2) RETURNING *",
      [description, selectedtime]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, completed, selectedtime } = req.body;
    await pool.query(
      "UPDATE todos SET description = $1, completed = $2, selectedtime = $3 WHERE id = $4",
      [description, completed, selectedtime, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
