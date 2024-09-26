const express = require("express");
const clc = require("cli-color");
require("dotenv").config();

//file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");

const app = express();
const PORT = process.env.PORT;

//middlwares

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright(`Server is running at: `));
  console.log(clc.yellowBright.underline.bold(`http://localhost:${PORT}`));
});
