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

  if (!token) return res.sendStatus(401);
  
  return jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired'})
      }
      return res.sendStatus(403);
    }
    req.user = user as User;
    next();
  });
};

router.get("/todos", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
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
    const { description, selectedtime, priority } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime, priority, user_id) VALUES($1, $2, $3, $4) RETURNING *",
      [description, selectedtime, priority, userId]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, completed, selectedtime, priority } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await pool.query(
      "UPDATE todos SET description = $1, completed = $2, selectedtime = $3, priority = $4 WHERE id = $5",
      [description, completed, selectedtime, priority, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/todos/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
