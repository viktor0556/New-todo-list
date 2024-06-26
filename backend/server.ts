import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import usersSignInUp from "./src/routes/User/users-sign-in-up";
import userDatas from "./src/routes/User/user-datas";
import guest from "./src/routes/guest/guest";
import todoRoutes from './src/routes/guest/todoRoutes';
import categoryRoutes from './src/routes/Tag-category/categoryRoutes';

app.use('/', usersSignInUp);
app.use('/', userDatas);
app.use('/', guest);
app.use('/', todoRoutes);
app.use('/', categoryRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('There is nothing to see!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
