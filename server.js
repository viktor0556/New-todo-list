const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const usersSignInUp = require('./routes/users-sign-in-up');
const userDatas = require('./routes/user-datas');
const guest = require('./routes/guest')

app.use('/', usersSignInUp);
app.use('/', userDatas);
app.use('/', guest);

app.get('/', (req, res) => {
  res.send('There is nothing to see!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
