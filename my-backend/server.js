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


function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("Please log in first.");
  }

  next();
}

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
          (insertErr) => {
            if (insertErr) {
              return res.status(500).send("Could not create account.");
            }

            req.session.user = {
              id: results.insertId,
              username: username
            };

            req.session.save((sessionErr) => {
              if (sessionErr) {
                return res.status(500).send("Account created, but login failed.");
              }
              return res.status(201).send("Account created and logged in successfully!");
            });
          }
        );
      });
    }
  );
});

app.post("/notes", requireLogin, (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    title.trim() === "" ||
    content.trim() === ""
  ) {
    return res.status(400).send("Title and content are required.");
  }

  db.execute(
    "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)",
    [title.trim(), content.trim(), userId],
    (err, results) => {
      if (err) {
        console.error("Could not save note:", err);
        return res.status(500).send("Could not save note.");
      }

      return res.status(201).json({
        message: "Note saved successfully!",
        id: results.insertId
      });
    }
  );
});


app.get("/notes", requireLogin, (req, res) => {
  const userId = req.session.user.id;
  db.execute(
    "SELECT id, title, content FROM notes WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Could not retrieve notes:", err);
        return res.status(500).send("Could not retrieve notes.");
      }

      return res.status(200).json(results);
    }
  );
});

app.delete("/notes/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  db.execute(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) {
        console.error("Could not delete note:", err);
        return res.status(500).send("Could not delete note.");
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Note not found.");
      }

      return res.status(200).send("Note deleted successfully!");
    }
  );
});

app.put("/notes/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.session.user.id;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    title.trim() === "" ||
    content.trim() === ""
  ) {
    return res.status(400).send("Title and content are required.");
  }

  db.execute(
    "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
    [title.trim(), content.trim(), id, userId],
    (err, results) => {
      if (err) {
        console.error("Could not update note:", err);
        return res.status(500).send("Could not update note.");
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Note not found, or nothing changed.");
      }

      return res.status(200).send("Note updated successfully!");
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});