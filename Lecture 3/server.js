const express = require("express");

const app = express();

//middleware
const fun = (req, res, next) => {
  console.log("middleware is working");
  next();
};

app.use(fun);

//api
app.get("/", (req, res) => {
  return res.send("Server is up and running");
});

app.get("/api", fun, (req, res) => {
  console.log("api is working");
  return res.send("API is working");
});

app.get("/api1", (req, res) => {
  console.log("api1 is working");
  return res.send("API1 is working");
});

//query
// ?key=val
app.get("/add", (req, res) => {
  console.log(req.query);
  const val = req.query.key;
  return res.send(`Query value is Key : ${val}`);
});

// ?key1=val1&key2=val2
app.get("/sub", (req, res) => {
  console.log(req.query);
  const val1 = req.query.key1;
  const val2 = req.query.key2;
  return res.send(`Query value is Key1 : ${val1} & key2 : ${val2}`);
});

// ?key=val1,val2
app.get("/mul", (req, res) => {
  console.log(req.query);
  console.log(req.query.key.split(","));
  const valArray = req.query.key.split(",");
  const val1 = valArray[0];
  const val2 = valArray[1];
  return res.send(`Query value is Key1 : ${val1} & key2 : ${val2}`);
});

//params
app.get("/profile/:name", (req, res) => {
  console.log(req.params);
  const name = req.params.name;
  return res.send(`Name : ${name}`);
});

app.get("/profile/:first/:last", (req, res) => {
  console.log(req.params);
  const name = req.params.name;
  const { first, last } = req.params;
  return res.send(`First name : ${first} & Last name : ${last}`);
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
