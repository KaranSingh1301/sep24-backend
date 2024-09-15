const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-import
const userModel = require("./userSchema");
const isAuth = require("./isAuthMiddleware");

//constants
const app = express();
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/Sep24TestDb`;
const store = new mongodbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form body parser

app.use(
  session({
    secret: "This is sep nodejs class",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

//api
app.get("/", (req, res) => {
  return res.send("Server is up and running");
});

app.get("/register-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Register Form</h1>

    <form action="/register" method="POST">
        <label for="name">Name :</label>
        <input type="text" id="name" name="name"><br>
        <label for="email">Email :</label>
        <input type="text" id="email" name="email"><br>
        <label for="password">Password :</label>
        <input type="text" id="password" name="password"><br>

        <button type="submit">Submit</button>
    </form>

</body>
</html>`);
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  const userObj = new userModel({
    name: name,
    email: email,
    password: password,
  });
  console.log(userObj);

  try {
    const userDb = await userObj.save();

    return res.status(201).json({
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/login-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <h1>login Form</h1>

          <form action="/login" method="POST">
              <label for="email">Email :</label>
              <input type="text" id="email" name="email"><br>
              <label for="password">Password :</label>
              <input type="text" id="password" name="password"><br>

              <button type="submit">Submit</button>
          </form>

      </body>
      </html>`);
});

app.post("/login", async (req, res) => {
  //find the user with email

  const { email, password } = req.body;
  console.log(req.body);

  try {
    const userDb = await userModel.findOne({ email: email });
    // console.log("line 105", userDb);

    if (!userDb)
      return res.status(400).json("User not found, please register first");

    //compare the password
    // console.log(password, userDb.password);

    if (password !== userDb.password)
      return res.status(400).json("Incorrect password.");

    //successfully login
    console.log(req.session);
    req.session.isAuth = true;

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/test", isAuth, (req, res) => {
  return res.send("Private data......");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
