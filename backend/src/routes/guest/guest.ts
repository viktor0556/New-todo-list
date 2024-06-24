import express, { Request, Response } from "express";

const router = express.Router();

interface Todo {
  id: number;
  description: string;
  selectedtime: string;
  completed: boolean;
}

let guestTodos: Todo[] = [];
let nextId = 1; 

router.get("/guest-todos", async (req: Request, res: Response) => {
  res.json(guestTodos);
});

router.post("/guest-todos", async (req: Request, res: Response) => {
  const { description, selectedtime } = req.body;
  const newTodo = {
    id: nextId++,
    description,
    selectedtime,
    completed: false,
  };
  guestTodos.push(newTodo);
  res.json(newTodo);
});

export default router;