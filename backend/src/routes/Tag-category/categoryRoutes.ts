import express, { Request, Response } from "express";

const router = express.Router();

const fixedCategories = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Shopping' },
  { id: 3, name: 'Work' },
];

router.get('/categories', (req: Request, res: Response) => {
  res.json(fixedCategories);
});

export default router;
