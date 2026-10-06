const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("...");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("Username:", username);
  console.log("Password:", password);
  res.send("Signup data received!");
});