const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test",
  database: "signup_project"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }

  console.log("Connected to MySQL!");
});



const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("...");
});


app.post("/signup", (req, res) => {
  const { username, password } = req.body;


  db.execute(
    "SELECT id FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).send("Database error.");
      }
      if (results.length > 0) {
        return res.status(409).send("Username already taken.");
      }
      console.log("Username is available!");


      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).send("Password hashing failed.");
        }
        db.execute(
          "INSERT INTO users (username, password_hash) VALUES (?, ?)",
          [username, hashedPassword],
          (insertErr, results) => {
            if (insertErr) {
              return res.status(500).send("Could not create account.");
            }
            return res.status(201).send("Account created successfully!");
          }
        );
      });
    }
  );
});