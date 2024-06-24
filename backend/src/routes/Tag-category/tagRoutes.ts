import express, { Request, Response } from "express";
import { Pool } from "pg";

const router = express.Router();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

router.get("/tags", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tags");
    res.json(result.rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/tags", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
