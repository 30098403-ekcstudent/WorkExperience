const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "replace-this-with-a-long-random-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}));

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

app.post("/check-username", (req, res) => {
  const { username } = req.body;

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

      return res.status(200).send("Username available.");
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.execute(
    "SELECT id, username, password_hash FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).send("Database error.");
      }

      if (results.length === 0) {
        return res.status(401).send("Invalid username or password.");
      }

      const user = results[0];

      bcrypt.compare(password, user.password_hash, (compareErr, match) => {
        if (compareErr) {
          return res.status(500).send("Password verification failed.");
        }

        if (!match) {
          return res.status(401).send("Invalid username or password.");
        }

        req.session.user = {
          id: user.id,
          username: user.username
        };
        return res.status(200).send("Login successful!");
      });
    }
  );
});

app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not signed in." });
  }

  return res.status(200).json(req.session.user);
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }

    res.clearCookie("connect.sid");
    res.send("Logged out successfully!");
  });
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});