const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());


// 1. CREATE ASSIGNMENT
app.post("/assignments", async (req, res) => {
  const { title, deadline } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO assignments (title, deadline)
       VALUES ($1, $2)
       RETURNING *`,
      [title, deadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});





app.listen(3000, () => {
  console.log("Server running on port 3000");
});