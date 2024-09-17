const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

//file-imports
const { userDataValidate } = require("./utils/authUtil");
const userModel = require("./models/userModel");

//constants
const app = express();
const PORT = process.env.PORT || 8000;

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middlwares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//API's
app.get("/", (req, res) => {
  return res.send("Server is up and running");
});

app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidate({ name, username, email, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  const userObj = new userModel({
    name: name,
    email: email,
    username: username,
    password: password,
  });

  try {
    const userDb = await userObj.save();

    return res.status(201).json({
      message: "Register successfull",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
