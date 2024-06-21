import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import usersSignInUp from "./routes/users-sign-in-up";
import userDatas from "./routes/user-datas";
import guest from "./routes/guest";

app.use('/', usersSignInUp);
app.use('/', userDatas);
app.use('/', guest);

app.get('/', (req: Request, res: Response) => {
  res.send('There is nothing to see!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
