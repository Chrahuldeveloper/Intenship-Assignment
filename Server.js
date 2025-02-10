const express = require("express");
const { createPool } = require("mysql2");
const cors = require("cors");
const generateGitFile = require('giv-gitignore');

const app = express();
const PORT = 3000;
generateGitFile();

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "todos",
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js Application is running!");
  console.log("Hello");
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  const sql = "INSERT INTO todo (title, description) VALUES (?, ?)";
  pool.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task added successfully", taskId: result.insertId });
  });
});

app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM todo";
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE todo SET completed = TRUE WHERE id = ?";
  pool.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task marked as completed" });
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM todo WHERE id = ?";
  pool.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
