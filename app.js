const express = require("express");
const app = express();
const body1 = require("body-parser");
const Student1 = require("./connect");
const encoded = body1.urlencoded({ extended: false });

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", encoded, async (req, res) => {
  let student = await Student1(req.body);
  student
    .save()
    .then(() => {
      res.send(`
            <h2>User registered successfully!</h2>
            <p>Click <a href="/login">here</a> to login or click <a href="/">here</a> for register another user.</p>
        `);
    })
    .catch((err) => console.log(err));
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/loggedin", encoded, async (req, res) => {
  const username1 = req.body.username;
  const password1 = req.body.password;
  Student1.findOne({ fname: username1, password: password1 })
    .then((student) => {
      if (student) {
        res.redirect("/dashboard");
      } else {
        res.status(401).send("Invalid username or password");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/dashboard", (req, res) => {
  res.redirect("http://127.0.0.1:5500/index.html");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
