const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  console.log("/home api is working");
  console.log(req);
  res.send("Server is up and running");
});

// app.get('/home1', (req, res)=>{

// })

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
