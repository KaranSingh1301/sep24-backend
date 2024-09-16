const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

// server.on("request", (req, res) => {
//   const data = "This is sep backend module.";

//   console.log(req.url + " " + req.method);

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Server is up and running....");
//   }
//   //write
//   else if (req.method === "GET" && req.url === "/writefile") {
//     fs.writeFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("write successfull.");
//     });
//     return;
//   }
//   //append
//   else if (req.method === "GET" && req.url === "/appendfile") {
//     fs.appendFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Append successfull");
//     });
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("demo.txt", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//       return res.end(data);
//     });
//   }
//   //delete
//   else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Delete successfull");
//     });
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/renamefile") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename successfull");
//     });
//   }
//   //stream read
//   else if (req.method === "GET" && req.url === "/streamread") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       res.end(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   } else {
//     return res.end(`API not found : ${req.method} ${req.url}`);
//   }
// });

server.on("request", (req, res) => {
  if (req.url === "/fileupload" && req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      console.log("line 74", files);

      const oldPath = files.fileToUpload[0].filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;

      fs.copyFile(oldPath, newPath, (err) => {
        if (err) throw err;

        console.log("file was copied successfully");

        fs.unlink(oldPath, (err) => {
          if (err) throw err;
          console.log("file deleted from old path.");
          return res.end("File uploaded successfully");
        });
      });
    });
  } else {
    fs.readFile("form.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

server.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
