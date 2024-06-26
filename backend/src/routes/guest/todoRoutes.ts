import express, { Request, Response } from "express";
import pool from "../../db/pool";

const router = express.Router();


router.get("/guest-todos", async (req: Request, res: Response) => {
  try {
    const allTodos = await pool.query(`
      SELECT todos.*, categories.name as category_name, 
      LEFT JOIN categories ON todos.category_id = categories.id
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
        INSERT INTO todo_tags (todo_id) VALUES 
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
