const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");

const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlwares
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

// /blog/create-blog
app.use("/auth", authRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright(`Server is running at: `));
  console.log(clc.yellowBright.underline.bold(`http://localhost:${PORT}`));
});
