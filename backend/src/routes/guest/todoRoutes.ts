import { Pool } from "pg";
import express, { Request, Response } from "express";

const router = express.Router();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

router.get("/guest-todos", async (req: Request, res: Response) => {
  try {
    const allTodos = await pool.query(`
      SELECT todos.*, categories.name as category_name, 
      json_agg(json_build_object('id', tags.id, 'name', tags.name)) as tags
      FROM todos
      LEFT JOIN categories ON todos.category_id = categories.id
      LEFT JOIN todo_tags ON todos.id = todo_tags.todo_id
      LEFT JOIN tags ON todo_tags.tag_id = tags.id
      WHERE todos.user_id IS NULL
      GROUP BY todos.id, categories.name
    `);
    res.json(allTodos.rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/guest-todos", async (req: Request, res: Response) => {
  try {
    const { description, selectedtime, category_id, tags } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (description, selectedtime, category_id) VALUES($1, $2, $3) RETURNING *",
      [description, selectedtime, category_id]
    );
    
    const todoId = newTodo.rows[0].id;

    if (tags && tags.length > 0) {
      const insertTagsQuery = `
        INSERT INTO todo_tags (todo_id, tag_id) VALUES 
        ${tags.map((tagId: number) => `(${todoId}, ${tagId})`).join(", ")}
      `;
      await pool.query(insertTagsQuery);
    }

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
